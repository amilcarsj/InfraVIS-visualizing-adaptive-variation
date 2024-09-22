import { getCurrentViewSpec, GoslingPlotWithLocalData } from './plot.js';
import { PlotSpecManager } from './PlotSpecManager.js'; // Correct import


window.canvas_states = {
  0: { trackCount: 1, tracks: [],filenames:{}, view_control_settings: {x_axis: '', x_range: [0, 200000], left_y_axis: '', left_y_range: [0, 1], right_y_axis: '', right_y_range: [0, 1], checked_left : [], checked_right : []}},
  1: { trackCount: 1, tracks: [],filenames:{}, view_control_settings: {x_axis: '', x_range: [0, 200000], left_y_axis: '', left_y_range: [0, 1], right_y_axis: '', right_y_range: [0, 1], checked_left : [], checked_right : []}},
  2: { trackCount: 1, tracks: [],filenames:{}, view_control_settings: {x_axis: '', x_range: [0, 200000], left_y_axis: '', left_y_range: [0, 1], right_y_axis: '', right_y_range: [0, 1], checked_left : [], checked_right : []}},
  3: { trackCount: 1, tracks: [],filenames:{}, view_control_settings: {x_axis: '', x_range: [0, 200000], left_y_axis: '', left_y_range: [0, 1], right_y_axis: '', right_y_range: [0, 1], checked_left : [], checked_right : []}}
};

window.currentView = 1
window.canvas_num  = 0;
window.object_0_created = false;
window.object_1_created = false;
window.object_2_created = false;
window.object_3_created = false;
window.trackCount = 5;
window.displayed_canvas = 1

window.plotSpecManager = new PlotSpecManager(); // Initialize PlotSpecManager globally

const fileHeaders = new Map();


/**
 * Handle various options for data, such as file or server URL.
 * 
 * @param {File|Blob} data - Data object, either a local file or a Blob from a server.
 * @param {number} button_data_track_number - Button data track number.
 */
export async function handleOptions(data, button_data_track_number, canvasNum) {
  const plotSpec = window.plotSpecManager.getPlotSpec(canvasNum);

  if (!plotSpec) {
    console.error(`PlotSpec not found for canvas ${canvasNum}.`);
    return;
  }

  // Find the view with the matching canvas ID
  const viewSpec = plotSpec.views.find(view => view.id === `canvas${canvasNum}`);

  if (!viewSpec) {
    console.error(`ViewSpec not found for canvas ID canvas${canvasNum}.`);
    return;
  }

  if (!viewSpec.tracks) {
    console.error(`Tracks not found in viewSpec for canvas ${canvasNum}.`);
    return;
  }

 

  const columnSelectorsX = document.querySelectorAll(`.columnSelectorX`);
  const columnSelectorsY = document.querySelectorAll(`.columnSelectorY`);

  let header = [];
  let geneData = [];
  if (!plotSpec) {
    console.error(`PlotSpec not found for canvas ${canvasNum}.`);
    return;
  }

  if (!viewSpec.tracks) {
    console.error(`Tracks not found in plotSpec for canvas ${canvasNum}.`);
    return;
  }
  // Check if the provided data is a file or a URL
  if (canvasNum !== 0) {
    // For non-GFF data, set the URL for the current track
    const fileURL = URL.createObjectURL(data);
    viewSpec.tracks[button_data_track_number].data.url = fileURL;
    // Remove indexUrl for non-GFF data
    delete viewSpec.tracks[button_data_track_number].data.indexUrl;
  }
  if (data instanceof File) {
    if (canvasNum  === 0) {
      // GFF data
      const geneHeaderResult = await extractGeneHeader(data);
      header = geneHeaderResult.header;
      geneData = geneHeaderResult.data;
      
      // Ensure URLs are set for all tracks
      viewSpec.tracks.forEach(track => {
        if (!track.data.url || !track.data.indexUrl) {
          console.error('URL or indexURL is not set for a track');
        }
      });
    } else {
      header = await extractHeader(data, button_data_track_number, viewSpec.tracks);
    }
  } else if (data instanceof Blob) {
    header = await extractHeaderFromServer(data, button_data_track_number, viewSpec.tracks);
  } else {
    let msg = document.getElementById(`msg-load-track-${button_data_track_number}`);
    msg.textContent = "Invalid data type. Expected File or Blob.";
    msg.className = "error-msg";
    console.error("Invalid data type. Expected File or Blob.");
    return; // Exit the function early
  }

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

    // Update the tooltip for each track dynamically based on the available columns
    updateDynamicTooltips(viewSpec.tracks, header, canvasNum);
  
  }

  columnSelectorsX.forEach(columnSelectorX => {
    columnSelectorX.addEventListener('change', async function () {
      const trackCountValue = document.getElementById("trackCountSelector").value;            
      const selectedValue = columnSelectorX.value;
      const chosenColumnName = columnSelectorX.options[selectedValue].textContent;
  
      for (let trackValue = 0; trackValue < trackCountValue; trackValue++) {
        viewSpec.tracks[trackValue].data.column = chosenColumnName;
  
        if (canvasNum  !== 0) { // Only modify tooltips for non-GFF data
          viewSpec.tracks[trackValue].tooltip[1].field = chosenColumnName;
          viewSpec.tracks[trackValue].tooltip[1].alt = chosenColumnName;
        }
      }                
  
      updateURLParameters("x.field", chosenColumnName);
    });
  });

  let columnSelectorL = document.getElementById('columnSelectorYLeft');
  columnSelectorL.addEventListener('change', async function () {
    await _eventsSelectedTracksPerYAxis(columnSelectorL, 'left', viewSpec, canvasNum);
  });
  let columnSelectorR = document.getElementById('columnSelectorYRight');
  columnSelectorR.addEventListener('change', async function () {
    await _eventsSelectedTracksPerYAxis(columnSelectorR, 'right', viewSpec, canvasNum);
  });

  const markButtons = document.querySelectorAll('.mark');
  markButtons.forEach(button => {
      button.addEventListener('change', async function () {
          const trackValue = button.getAttribute('data-track');
          const chosenmark = button.value;
          viewSpec.tracks[trackValue].mark = chosenmark;
              await updateURLParameters(`mark${trackValue}`, chosenmark);
      });
  });
  
  const colorButtons = document.querySelectorAll('.color');
  colorButtons.forEach(button => {
      button.addEventListener('change', async function () {
          const trackValue = button.getAttribute('data-track');
          const chosencolor = button.value;
          viewSpec.tracks[trackValue].color.value = chosencolor;
              await updateURLParameters(`color.value${trackValue}`, chosencolor);
      });
  });

  bcolor.addEventListener('change', async function () {
    const chosenBcolor = bcolor.value;
    viewSpec.style.background = chosenBcolor;
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
      viewSpec.xDomain.interval = intervalArray;    
    
      const xDomain = "xDomain.interval";
      updateURLParameters(xDomain, intervalArray);
    });
  });    
  const y_interval_buttons = document.querySelectorAll('.y_interval_button');
  y_interval_buttons.forEach((button, i) => {
    button.addEventListener('click', async function () {
      _eventsSelectedTracksPerYAxis(columnSelectorL, 'left', viewSpec, canvasNum);
      _eventsSelectedTracksPerYAxis(columnSelectorR, 'right', viewSpec, canvasNum);
    });
  });

  const binsizeButtons = document.querySelectorAll('.binsize');
  binsizeButtons.forEach(button => {
    button.addEventListener('click', async function () {
      const trackValue = button.getAttribute('data-track');
      const inputField = document.getElementById(`binsize_${trackValue}`);
      const chosenbinsize = parseFloat(inputField.value);
      viewSpec.tracks[trackValue].data.binSize = chosenbinsize;
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
      viewSpec.tracks[trackValue].data.sampleLength = chosensamplelength;
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
      viewSpec.tracks[trackValue].size.value = chosenmarksize;
      const markSize = "size.value" + trackValue.toString();            
      updateURLParameters(markSize, chosenmarksize);
    });
  });

  let formL = document.getElementById(`checkbox-left-axis`);
  let checkboxesL = formL.querySelectorAll('input[type="checkbox"]');
  checkboxesL.forEach(function(checkbox) {
    checkbox.addEventListener('click', async function() {
      await _eventsSelectedTracksPerYAxis(columnSelectorL, 'left', viewSpec, canvasNum);
    });
    checkbox.addEventListener('change', async function() {
      await _eventsSelectedTracksPerYAxis(columnSelectorL, 'left', viewSpec, canvasNum);
    });
  });
  let formR = document.getElementById(`checkbox-right-axis`);
  let checkboxesR = formR.querySelectorAll('input[type="checkbox"]');
  checkboxesR.forEach(function(checkbox) {
    checkbox.addEventListener('click', async function() {
      await _eventsSelectedTracksPerYAxis(columnSelectorR, 'right', viewSpec, canvasNum);
    });
    checkbox.addEventListener('change', async function() {
      await _eventsSelectedTracksPerYAxis(columnSelectorR, 'right', viewSpec, canvasNum);
    });
  });
  if (canvasNum  ==0){
    await GoslingPlotWithLocalData()
  }

  let msg = document.getElementById(`msg-load-track-${button_data_track_number}`);
  msg.textContent = "File loaded successfully";
  msg.className = "success-msg";
}

async function _eventsSelectedTracksPerYAxis(columnSelector, side, viewSpec, canvasNum) {    
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
    const trackIndex = trackValue - 1;
    if (viewSpec.tracks[trackIndex]) {
      if (canvasNum  !== 0) {
        // For non-GFF data
        viewSpec.tracks[trackIndex].data.value = chosenColumnName;            
        if (!(Number.isNaN(intervalArray[0]) || Number.isNaN(intervalArray[1]))) {
          viewSpec.tracks[trackIndex].y.domain = intervalArray;
        }            
        viewSpec.tracks[trackIndex].y.axis = side;
        viewSpec.tracks[trackIndex].y.field = chosenColumnName;
        
        // Ensure tooltip is an array before modifying it
        if (!Array.isArray(viewSpec.tracks[trackIndex].tooltip)) {
          viewSpec.tracks[trackIndex].tooltip = [];
        }
        if (viewSpec.tracks[trackIndex].tooltip[0]) {
          viewSpec.tracks[trackIndex].tooltip[0].field = chosenColumnName;
          viewSpec.tracks[trackIndex].tooltip[0].alt = chosenColumnName;
        } else {
          viewSpec.tracks[trackIndex].tooltip[0] = { field: chosenColumnName, alt: chosenColumnName };
        }
      } else {
        // For GFF data, we don't need to modify these properties
        console.log("GFF data: Not modifying y-axis properties");
      }
    } else {
      console.warn(`Track ${trackIndex} does not exist in the plot specification.`);
    }
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
 * Parse a GFF file and extract its header, including specific attributes.
 * 
 * @param {File} file - Local GFF file (gzipped).
 * @returns {Promise<Object>} - Promise resolving to an object containing header and data.
 */
async function extractGeneHeader(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      try {
        const compressedData = new Uint8Array(reader.result);
        const decompressedData = pako.ungzip(compressedData, { to: 'string' });
        const lines = decompressedData.split('\n');

        const standardHeader = [
          'Chromosome',
          'source',
          'type',
          'start',
          'end',
          'score',
          'strand',
          'phase',
          'attributes'
        ];

        const additionalHeaders = ['gene_biotype', 'Name', 'ID'];
        const header = [...standardHeader, ...additionalHeaders];

        const data = [];
        let skippedLines = 0;

        for (let line of lines) {
          if (line.trim() === '' || line.startsWith('#')) {
            continue;
          }

          const row = line.split('\t');

          if (row.length === 9) {
            const entry = {};
            standardHeader.forEach((col, index) => {
              entry[col] = row[index];
            });

            const attributes = row[8].split(';').reduce((acc, attribute) => {
              const [key, ...rest] = attribute.split('=');
              const value = rest.join('=').trim(); // Handle multiple '='
              if (key && value) {
                acc[key.trim()] = value;
              }
              return acc;
            }, {});

            additionalHeaders.forEach(attr => {
              entry[attr] = attributes[attr] || 'unknown';
            });

            if (entry['Name'] && entry['Name'].startsWith('ID=')) {
              entry['Name'] = entry['Name'].split('=')[1];
            }

            if (entry['ID'] && entry['ID'].startsWith('ID=')) {
              entry['ID'] = entry['ID'].split('=')[1];
            }

            data.push(entry);
          } else {
            console.warn('Skipping malformed line:', line);
            skippedLines++;
          }
        }

        if (skippedLines > 0) {
          console.warn(`Skipped ${skippedLines} malformed lines.`);
        }

        resolve({ header, data });
      } catch (error) {
        reject(new Error('Error decompressing or parsing GFF file'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Error reading GFF file'));
    };

    reader.readAsArrayBuffer(file);
  });
}

/**
 * Extract the header from a local file using FileReader.
 * 
 * @param {File} file - Local file.
 * @param {number} button_data_track_number - Button data track number.
 * @param {object} viewSpec - The plot specification object.
 * @returns {Promise<Array>} - Promise resolving to the extracted header.
 */
async function extractHeader(file, button_data_track_number, viewSpec) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result;
      const data = text.split('\n').map(row => row.split(viewSpec[button_data_track_number].data.separator));
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
 * @param {object} viewSpec - The plot specification object.
 * @returns {Promise<Array>} - Promise resolving to the extracted header.
 */
async function extractHeaderFromServer(fileBlob, button_data_track_number, viewSpec) {
  try {
    const text = await new Response(fileBlob).text();
    const data = text.split('\n').map(row => row.split(viewSpec[button_data_track_number].data.separator));
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

/**
 * Function to update tooltips dynamically based on available columns in the data file.
 * @param {Object} viewSpec - The current plot specification object.
 * @param {Array} header - List of column headers extracted from the data file.
 * @param {number} button_data_track_number - Button data track number.
 */
function updateDynamicTooltips(tracks, header, canvasNum) {

  const trackCount = tracks.length;
  
  for (let i = 0; i < trackCount; i++) {
    console.log(tracks[i].tooltip)
    if (canvasNum  === 0) {
      // For GFF data, include all relevant fields in tooltips
      tracks[i].tooltip = [
        // { field: "seqid", type: "nominal", alt: "Chromosome" },
        { field: "start", type: "quantitative", alt: "Start" },
        { field: "end", type: "quantitative", alt: "End" },
        { field: "strand", type: "nominal", alt: "Strand" },
        { field: "type", type: "nominal", alt: "Feature Type" },
        { field: "gene_biotype", type: "nominal", alt: "Gene Biotype" },
        { field: "Name", type: "nominal", alt: "Gene Name" },
        { field: "ID", type: "nominal", alt: "Gene ID" }
      ]
    } else {
      // For CSV/TSV data, use dynamic tooltips
      tracks[i].tooltip = header.map(column => ({
        field: column,
        type: 'nominal',
        alt: column
      }));
    }
  }
}