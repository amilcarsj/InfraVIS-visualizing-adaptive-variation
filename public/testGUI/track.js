import { URLfromFile, URLfromServer, GoslingPlotWithLocalData, getCurrentViewSpec } from './plot.js';
import { updateURLParameters } from './update_plot_specifications.js';
import {view_control_apply_changes} from './data_options.js'


/**
 * To reset the track settings to default.
 * @param {int} trackNumber 
 */
export function resetTrackSettings (trackNumber) {
  document.getElementById(`binsize_${trackNumber}`).value = '';
  document.getElementById(`samplelength_${trackNumber}`).value = '';
  document.getElementById(`marksize_${trackNumber}`).value = '';
  document.getElementById(`mark_${trackNumber}`).selectedIndex = 0;
  document.getElementById(`color_${trackNumber}`).selectedIndex = 0;
  const plotSpec = getCurrentViewSpec();
  if(plotSpec.tracks[trackNumber].data.url !== '') {
    document.getElementById(`filename-display-${trackNumber}`).textContent = 'No file selected';
    window.canvas_states[window.canvas_num].filenames[trackNumber] = 'No file selected';
  }
  plotSpec.tracks[trackNumber].data.url = ''
  plotSpec.tracks[trackNumber].data.binSize = 10;
  plotSpec.tracks[trackNumber].data.sampleLength = 1000;
  plotSpec.tracks[trackNumber].size.value = 3;
  plotSpec.tracks[trackNumber].mark = 'point';
  plotSpec.tracks[trackNumber].color.value = '#e41a1c';
  // Apply changes and update the UI
  updateURLParameters(`data.binSize${trackNumber}`, 0);
  updateURLParameters(`data.sampleLength${trackNumber}`, 0);
  updateURLParameters(`size.value${trackNumber}`, 0);
  updateURLParameters(`mark${trackNumber}`, 'point');
  updateURLParameters(`color.value${trackNumber}`, '#e41a1c');
  GoslingPlotWithLocalData(window.canvas_num);
}

/**
 * To keep track of the current track number.
 */
export async function updateTrackNumber () {
  const currentCanvasState = window.canvas_states[window.canvas_num];
  currentCanvasState.trackCount++;
  if (currentCanvasState.trackCount > 5) currentCanvasState.trackCount = 5;
  else {
      document.getElementById("trackCountSelector").value = currentCanvasState.trackCount;
      generateTracks();
  }
}



// Generate track elements based on the selected track count
export async function generateTracks () {
  let currentCanvasState = window.canvas_states[window.canvas_num];
  const trackCount = currentCanvasState.trackCount;
  const container = document.getElementById("container");
  let htmlContent = '';
  // Render buttons containers
  for (let i = 0; i < trackCount; i++) { 
      htmlContent += `
          <div id="track${i}" class="track-container">      
              ${await generateTrackBinAndSampleInputs(i)}                                            
          </div>
      `; 
  }
  container.innerHTML = '';    
  container.innerHTML += htmlContent;        
  // Render detailing track options
  htmlContent = '';
  for (let i = 0; i < trackCount; i++) {
      
      htmlContent += `<option value="${i}">Track ${i + 1}</option>`;
      
  } 
  const trackSelector = document.getElementById("trackSelector");
  trackSelector.innerHTML = '';
  trackSelector.innerHTML += htmlContent;          
  // Updating colors
  for (let i = 0; i < trackCount; i++) {
      const defaultColor = document.getElementById(`color_${i}`);
      if(defaultColor){
          await updateURLParameters(`color.value${i}`, defaultColor.value);  
      }
  }
  // Updating axis-controllers
  let axisFormLeft = document.getElementById('checkbox-left-axis');
  let axisFormRight = document.getElementById('checkbox-right-axis');
  let dataLoad = document.getElementById('data-load');
  axisFormLeft.innerHTML = '';
  axisFormRight.innerHTML = '';
  dataLoad.innerHTML = ''; 
  for (let i = 0; i < trackCount; i++) {  
      axisFormLeft.innerHTML += `
      <div class="y-checkbox-option">    
          <input class="y-checkbox-option" type="checkbox" id="track${i}-left" name="option" value="Track ${i + 1}" checked>
          <label for="track${i}-left">Track ${i + 1}</label><br>
      </div>`;
      axisFormRight.innerHTML += `<div class="y-checkbox-option">    
      <input class="y-checkbox-option" type="checkbox" id="track${i}-right" name="option" value="Track ${i + 1}">
      <label for="track${i}-right">Track ${i + 1}</label><br>
      </div>`;
      dataLoad.innerHTML += `
      <div id="track${i}" class="track-container">
          <div class="btn-row">
              <h2>Track ${i + 1}</h2>        
              <span id="clear_settings_button${i}" class="clear_settings_button">Clear settings <i class="fa fa-times-circle" style="font-size:18px;"></i></span>
          </div>
      <div id="data-load" class="btn-row">
      <div class=file-container>
          <button class="plot-button" data-track="${i}"><i class="fa fa-upload" style="font-size:18px;"></i> Select file </button> 
          <input type="file" class="file-input"  style="display: none;">
          <label for="urlinput_${i}" class='or-inbetween'>OR</label>
          <input type="url" id="urlinput_${i}" class="url-input" placeholder="Enter URL">
          <button class="url-button" data-track="${i}">Load</button>
          <label class="success-msg" id="msg-load-track-${i}"></label>
      </div>
      </div>
      ${await generateTrackBinAndSampleInputs(i)}                                
  </div>`;
  const filenameElement = document.getElementById(`filename-display-${i}`);
  if (filenameElement && window.canvas_states[window.canvas_num].filenames[i]) {
      filenameElement.textContent = `${window.canvas_states[window.canvas_num].filenames[i]}`;
  }
  }
  dataLoad.innerHTML += `<div id="container"></div>`;
  // Get all checkboxes
  const leftCheckboxes = document.querySelectorAll('#checkbox-left-axis input[type="checkbox"]');
  const rightCheckboxes = document.querySelectorAll('#checkbox-right-axis input[type="checkbox"]');
  // Add event listeners to left checkboxes
  leftCheckboxes.forEach(leftCheckbox => {
      leftCheckbox.addEventListener('change', function () {
          const correspondingCheckbox = document.getElementById(this.id.replace('-left', '-right'));
          correspondingCheckbox.checked = !this.checked;            
      });
  });
  // Add event listeners to right checkboxes
  rightCheckboxes.forEach(rightCheckbox => {
      rightCheckbox.addEventListener('change', function () {
          const correspondingCheckbox = document.getElementById(this.id.replace('-right', '-left'));
          correspondingCheckbox.checked = !this.checked;            
      });
  });
  await new Promise(resolve => setTimeout(resolve, 0));
  await track_settings_btns(trackCount);  
  await showHideTracks();
}


// Ensure the Add Track button triggers the track count update
window.onload = function () {
  document.getElementById('add_track_button').addEventListener('click', updateTrackNumber);
}
// Show or hide tracks based on the selected track
export async function showHideTracks () {
  const currentCanvasState = window.canvas_states[window.canvas_num];
  const trackCount = currentCanvasState.trackCount;
  const selected = document.getElementById('trackSelector').value;
  for (let i = 0; i < trackCount; i++) {
      let trackContainer = document.getElementById(`track${i}`);
      if (trackContainer) {
          if (i == selected) {
              trackContainer.style.display = 'block';
          } 
      }
  }
}


/**
 * Generates HTML for input fields related to bin size and sample length for a track.
 * @param {number} trackNumber - The number of the track.
 * @returns {string} - The HTML content for bin and sample inputs.
 */
export async function generateTrackBinAndSampleInputs (trackNumber) {
  const fileName = window.canvas_states[window.canvas_num].filenames[trackNumber] || "No file selected";
  return `
  <div class='bin-sample-container track-${trackNumber}'> 
      <div class="file-info">
          File: <span class='filename-display' id="filename-display-${trackNumber}">${fileName}</span>
      </div>
      <div class="btn-row" id ='inner-container'>
          <div class="left-side">
              <div class="input-group">
                  <label for="binsize_${trackNumber}">Bin size</label>
                  <input type="number" class="interval-input" name="binsize" id="binsize_${trackNumber}">
              </div>
              <div class="input-group">
                  <label for="samplelength_${trackNumber}">Sample length</label>
                  <input type="number" class="interval-input" name="samplelength" id="samplelength_${trackNumber}">
              </div>
              <div class="input-group"> 
                  <label for="mark_${trackNumber}">Marker type</label>
                  <select name="mark" id="mark_${trackNumber}" class="mark" data-track="${trackNumber}">
                      <option > </option>
                      <option value="point">point</option>
                      <option value="line">line</option>
                      <option value="area">area</option>
                      <option value="bar">bar</option>
                      <option value="rect">rect</option>
                      <option value="text">text</option>
                      <option value="betweenLink">link</option>
                      <option value="rule">rule</option>
                      <option value="triangleRight">triangle R</option>
                      <option value="triangleLeft">triangle L</option>
                  </select>
              </div>
          </div>
          <div class="right-side">
              <div class="input-group"> 
                  <label for="color_${trackNumber}">Color</label>
                  <select name="color" id="color_${trackNumber}" class="color" data-track="${trackNumber}">
                      <option value="#e41a1c"${trackNumber === 0 ? " selected" : ""}>red</option>
                      <option value="#377eb8"${trackNumber === 1 ? " selected" : ""}>blue</option>
                      <option value="#4daf4a"${trackNumber === 2 ? " selected" : ""}>green</option>
                      <option value="#984ea3"${trackNumber === 3 ? " selected" : ""}>purple</option>
                      <option value="#ff7f00"${trackNumber === 4 ? " selected" : ""}>orange</option>
                  </select></div>
              <div class="input-group">
                  <label for="marksize_${trackNumber}">Mark size</label>
                  <input name="size" type="number" class="interval-input" id="marksize_${trackNumber}" data-track="${trackNumber}">
              </div>
              <div class="input-group"> 
                  <button class="apply-button" data-track="${trackNumber}">Apply</button>
                  <button class="delete-track-button" data-track="${trackNumber}" aria-label="Close"><i class="fa fa-trash"></i></button>
              </div>
          </div>
      </div>
  </div>`;
}
/**
 * Delete the track based on its number.
 * @param {int} trackToDelete the track number
 */
export async function deleteTrack (trackToDelete) {
  const currentCanvasState = window.canvas_states[window.canvas_num];
  // Remove the track from the plotSpec
  const plotSpec = getCurrentViewSpec();
  plotSpec.tracks.splice(trackToDelete, 1);

  // Remove the file name from FILENAMES object
  delete window.canvas_states[window.canvas_num].filenames[trackToDelete];

  // Shift the remaining file names
  for (let i = trackToDelete + 1; i < currentCanvasState.trackCount; i++) {
      if (window.canvas_states[window.canvas_num].filenames[i]) {
          window.canvas_states[window.canvas_num].filenames[i - 1] = window.canvas_states[window.canvas_num].filenames[i];
          delete window.canvas_states[window.canvas_num].filenames[i];
      }
  }
  // Update the track count
  currentCanvasState.trackCount--;
  // Update the UI
  document.getElementById('trackCountSelector').value = currentCanvasState.trackCount;
  await generateTracks();
  // Update the plot
  await GoslingPlotWithLocalData(window.canvas_num);
  // Update URL parameters
  updateURLParameters(`track${trackToDelete}`, null);
}

/**
 * To update the track settings based on the selected ones by the user.
 * @param {int} trackNumber 
 */
export async function track_settings_btns (trackNumber){
  //  to load the file based on localfile.
  const fileInputs = document.querySelectorAll('.file-input');
  document.querySelectorAll('.plot-button').forEach(function (button, button_data_track_num) {
      button.addEventListener('click', function () {
          fileInputs[button_data_track_num].click();
      });
  });
  fileInputs.forEach(function (fileInput, button_data_track_num) {
      fileInput.addEventListener('change', function () {
          URLfromFile(fileInputs, button_data_track_num);
      });
  });
  // to load the file based on URL.
  document.querySelectorAll('.url-button').forEach(function (urlButton, trackNumber) {
    const urlInput = document.getElementById(`urlinput_${trackNumber}`);  
    urlButton.addEventListener('click', function () {
        URLfromServer(urlInput.value, trackNumber);
    });
});
  // delete button functionality.
  document.querySelectorAll('.delete-track-button').forEach(function (deleteButton) {
      deleteButton.addEventListener('click', async function () {
          const trackToDelete = parseInt(this.getAttribute('data-track'));
          await deleteTrack(trackToDelete);
      });
  });
  // Update the mark.
  document.querySelectorAll('.mark').forEach(function (markSelector) {
      markSelector.addEventListener('change', async function () {
          const trackValue = this.getAttribute('data-track');
          const chosenMark = this.value;
          const plotSpec = getCurrentViewSpec();
          plotSpec.tracks[trackValue].mark = chosenMark;
          await updateURLParameters(`mark${trackValue}`, chosenMark);
      });
  });
  // Update the color.
  document.querySelectorAll('.color').forEach(function (colorSelector) {
      colorSelector.addEventListener('change', async function () {
          const trackValue = this.getAttribute('data-track');
          const chosenColor = this.value;
          const plotSpec = getCurrentViewSpec();
          plotSpec.tracks[trackValue].color.value = chosenColor;
          await updateURLParameters(`color.value${trackValue}`, chosenColor);
      });
  });
  // Update the marksize.
  document.querySelectorAll('.marksize').forEach(function (sizeInput) {
      sizeInput.addEventListener('input', async function () {
          const trackValue = this.getAttribute('data-track');
          const chosenSize = parseFloat(this.value);
          const plotSpec = getCurrentViewSpec();
          plotSpec.tracks[trackValue].size.value = chosenSize;
          await updateURLParameters(`size.value${trackValue}`, chosenSize);
      });
  });
  // THe apply button functionlaity to apply all the changes.
  document.querySelectorAll('.apply-button').forEach(function (applyButton) {
      applyButton.addEventListener('click', async function () {
          const trackNumber = this.getAttribute('data-track');
          const binSizeInput = document.getElementById(`binsize_${trackNumber}`);
          const sampleLengthInput = document.getElementById(`samplelength_${trackNumber}`);
          const markSizeInput = document.getElementById(`marksize_${trackNumber}`);
          const binSize = parseFloat(binSizeInput.value);
          const sampleLength = parseFloat(sampleLengthInput.value);
          const markSize = parseFloat(markSizeInput.value);
          const plotSpec = getCurrentViewSpec();   
          if (!isNaN(binSize)) {
              plotSpec.tracks[trackNumber].data.binSize = binSize;
              await updateURLParameters(`data.binSize${trackNumber}`, binSize);
          }   
          if (!isNaN(sampleLength)) {
              plotSpec.tracks[trackNumber].data.sampleLength = sampleLength;
              await updateURLParameters(`data.sampleLength${trackNumber}`, sampleLength);
          }   
          if (!isNaN(markSize)) {
              plotSpec.tracks[trackNumber].size.value = markSize;
              await updateURLParameters(`size.value${trackNumber}`, markSize);
          }
          GoslingPlotWithLocalData(window.canvas_num);
      });
  });
  // To clear all the  settings for the track
  for (let i = 0; i < trackNumber; i++) {
      let clear_settings_button = document.getElementById(`clear_settings_button${i}`);
      if (clear_settings_button) {
          clear_settings_button.addEventListener('click', function () {
            resetTrackSettings(i);
          });
      }
  } 

}