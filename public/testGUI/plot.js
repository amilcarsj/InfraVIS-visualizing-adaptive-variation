import { embed } from 'gosling.js';
import { handleOptions } from './update_plot_specifications.js';

export function getCurrentViewSpec() {
  const currentCanvasId = `canvas${window.canvas_num}`;
  return window.plotSpecManager.getPlotSpecViewById(currentCanvasId);
}

/**
 * Handle data from a local file input.
 * 
 * @param {FileList} fileInputs - List of file inputs.
 * @param {number} button_data_track_number - Button data track number.
 */
export async function URLfromFile(fileInputs, button_data_track_number) {
  try {
    const fileInput = fileInputs[button_data_track_number].files[0];
    const fileName = fileInput.name;
    const extension = fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();
    const viewSpec = getCurrentViewSpec();
    const current_track = viewSpec.tracks[button_data_track_number];
    const fileURL = URL.createObjectURL(fileInput);

    if (fileURL) {
      current_track.data.url = fileURL;
      await configureDataType(extension, current_track);
      await handleOptions(fileInput, button_data_track_number);
      await checkURLParameters(current_track, button_data_track_number);
      // await GoslingPlotWithLocalData();
      console.log('File loaded successfully');
    }
  } catch (error) {
    console.error(error);
    alert(error.message);
  }
}

/**
 * Handle data from a server URL input.
 * 
 * @param {string} URL_input - Server URL input.
 * @param {number} button_data_track_number - Button data track number.
 */
export async function URLfromServer(URL_input, button_data_track_number) {
  try {
    const viewSpec = getCurrentViewSpec();
    const current_track = viewSpec.tracks[button_data_track_number];
    if (URL_input) {
      current_track.data.url = URL_input;
      const filename = URL_input.substring(URL_input.lastIndexOf('/') + 1);
      const extension = filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();
      const response = await fetch(URL_input);
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
      const fileBlob = await response.blob();
      await configureDataType(extension, current_track);
      await handleOptions(fileBlob, button_data_track_number);
      await checkURLParameters(current_track, button_data_track_number);            
      await GoslingPlotWithLocalData();
    }
  } catch (error) {
    alert(error.message);
  }
}

/**
 * Configure data type based on file extension.
 * 
 * @param {string} extension - File extension.
 * @param {object} track - Track object.
 */
async function configureDataType(extension, track) {
  const validExtensions = ['tsv', 'csv'];
  if (!track.data || typeof track.data !== 'object') {
    track.data = {};
  }
  if (validExtensions.includes(extension)) {
    if (extension === 'tsv') {
      track.data.type = 'csv';
      track.data.separator = '\t';
    } else if (extension === 'csv') {
      track.data.type = 'csv';
      track.data.separator = ',';
    }
  } else {
    throw new Error('Invalid file extension. Only .tsv and .csv files are allowed.');
  }
}

/**
 * Embed the Gosling plot with local data.
 */
export async function GoslingPlotWithLocalData() {
  try {
    const plotSpec = window.plotSpecManager.getPlotSpec(); // Get the current plot spec
    const container = document.getElementById(`plot-container-1`);
    if (container) {
      await embed(container, plotSpec); // Embed the updated plotSpec in the appropriate container
    } else {
      console.error('Unsupported canvas number');
    }
  } catch (error) {
    console.error(error);
  }
}

/**
 * Check and update plot specifications based on URL query parameters.
 * 
 * @param {object} track - Track object.
 * @param {number} track_nr - Track number.
 */
async function checkURLParameters(track, track_nr) {
  var url = new window.URL(document.location);
  try {
    const urlSearch = url.searchParams;
    if (url.searchParams.size > 0) {
      const generateParamName = param => `${param}${track_nr}`;
      const plotSpec = getCurrentViewSpec();

      track.data.column = track.x.field = track.tooltip[1].field = track.tooltip[1].alt = urlSearch.get(generateParamName("x.field")) || track.data.column;
      track.data.value = track.y.field = track.tooltip[0].field = track.tooltip[0].alt = urlSearch.get(generateParamName("y.field")) || track.data.value;
      track.mark = urlSearch.get(generateParamName("mark")) || track.mark;
      track.size.value = parseInt(urlSearch.get(generateParamName("size.value"))) || track.size.value;
      track.color.value = urlSearch.get(generateParamName("color.value")) || track.color.value;
      track.data.binSize = urlSearch.get(generateParamName("data.binSize")) || track.data.binSize;
      track.data.sampleLength = urlSearch.get(generateParamName("sampleLength")) || track.data.sampleLength;

      // Iterate over all tracks in plotSpec
      for (let i = 0; i < plotSpec.tracks.length; i++) {
        const track = plotSpec.tracks[i];
        track.y.domain = urlSearch.has("y.domain") ? urlSearch.get("y.domain").split(",").map(Number) : track.y.domain;
      }
      
      plotSpec.xDomain.interval = urlSearch.has("xDomain.interval") ? urlSearch.get("xDomain.interval").split(",").map(Number) : plotSpec.xDomain.interval;
      plotSpec.style.background = urlSearch.get("background") || plotSpec.style.background;
    } 
  } catch (error) {
    console.error(error);
  }
}