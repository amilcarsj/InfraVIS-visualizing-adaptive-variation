import { embed } from 'gosling.js';
import { handleOptions } from './update_plot_specifications.js';

export function getCurrentViewSpec() {
  const currentCanvasId = `canvas${window.canvas_num}`;
  return window.plotSpecManager.getPlotSpecViewById(currentCanvasId);
}

if(window.canvas_num) {
  window.canvas_states[window.canvas_num].filenames = window.canvas_states[window.canvas_num].filenames || {};
}

/**
 * Handle data from a local file input.
 * 
 * @param {FileList} fileInputs - List of file inputs.
 * @param {number} button_data_track_number - Button data track number.
 */
export async function URLfromFile(fileInputs, button_data_track_number) {
  try {
    const files = Array.from(fileInputs[button_data_track_number].files);
    const isCanvas0 = window.canvas_num === 0;

    if (isCanvas0) {
      if (files.length !== 2) {
        throw new Error('Canvas 0 requires exactly 2 files: one .gz and one .tbi.');
      }

      const gzFile = files.find(file => file.name.toLowerCase().endsWith('.gz'));
      const tbiFile = files.find(file => file.name.toLowerCase().endsWith('.tbi'));

      if (!gzFile || !tbiFile) {
        throw new Error('Canvas 0 requires both .gz and .tbi files.');
      }

      // Store filenames as an object for canvas0
      window.canvas_states[window.canvas_num].filenames[button_data_track_number] = {
        data: gzFile.name,
        index: tbiFile.name
      };

      // Update the filename display
      const filenameElement = document.getElementById(`filename-display-${button_data_track_number}`);
      if (filenameElement) {
        filenameElement.textContent = `${gzFile.name}, ${tbiFile.name}`;
      }

      const gzURL = URL.createObjectURL(gzFile);
      const tbiURL = URL.createObjectURL(tbiFile);

      const viewSpec = getCurrentViewSpec();
      const current_track = viewSpec.tracks[button_data_track_number];

      if (gzURL && tbiURL) {
        current_track.data = current_track.data || {};
        current_track.data.url = gzURL;
        current_track.data.indexUrl = tbiURL;

        await configureDataType('gz', current_track); // Configure based on .gz
        await handleOptions(gzFile, button_data_track_number);
        await checkURLParameters(current_track, button_data_track_number);
        console.log('Files loaded successfully for Canvas 0');
      }
    } else {
      if (files.length !== 1) {
        throw new Error('Only one file (.csv or .tsv) can be uploaded for this canvas.');
      }

      const file = files[0];
      const extension = file.name.split('.').pop().toLowerCase();

      if (!['csv', 'tsv'].includes(extension)) {
        throw new Error('Only .csv and .tsv files are allowed for Canvas 1, 2, 3, etc.');
      }

      // Store filename as a string for other canvases
      window.canvas_states[window.canvas_num].filenames[button_data_track_number] = file.name;

      // Update the filename display
      const filenameElement = document.getElementById(`filename-display-${button_data_track_number}`);
      if (filenameElement) {
        filenameElement.textContent = file.name;
      }

      const fileURL = URL.createObjectURL(file);
      const viewSpec = getCurrentViewSpec();
      const current_track = viewSpec.tracks[button_data_track_number];

      if (fileURL) {
        current_track.data = {
          url: fileURL
        };

        await configureDataType(extension, current_track);
        await handleOptions(file, button_data_track_number);
        await checkURLParameters(current_track, button_data_track_number);
        console.log('File loaded successfully for Canvas ' + window.canvas_num);
      }
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
    const isCanvas0 = window.canvas_num === 0;
    const viewSpec = getCurrentViewSpec();
    const current_track = viewSpec.tracks[button_data_track_number];

    if (URL_input) {
      let urls = [];
      if (isCanvas0) {
        // Expecting two URLs separated by a comma
        urls = URL_input.split(',').map(url => url.trim());
        if (urls.length !== 2) {
          throw new Error('Canvas 0 requires exactly 2 URLs: one .gz and one .tbi.');
        }
      } else {
        urls = [URL_input.trim()];
      }

      if (isCanvas0) {
        const gzURL = urls.find(url => url.toLowerCase().endsWith('.gz'));
        const tbiURL = urls.find(url => url.toLowerCase().endsWith('.tbi'));

        if (!gzURL || !tbiURL) {
          throw new Error('Canvas 0 requires both .gz and .tbi URLs.');
        }

        window.canvas_states[window.canvas_num].filenames[button_data_track_number] = {
          data: gzURL.split('/').pop(),
          index: tbiURL.split('/').pop()
        };

        current_track.data = {
          url: gzURL,
          indexUrl: tbiURL
        };

        // Update the filename display
        const filenameElement = document.getElementById(`filename-display-${button_data_track_number}`);
        if (filenameElement) {
          filenameElement.textContent = `${window.canvas_states[window.canvas_num].filenames[button_data_track_number].data}, ${window.canvas_states[window.canvas_num].filenames[button_data_track_number].index}`;
        }

        // Validate extensions
        const gzExtension = gzURL.split('.').pop().toLowerCase();
        const tbiExtension = tbiURL.split('.').pop().toLowerCase();

        if (gzExtension !== 'gz' || tbiExtension !== 'tbi') {
          throw new Error('Canvas 0 requires one .gz and one .tbi URL.');
        }
      } else {
        const fileURL = urls[0];
        const filename = fileURL.split('/').pop();
        const extension = filename.split('.').pop().toLowerCase();

        if (!['csv', 'tsv'].includes(extension)) {
          throw new Error('Only .csv and .tsv files are allowed for Canvas 1, 2, 3, etc.');
        }

        window.canvas_states[window.canvas_num].filenames[button_data_track_number] = filename;

        current_track.data = {
          url: fileURL
        };

        // Update the filename display
        const filenameElement = document.getElementById(`filename-display-${button_data_track_number}`);
        if (filenameElement) {
          filenameElement.textContent = filename;
        }
      }

      // Fetch and process files
      for (let i = 0; i < urls.length; i++) {
        const url = urls[i];
        const filename = url.split('/').pop();
        const extension = filename.split('.').pop().toLowerCase();

        if (isCanvas0) {
          if (i === 0 && extension !== 'gz') {
            throw new Error('First URL must be a .gz file.');
          }
          if (i === 1 && extension !== 'tbi') {
            throw new Error('Second URL must be a .tbi file.');
          }
        } else {
          if (!['csv', 'tsv'].includes(extension)) {
            throw new Error('Only .csv and .tsv files are allowed for this canvas.');
          }
        }

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Network response was not ok for URL: ${url}`);
        }
        const fileBlob = await response.blob();

        if (isCanvas0) {
          // For canvas0, handle .gz and .tbi separately
          if (extension === 'gz') {
            await configureDataType('gz', current_track);
            await handleOptions(fileBlob, button_data_track_number);
          } else if (extension === 'tbi') {
            // Assuming handleOptions can process index files if necessary
            // If not, you might need to adjust this accordingly
            // For example, associate the index file with the data file
          }
        } else {
          await configureDataType(extension, current_track);
          await handleOptions(fileBlob, button_data_track_number);
        }
      }

      await checkURLParameters(current_track, button_data_track_number);
      console.log('URL-based files loaded successfully');
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
  const isCanvas0 = window.canvas_num === 0;
  
  if (!track.data || typeof track.data !== 'object') {
    track.data = {};
  }

  if (isCanvas0) {
    // For indexed data, data.type might need to be specified as per Gosling.js requirements
    // Assuming 'bed' type for this example; adjust as necessary
    track.data.type = 'bed'; // Change 'bed' to the appropriate type if different
  } else {
    const validExtensions = ['tsv', 'csv'];
    if (!validExtensions.includes(extension)) {
      throw new Error('Invalid file extension. Only .tsv and .csv files are allowed.');
    }
    track.data.type = 'csv';
    track.data.separator = extension === 'tsv' ? '\t' : ',';
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