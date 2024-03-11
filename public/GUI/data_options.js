/**
 * Populates the given container with HTML content for configuring track settings.
 * @param {HTMLElement} container - The container element to populate.
 * @returns {Promise<void>} - A Promise that resolves after the container is populated.
 */

export async function all_buttons(container) {
    container.innerHTML = `
        <div id="header" class="buttons-container">
            <div class="both_tracks">
                <button id="track0_button">Track 1</button>
                <button id="track1_button">Track 2</button>
                <button id="info_button">More info</button>
                <button id="clear_url_button">Clear settings</button>
            </div>
        </div>

        <div id="row1" class="buttons-container">
            ${generateTrackButton(0)}
            ${generateTrackButton(1)}
        </div>

        <div id="row2" class="buttons-container">
            ${generateTrackBinAndSampleInputs(0)}
            ${generateTrackBinAndSampleInputs(1)}
            ${generateXDomainInputs()}
            ${generateYDomainInputs(0)}
            ${generateYDomainInputs(1)}
        </div>

        <div id="row3" class="buttons-container">
            ${generateTrackMarkSelector(0)}
            ${generateTrackMarkSelector(1)}
            ${generateBackgroundColorSelector()}
        </div>`;
}

/**
 * Generates HTML for a track button with input fields and selectors.
 * @param {number} trackNumber - The number of the track.
 * @returns {string} - The HTML content for the track button.
 */
function generateTrackButton(trackNumber) {
    return `
        <div class="track${trackNumber}">
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
function generateTrackBinAndSampleInputs(trackNumber) {
    return `
        <div class="track${trackNumber}">
            <label for="binsize_${trackNumber}">Bin size:</label>
            <input type="number" class="interval-input" name="binsize" id="binsize_${trackNumber}">
            <button class="binsize" id="binsize_button_${trackNumber}" data-track="${trackNumber}">Apply</button>

            <label for="samplelength_${trackNumber}">Sample length:</label>
            <input type="number" class="interval-input" name="samplelength" id="samplelength_${trackNumber}">
            <button class="samplelength" id="samplelength_button_${trackNumber}" data-track="${trackNumber}">Apply</button>
        </div>`;
}

/**
 * Generates HTML for input fields related to the X-domain interval.
 * @returns {string} - The HTML content for X-domain inputs.
 */
function generateXDomainInputs() {
    return `
        <div class="both_tracks">
            <label for="x_start">X-domain:</label>
            <input type="text" class="interval-input" id="x_start">
            <span>-</span>
            <input type="text" class="interval-input" id="x_end">
            <button id="x_interval_button">Apply</button>
        </div>`;
}

/**
 * Generates HTML for input fields related to the Y-domain interval for a track.
 * @param {number} trackNumber - The number of the track.
 * @returns {string} - The HTML content for Y-domain inputs.
 */
function generateYDomainInputs(trackNumber) {
    return `
        <div class="track${trackNumber}">
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
function generateTrackMarkSelector(trackNumber) {
    return `
        <div class="track${trackNumber}">
            <select name="mark" id="mark_${trackNumber}" class="mark" data-track="${trackNumber}">
                <option value="" disabled selected>Select mark</option>
                <option value="point">point</option>
                <option value="line">line</option>
                <option value="area">area</option>
                <option value="bar">bar</option>
                <option value="rect">rect</option>
                <option value="text">text</option>
                <option value="link">link</option>
                <option value="triangle">triangle</option>
            </select>

            <select name="color" id="color_${trackNumber}" class="color" data-track="${trackNumber}">
                <option value="" disabled selected>Select color</option>
                <option value="blue">blue</option>
                <option value="pink">pink</option>
                <option value="red">red</option>
                <option value="gold">gold</option>
                <option value="green">green</option>
                <option value="purple">purple</option>
                <option value="black">black</option>
                <option value="orange">orange</option>
            </select>

            <label for="marksize_${trackNumber}">Mark size:</label>
            <input name="size" type="number" class="interval-input" id="marksize_${trackNumber}" data-track="${trackNumber}">
            <button class="marksize" id="marksize_button_${trackNumber}" data-track="${trackNumber}">Apply</button>
        </div>`;
}

/**
 * Generates HTML for a selector to choose the background color.
 * @returns {string} - The HTML content for the background color selector.
 */
function generateBackgroundColorSelector() {
    return `
        <div class="both_tracks">
            <select name="bcolor" id="bcolor">
                <option value="" disabled selected>Select background color</option>
                <option value="white">white</option>
                <option value="grey">grey</option>
            </select>
        </div>`;
}
