import { getCurrentViewSpec } from './plot.js';
import { PlotSpecManager } from './PlotSpecManager.js'; // Correct import

window.plotSpecManager = new PlotSpecManager(); // Initialize PlotSpecManager globally

const fileHeaders = new Map();


/**
 * Handle various options for data, such as file or server URL.
 * 
 * @param {File|Blob} data - Data object, either a local file or a Blob from a server.
 * @param {number} button_data_track_number - Button data track number.
 */
export async function handleOptions(data, button_data_track_number) {
  const plotSpec = getCurrentViewSpec(); // Get the current plot spec
  const columnSelectorsX = document.querySelectorAll(`.columnSelectorX`);
  const columnSelectorsY = document.querySelectorAll(`.columnSelectorY`);
  let header = []; // Declare header outside the if-else blocks
  // Check if the provided data is a file or a URL
  if (data instanceof File) {
    // Data is a local file, use FileReader to extract header
    header = await extractHeader(data, button_data_track_number, plotSpec);
    // Proceed with handling the extracted header...
  } else if (data instanceof Blob) {
    // Data is a Blob (assumed to be from a server)
    header = await extractHeaderFromServer(data, button_data_track_number, plotSpec);
    // Proceed with handling the extracted header...
  } else {
    let msg = document.getElementById(`msg-load-track-${button_data_track_number}`);
    msg.textContent = "Invalid data type. Expected File or Blob.";
    msg.className = "error-msg";
    console.error("Invalid data type. Expected File or Blob.");
  }
  // Creating the dropdown menu for each track

  if (!fileHeaders.has(button_data_track_number)) {
    fileHeaders.set(button_data_track_number, new Set());
  }

  const columns = fileHeaders.get(button_data_track_number);

  if (!arraysEqual(Array.from(columns), header)) {
    columns.clear();
    header.forEach(column => {
      columns.add(column);
    });

    columnSelectorsX.forEach(columnSelectorX => {
      clearOptions(columnSelectorX);
      header.forEach((column, index) => {
        const optionX = document.createElement('option');
        optionX.value = index;
        optionX.textContent = column;
        columnSelectorX.appendChild(optionX);
      });
    });

    columnSelectorsY.forEach(columnSelectorY => {
      clearOptions(columnSelectorY);
      header.forEach((column, index) => {
        const optionY = document.createElement('option');
        optionY.value = index;
        optionY.textContent = column;
        columnSelectorY.appendChild(optionY);
      });
    });
  }

  columnSelectorsX.forEach(columnSelectorX => {
    columnSelectorX.addEventListener('change', async function () {
      const trackCountValue = document.getElementById("trackCountSelector").value;            
      const selectedValue = columnSelectorX.value;
      const chosenColumnName = columnSelectorX.options[selectedValue].textContent;
      for (let trackValue = 0; trackValue < trackCountValue; trackValue++) {
        plotSpec.tracks[trackValue].data.column = chosenColumnName;
        plotSpec.tracks[trackValue].x.field = chosenColumnName;
        plotSpec.tracks[trackValue].tooltip[1].field = chosenColumnName;
        plotSpec.tracks[trackValue].tooltip[1].alt = chosenColumnName;
      }                
      updateURLParameters("x.field", chosenColumnName);
    });
  });

  let columnSelectorL = document.getElementById('columnSelectorYLeft');
  columnSelectorL.addEventListener('change', async function () {
    await _eventsSelectedTracksPerYAxis(columnSelectorL, 'left', plotSpec);
  });
  let columnSelectorR = document.getElementById('columnSelectorYRight');
  columnSelectorR.addEventListener('change', async function () {
    await _eventsSelectedTracksPerYAxis(columnSelectorR, 'right', plotSpec);
  });

  const markButtons = document.querySelectorAll('.mark');
  markButtons.forEach(button => {
      button.addEventListener('change', async function () {
          const trackValue = button.getAttribute('data-track');
          const chosenmark = button.value;
          const plotSpec = getCurrentViewSpec();
          plotSpec.tracks[trackValue].mark = chosenmark;
              await updateURLParameters(`mark${trackValue}`, chosenmark);
      });
  });
  
  const colorButtons = document.querySelectorAll('.color');
  colorButtons.forEach(button => {
      button.addEventListener('change', async function () {
          const trackValue = button.getAttribute('data-track');
          const chosencolor = button.value;
          const plotSpec = getCurrentViewSpec();
          plotSpec.tracks[trackValue].color.value = chosencolor;
              await updateURLParameters(`color.value${trackValue}`, chosencolor);
      });
  });

  bcolor.addEventListener('change', async function () {
    const chosenBcolor = bcolor.value;
    plotSpec.style.background = chosenBcolor;
    await updateURLParameters("background", bcolor.value);
  });

  const x_interval_buttons = document.querySelectorAll('.x_interval_button');
  x_interval_buttons.forEach(button => {
    button.addEventListener('click', async function () {
      const startValue = document.getElementById('x_range_start').value;
      const endValue = document.getElementById('x_range_end').value;
      const start = parseFloat(startValue);
      const end = parseFloat(endValue);    
      const intervalArray = [start, end];
      plotSpec.xDomain.interval = intervalArray;    
    
      const xDomain = "xDomain.interval";
      updateURLParameters(xDomain, intervalArray);
    });
  });    
  const y_interval_buttons = document.querySelectorAll('.y_interval_button');
  y_interval_buttons.forEach((button, i) => {
    button.addEventListener('click', async function () {
      _eventsSelectedTracksPerYAxis(columnSelectorL, 'left', plotSpec);
      _eventsSelectedTracksPerYAxis(columnSelectorR, 'right', plotSpec);
    });
  });

  const binsizeButtons = document.querySelectorAll('.binsize');
  binsizeButtons.forEach(button => {
    button.addEventListener('click', async function () {
      const trackValue = button.getAttribute('data-track');
      const inputField = document.getElementById(`binsize_${trackValue}`);
      const chosenbinsize = parseFloat(inputField.value);
      const plotSpec = getCurrentViewSpec();
      plotSpec.tracks[trackValue].data.binSize = chosenbinsize;
      const binSize = "data.binSize" + trackValue.toString();
      updateURLParameters(binSize, chosenbinsize);
    });
  });
  
  const samplelengthButtons = document.querySelectorAll('.samplelength');
  samplelengthButtons.forEach(button => {
    button.addEventListener('click', async function () {
      const trackValue = button.getAttribute('data-track');
      const inputField = document.getElementById(`samplelength_${trackValue}`);
      const chosensamplelength = parseFloat(inputField.value);
      const plotSpec = getCurrentViewSpec();
      plotSpec.tracks[trackValue].data.sampleLength = chosensamplelength;
      const sampleLength = "data.sampleLength" + trackValue.toString();
      updateURLParameters(sampleLength, chosensamplelength);
    });
  });

  const marksizeButtons = document.querySelectorAll('.marksize');
  marksizeButtons.forEach(button => {
    button.addEventListener('click', async function () {
      const trackValue = button.getAttribute('data-track');
      const inputField = document.getElementById(`marksize_${trackValue}`);
      const chosenmarksize = parseFloat(inputField.value);
      plotSpec.tracks[trackValue].size.value = chosenmarksize;
      const markSize = "size.value" + trackValue.toString();            
      updateURLParameters(markSize, chosenmarksize);
    });
  });

  let formL = document.getElementById(`checkbox-left-axis`);
  let checkboxesL = formL.querySelectorAll('input[type="checkbox"]');
  checkboxesL.forEach(function(checkbox) {
    checkbox.addEventListener('click', async function() {
      await _eventsSelectedTracksPerYAxis(columnSelectorL, 'left', plotSpec);
    });
    checkbox.addEventListener('change', async function() {
      await _eventsSelectedTracksPerYAxis(columnSelectorL, 'left', plotSpec);
    });
  });
  let formR = document.getElementById(`checkbox-right-axis`);
  let checkboxesR = formR.querySelectorAll('input[type="checkbox"]');
  checkboxesR.forEach(function(checkbox) {
    checkbox.addEventListener('click', async function() {
      await _eventsSelectedTracksPerYAxis(columnSelectorR, 'right', plotSpec);
    });
    checkbox.addEventListener('change', async function() {
      await _eventsSelectedTracksPerYAxis(columnSelectorR, 'right', plotSpec);
    });
  });

  let msg = document.getElementById(`msg-load-track-${button_data_track_number}`);
  msg.textContent = "File loaded successfully";
  msg.className = "success-msg";
}

async function _eventsSelectedTracksPerYAxis(columnSelector, side, plotSpec) {    
  const form = document.getElementById(`checkbox-${side}-axis`);
  const checkboxes = form.querySelectorAll('input[type="checkbox"]:checked');
  const selectedOptions = [];
  checkboxes.forEach(function(checkbox) {
    selectedOptions.push(parseInt(checkbox.value.slice(-1)));
  });
  const startValue = document.getElementById(`y_start_${side}`).value;
  const endValue = document.getElementById(`y_end_${side}`).value;
  const start = parseFloat(startValue);
  const end = parseFloat(endValue);
  const intervalArray = [start, end];
  const selectedValue = columnSelector.value;
  const chosenColumnName = columnSelector.options[selectedValue].textContent;
  selectedOptions.forEach(function(trackValue) {
    plotSpec.tracks[trackValue - 1].data.value = chosenColumnName;            
    if (!(Number.isNaN(intervalArray[0]) || Number.isNaN(intervalArray[0]))){
      plotSpec.tracks[trackValue - 1].y.domain = intervalArray;
    }            
    plotSpec.tracks[trackValue - 1].y.axis = side;
    plotSpec.tracks[trackValue - 1].y.field = chosenColumnName;
    plotSpec.tracks[trackValue - 1].tooltip[0].field = chosenColumnName;
    plotSpec.tracks[trackValue - 1].tooltip[0].alt = chosenColumnName; 
  });            
  if (side === 'right') {
    updateURLParameters("y.field1", chosenColumnName);
  } else {
    updateURLParameters("y.field0", chosenColumnName);
  }        
}

/**
 * Clear options from a select element.
 * 
 * @param {HTMLSelectElement} selectElement - Select element to clear options from.
 */
function clearOptions(selectElement) {
  while (selectElement.options.length > 0) {
    selectElement.remove(0);
  }
}

/**
 * Check if two arrays are equal.
 * 
 * @param {Array} arr1 - First array.
 * @param {Array} arr2 - Second array.
 * @returns {boolean} - True if arrays are equal, false otherwise.
 */
function arraysEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) return false;
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) return false;
  }
  return true;
}

/**
 * Extract the header from a local file using FileReader.
 * 
 * @param {File} file - Local file.
 * @param {number} button_data_track_number - Button data track number.
 * @param {object} plotSpec - The plot specification object.
 * @returns {Promise<Array>} - Promise resolving to the extracted header.
 */
async function extractHeader(file, button_data_track_number, plotSpec) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result;
      const data = text.split('\n').map(row => row.split(plotSpec.tracks[button_data_track_number].data.separator));
      const header = data[0];
      resolve(header);
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

/**
 * Extract the header from server data using a Blob. 
 * @param {Blob} fileBlob - Blob data from the server.
 * @param {number} button_data_track_number - Button data track number.
 * @param {object} plotSpec - The plot specification object.
 * @returns {Promise<Array>} - Promise resolving to the extracted header.
 */
async function extractHeaderFromServer(fileBlob, button_data_track_number, plotSpec) {
  try {
    const text = await new Response(fileBlob).text();
    const data = text.split('\n').map(row => row.split(plotSpec.tracks[button_data_track_number].data.separator));
    const header = data[0];
    return header;
  } catch (error) {
    console.error('Error fetching or processing data:', error);
    return null;
  }
}

/**
 * Update URL parameters with a new parameter and its value.
 * 
 * @param {string} parameter - Parameter name.
 * @param {string|number} value - Parameter value.
 */
export async function updateURLParameters(parameter, value) {
  var url = new window.URL(document.location);
  url.searchParams.set(parameter, value);
  history.pushState({}, '', url);
}