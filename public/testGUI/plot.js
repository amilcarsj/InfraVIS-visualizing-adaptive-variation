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
        index: tbiFile.name,
      };
      
      // Update the filename display
      const filenameElement = document.getElementById(`filename-display-${button_data_track_number}`);
      if (filenameElement) {
        filenameElement.textContent = `${gzFile.name}, ${tbiFile.name}`;
      }

      const gzURL = URL.createObjectURL(gzFile);
      const tbiURL = URL.createObjectURL(tbiFile);
  
      const plotSpec = getCurrentViewSpec();
      
      // Set the URLs for all tracks
      plotSpec.tracks.forEach(track => {
        track.data.url = gzURL;
        track.data.indexUrl = tbiURL;
      });

      await configureDataType('gff', plotSpec.tracks[0]); 
      await handleOptions(gzFile, button_data_track_number);
      await checkURLParameters(plotSpec.tracks[0], button_data_track_number);
      console.log('Files loaded successfully for Canvas 0');
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
      const plotSpec = getCurrentViewSpec();
      const current_track = plotSpec.tracks[button_data_track_number]; // Adjust based on your plotSpec structure

      if (!current_track) {
        console.error(`Track number ${button_data_track_number} does not exist in plotSpec.`);
        return;
      }
      if (fileURL) {
        current_track.data = {
          url: fileURL,
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
    track.data.type = 'gff'; // Correct data type for GFF
    track.data.indexUrl = track.data.indexUrl || ''; // Ensure indexUrl exists
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
    const plotSpec = window.plotSpecManager.getPlotSpec();
    
    // Check if URLs are set for all tracks
    plotSpec.views.forEach(view => {
      view.tracks.forEach((track, index) => {
        if (window.canvas_num === 0) {
          // For GFF data
          if (!track.data.url || !track.data.indexUrl) {
            console.warn(`URL or indexURL is not set for track ${index} in view ${view.id}`);
          }
        } else {
          // For non-GFF data
          if (!track.data.url) {
            console.warn(`URL is not set for track ${index} in view ${view.id}`);
          }
        }
      });
    });
    const container = document.getElementById(`plot-container-1`);
    if (container) {
      await embed(container, plotSpec);
    } else {
      console.error('Unsupported canvas number');
    }
  } catch (error) {
    console.error('Error in GoslingPlotWithLocalData:', error);
  }
}

/**
 * Check and update plot specifications based on URL query parameters.
 * 
 * @param {object} track - Track object.
 * @param {number} track_nr - Track number.
 */
export async function checkURLParameters(track, track_nr) {
  const url = new window.URL(document.location);
  try {
    const urlSearch = url.searchParams;
    if (urlSearch.size > 0) {
      const generateParamName = (param) => `${param}${track_nr}`;
      const plotSpec = getCurrentViewSpec();

      // Safeguard for tooltip array
      if (!Array.isArray(track.tooltip)) {
        track.tooltip = [];
      }

      // Ensure tooltip has at least two elements
      while (track.tooltip.length < 2) {
        track.tooltip.push({});
      }

      // Safely set properties only if they exist
      if (track.x) {
        const xField = urlSearch.get(generateParamName("x.field")) || track.data.column;
        track.x.field = xField;
        track.tooltip[1].field = xField;
        track.tooltip[1].alt = xField;
        track.data.column = xField;
      }

      if (track.y) {
        const yField = urlSearch.get(generateParamName("y.field")) || track.data.value;
        track.y.field = yField;
        track.tooltip[0].field = yField;
        track.tooltip[0].alt = yField;
        track.data.value = yField;
      }

      if (track.mark !== undefined) {
        track.mark = urlSearch.get(generateParamName("mark")) || track.mark;
      }

      if (track.size) {
        const sizeValue = parseInt(urlSearch.get(generateParamName("size.value"))) || track.size.value;
        track.size.value = sizeValue;
      }

      if (track.color) {
        track.color.value = urlSearch.get(generateParamName("color.value")) || track.color.value;
      }

      track.data.binSize = urlSearch.get(generateParamName("data.binSize")) || track.data.binSize;
      track.data.sampleLength = urlSearch.get(generateParamName("sampleLength")) || track.data.sampleLength;

      // Iterate over all tracks in plotSpec and update y.domain if applicable
      for (let i = 0; i < plotSpec.tracks.length; i++) {
        const currentTrack = plotSpec.tracks[i];
        if (currentTrack.y) { // Only update if y exists
          currentTrack.y.domain = urlSearch.has("y.domain")
            ? urlSearch.get("y.domain").split(",").map(Number)
            : currentTrack.y.domain;
        }
      }

      // Update xDomain.interval
      plotSpec.xDomain.interval = urlSearch.has("xDomain.interval")
        ? urlSearch.get("xDomain.interval").split(",").map(Number)
        : plotSpec.xDomain.interval;

      // Update background style
      plotSpec.style.background = urlSearch.get("background") || plotSpec.style.background;
    }
  } catch (error) {
    console.error("Error in checkURLParameters:", error);
  }
}