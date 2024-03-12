/**
 * Populates the given container with HTML content for configuring track settings.
 * @param {HTMLElement} container - The container element to populate.
 * @returns {Promise<void>} - A Promise that resolves after the container is populated.
 */

import { URLfromFile, URLfromServer, GoslingPlotWithLocalData } from './plot.js';
import { updateURLParameters } from './update_plot_specifications.js';

export async function all_buttons(container) {
    container.innerHTML = `
        <div id="header" class="buttons-container">
            <div class="btn-row">
                <!-- Selector to choose the number of tracks -->
                <label for="trackCountSelector">Number of Tracks:</label>
                <select id="trackCountSelector" onchange="generateTracks()">
                    <option value="2" selected>2 Tracks</option>
                    <option value="3">3 Tracks</option>
                    <option value="4">4 Tracks</option>
                    <option value="5">5 Tracks</option>
                </select>
                <button id="info_button">More info</button>
                <button id="clear_url_button">Clear settings</button>
            </div>
            <div class="both_tracks btn-row">
                <label for="trackSelector">Detail Track Options:</label>
                <select id="trackSelector" onchange="showHideTracks()">
                    <option value="0" selected>Track 1</option>
                    <option value="1">Track 2</option>                    
                </select>
                <select name="bcolor" id="bcolor">
                    <option value="" disabled="" selected="">Select background color</option>
                    <option value="white">white</option>
                    <option value="grey">grey</option>
                </select>
            </div>
            <div id="container"></div>
        </div>
    `;
}

/**
 * Generates tracks based on the selected number of tracks.
 */
window.generateTracks = async function() {
    const trackCount = parseInt(document.getElementById("trackCountSelector").value);
    const container = document.getElementById("container");

    let htmlContent = '';
// Render buttons containers
    for (let i = 0; i < trackCount; i++) {
        htmlContent += `
            <div id="track${i}" class="buttons-container">
                ${await generateTrackButton(i)}
                ${await generateTrackBinAndSampleInputs(i)}
                ${await generateXDomainInputs(i)}
                ${await generateYDomainInputs(i)}
                ${await generateTrackMarkSelector(i)}
            </div>            
        `;
    }
    container.innerHTML = '';
    container.innerHTML += htmlContent;    
//  Render detailing track options
    htmlContent = '';
    for (let i = 0; i < trackCount; i++){
        htmlContent += `<option value="${i}">Track ${i+1}</option>`
    }
    const trackSelector = document.getElementById("trackSelector");
    trackSelector.innerHTML = '';
    trackSelector.innerHTML += htmlContent;    
    await window.generateElementsActions();  
    await window.showHideTracks();  
    
    // Updating colors
    for (let i = 0; i < trackCount; i++) {
        // Get the default color value
        const defaultColor = document.getElementById(`color_${i}`).value;
        // Update the query parameter with the default color value
        await updateURLParameters(`color.value${i}`, defaultColor);      
    }
}
/**
 * 
 */
window.showHideTracks = async function () {
    const trackCount = parseInt(document.getElementById("trackCountSelector").value);
    const selected = document.getElementById('trackSelector').value;
    for (let i = 0; i < trackCount; i++){
        let trackContainer = document.getElementById(`track${i}`);
        if (i == selected){
            trackContainer.style.display = 'block';
        } else {
            trackContainer.style.display = 'none';
        }
    }
}

/**
 * Generates HTML for a track button with input fields and selectors.
 * @param {number} trackNumber - The number of the track.
 * @returns {string} - The HTML content for the track button.
 */
window.generateTrackButton = async function (trackNumber) {
    return `
        <div class="track${trackNumber} btn-row">
            <button class="plot-button" data-track="${trackNumber}">Choose file</button>
            <input type="file" class="file-input" style="display: none;">
            
            <label for="urlinput_${trackNumber}" style="margin-right:30px;">or</label>
            <input type="url" id="urlinput_${trackNumber}" class="url-input" placeholder="Enter URL">
            <button class="url-button" data-track="${trackNumber}">Load</button>

            <div class="column-container">
                <div id="columnLabelX"></div>
                <label for="columnSelectorX_${trackNumber}">X-axis: </label>
                <select name="xcolumn" id="columnSelectorX_${trackNumber}" class="columnSelectorX" data-track="${trackNumber}">
                    <option value="" disabled selected></option>
                </select>
            </div>

            <div class="column-container">
                <div id="columnLabelY"></div>
                <label for="columnSelectorY_${trackNumber}">Y-axis: </label>
                <select name="ycolumn" id="columnSelectorY_${trackNumber}" class="columnSelectorY" data-track="${trackNumber}">
                    <option value="" disabled selected></option>
                </select>
            </div>

            ${trackNumber === 1 ? '<label>Separate y-axis<input type="checkbox" id="check"></label>' : ''}
        </div>`;
}

/**
 * Generates HTML for input fields related to bin size and sample length for a track.
 * @param {number} trackNumber - The number of the track.
 * @returns {string} - The HTML content for bin and sample inputs.
 */
window.generateTrackBinAndSampleInputs = async function (trackNumber) {
    return `
        <div class="track${trackNumber} btn-row">
            <label for="binsize_${trackNumber}">Bin size:</label>
            <input type="number" class="interval-input" name="binsize" id="binsize_${trackNumber}">
            <button class="binsize" id="binsize_button_${trackNumber}" data-track="${trackNumber}">Apply</button>

            <label for="samplelength_${trackNumber}">Sample length:</label>
            <input type="number" class="interval-input" name="samplelength" id="samplelength_${trackNumber}">
            <button class="samplelength" id="samplelength_button_${trackNumber}" data-track="${trackNumber}">Apply</button>
        </div>`;
}

/**
 * Generates HTML for input fields related to the Y-domain interval for a track.
 * @param {number} trackNumber - The number of the track.
 * @returns {string} - The HTML content for Y-domain inputs.
 */
window.generateXDomainInputs = async function(trackNumber) {
    return `
        <div class="both_tracks btn-row">
            <label for="x_start">X-domain:</label>
            <input type="text" class="interval-input" id="x_start">
            <span>-</span>
            <input type="text" class="interval-input" id="x_end">
            <button class="x_interval_button">Apply</button>
        </div>
        `;
}

/**
 * Generates HTML for input fields related to the Y-domain interval for a track.
 * @param {number} trackNumber - The number of the track.
 * @returns {string} - The HTML content for Y-domain inputs.
 */
window.generateYDomainInputs = async function(trackNumber) {
    return `
        <div class="track${trackNumber} btn-row">
            <label for="y_start${trackNumber}">Y-domain:</label>
            <input type="text" class="interval-input" id="y_start${trackNumber}">
            <span>-</span>
            <input type="text" class="interval-input" id="y_end${trackNumber}">
            <button id="y_interval_button${trackNumber}">Apply</button>
        </div>`;
}

/**
 * Generates HTML for selectors related to mark type, color, and size for a track.
 * @param {number} trackNumber - The number of the track.
 * @returns {string} - The HTML content for mark selectors.
 */
window.generateTrackMarkSelector = async function(trackNumber) {
    return `
        <div class="track${trackNumber} btn-row">
            <label for="mark_${trackNumber}">Marker:</label>
            <select name="mark" id="mark_${trackNumber}" class="mark" data-track="${trackNumber}">
                <option value="point">point</option>
                <option value="line" selected>line</option>
                <option value="area">area</option>
                <option value="bar">bar</option>
                <option value="rect">rect</option>
                <option value="text">text</option>
                <option value="link">link</option>
                <option value="triangle">triangle</option>
            </select>
            <label for="color_${trackNumber}">Color:</label>
            <select name="color" id="color_${trackNumber}" class="color" data-track="${trackNumber}">
                <option value="blue"${trackNumber === 0 ? " selected" : ""}>blue</option>
                <option value="pink"${trackNumber === 1 ? " selected" : ""}>pink</option>
                <option value="red"${trackNumber === 2 ? " selected" : ""}>red</option>
                <option value="gold"${trackNumber === 3 ? " selected" : ""}>gold</option>
                <option value="green"${trackNumber === 4 ? " selected" : ""}>green</option>
                <option value="purple"${trackNumber === 5 ? " selected" : ""}>purple</option>
                <option value="black"${trackNumber === 6 ? " selected" : ""}>black</option>
                <option value="orange"${trackNumber === 7 ? " selected" : ""}>orange</option>
            </select>
            <label for="marksize_${trackNumber}">Mark size:</label>
            <input name="size" type="number" class="interval-input" id="marksize_${trackNumber}" data-track="${trackNumber}">
            <button class="marksize" id="marksize_button_${trackNumber}" data-track="${trackNumber}">Apply</button>
        </div>`;        
}

window.generateElementsActions = async function(){
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

    document.querySelectorAll('.url-button').forEach(function (urlButton, trackNumber) {
        const urlInput = document.getElementById(`urlinput_${trackNumber}`);

        urlButton.addEventListener('click', function () {
            URLfromServer(urlInput.value, trackNumber);
        });
    });

    info_button.addEventListener('click', function () {
        overlay.style.display = "block"; 
    });

    close_button.addEventListener('click', function () {
        overlay.style.display = "none";
    });

    clear_url_button.addEventListener('click', function () {
        var url = new window.URL(document.location);
        url.searchParams.forEach((_, key) => url.searchParams.delete(key));
        history.pushState({}, '', url);
    });

    clear_url_button.addEventListener('click', function () {
        try {
            var url = new URL(document.location);
            Array.from(url.searchParams.keys()).forEach(key => url.searchParams.delete(key));
            history.pushState({}, '', url);
            window.location.reload();
        } catch (error) {
            console.error(error);
        }
    });
    

}
