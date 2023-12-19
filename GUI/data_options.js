// HTML options for user
export async function info(container) {
    container.innerHTML = `
    <button id="track1_button">Track 1</button>
    <button id="track2_button">Track 2</button>
    <button id="info_button">More info</button>
    <button id="clear_url_button">Clear settings</button>
    `
}

export async function row(container) {
    container.innerHTML = `
    <label for="x_start">X-domain:</label>
    <input type="text" class="interval-input" id="x_start">
    <span>-</span>
    <input type="text" class="interval-input" id="x_end">
    <button id="x_interval_button">Apply</button>

    <label for="y_start">Y-domain:</label>
    <input type="text" class="interval-input" id="y_start">
    <span>-</span>
    <input type="text" class="interval-input" id="y_end">
    <button id="y_interval_button">Apply</button>


    <select name="bcolor" id="bcolor">
        <option value="" disabled selected>Select background color</option>
        <option value="white">white</option>
        <option value="grey">grey</option>
    </select>`
}

export async function row1(container) {
    container.innerHTML = `
    <button class="plot-button" data-track="0">Choose file</button>
    <input type="file" class="file-input" style="display: none;">
    
    <button class="url-button" data-track="0">Load from URL</button>
    <input type="url" id="urlInput_0" class="url-input" placeholder="Enter URL">



    <div class="column-container" id="column-container">
        <div id="columnLabelX"></div>
        <label for="columnSelectorX_0">X-axis: </label>
        <select name="xcolumn" id="columnSelectorX_0" class="columnSelectorX" data-track="0">
            <option value="" disabled selected>Select a column for X</option>
        </select>
    </div>

    <div class="column-container" id="column-container">
        <div id="columnLabelY"></div>
        <label for="columnSelectorY_0">Y-axis: </label>
        <select name="ycolumn" id="columnSelectorY_0" class="columnSelectorY" data-track="0">
            <option value="" disabled selected>Select a column for Y</option>
        </select>
    </div>
    
    <label for="binsize_0">Bin size:</label>
    <input type="number" class="interval-input" name="binsize" id="binsize_0">
    <button class="binsize"  id="binsize_button_0" data-track="0">Apply</button>

    <label for="samplelength_0">Sample length:</label>
    <input type="number" class="interval-input" name="samplelength" id="samplelength_0">
    <button class="samplelength" id="samplelength_button_0" data-track="0">Apply</button>`
};
export async function row2(container) {
    container.innerHTML = `
    <button class="plot-button" data-track="1">Choose file</button>
    <input type="file" class="file-input" style="display: none;">

    <!-- Second URL button -->
    <button class="url-button" data-track="1">Load from URL</button>
    <input type="url" id="urlinput_1" class="url-input" placeholder="Enter URL">


    <div class="column-container" id="column-container">
        <div id="columnLabelX"></div>
        <label for="columnSelectorX_1">X-axis: </label>
        <select name="xcolumn" id="columnSelectorX_1" class="columnSelectorX" data-track="1">
            <option value="" disabled selected>Select a column for X</option>
        </select>
    </div>

    <div class="column-container" id="column-container">
        <div id="columnLabelY"></div>
        <label for="columnSelectorY_1">Y-axis: </label>
        <select name="ycolumn" id="columnSelectorY_1" class="columnSelectorY" data-track="1">
        <option value="" disabled selected>Select a column for Y</option>
        </select>
    </div>

    <label for="binsize_1">Bin size:</label>
    <input type="number" class="interval-input" name="binsize" id="binsize_1">
    <button class="binsize" id="binsize_button_1" data-track="1">Apply</button>  
    
    <label for="samplelength_1">Sample length:</label>
    <input type="number" class="interval-input" name="samplelength" id="samplelength_1">
    <button class="samplelength" id="samplelength_button_1" data-track="1">Apply</button>
    `
};

export async function row3(container) {
    container.innerHTML = `
    <select name="mark" id="mark_0" class="mark" data-track="0">
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

    <select name="color" id="color_0" class="color" data-track="0">
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
    
    <label for="marksize_0">Mark size:</label>
    <input name="size" type="number" class="interval-input" id="marksize_0" data-track="0">
    <button class="marksize" id="marksize_button_0" data-track="0">Apply</button>
        `
};
export async function row4(container) {
    container.innerHTML = `
    <select name="mark" id="mark_1" class="mark" data-track="1">
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

    <select name="color" id="color_1" class="color" data-track="1">
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

    <label for="marksize_1">Mark size:</label>
    <input name="size" type="number" class="interval-input" id="marksize_1" data-track="1">
    <button class="marksize" id="marksize_button_1" data-track="1">Apply</button>
    `
};
