/**
 * Populates the given container with HTML content for configuring track settings.
 * @param {HTMLElement} container - The container element to populate.
 * @returns {Promise<void>} - A Promise that resolves after the container is populated.
 */

import { URLfromFile, URLfromServer, GoslingPlotWithLocalData, getCurrentViewSpec } from './plot.js';
import { updateURLParameters } from './update_plot_specifications.js';

window.canvas_states = {
    1: { trackCount: 1, tracks: [] },
    2: { trackCount: 1, tracks: [] },
    3: { trackCount: 1, tracks: [] },
};
window.canvas_num = 1;
window.object_2_created = false
window.object_3_created = false
window.trackCount = 5;
window.displayed_canvas = 1
export async function all_buttons(container) {
    container.innerHTML = `
    <div class="body-container">
        <div class="left-section">
            <div class="canvas"> 
                <button id="canvas1" class="canvas-button">Canvas 1</button>
                <button id="canvas2" class="canvas-button">Canvas 2</button>
                <button id="canvas3" class="canvas-button">Canvas 3</button>
                <button id="add_canvas"> <i class="fa fa-plus"></i></button>
            </div>  
            <div id="header" class="buttons-container">            
                <div class="btn-row">
                    <h2 class='canvas_number'>Canvas 1</h2>
                    <h2>Track Controls</h2>
                    <span id="clear_url_button" class="clear_all_settings"><u>  Clear All </u></span>
                    <button id='add_track_button' class="add_track_button"><i class="fa fa-plus-circle" style="font-size:24px;"></i>Add Track</button>
                    <label for="trackCountSelector"></label>
                    <select id="trackCountSelector" class='trackCountSelector' onchange="generateTracks()">
                        <option value="1" selected>1 Track</option>
                        <option value="2">2 Tracks</option>
                        <option value="3">3 Tracks</option>
                        <option value="4">4 Tracks</option>
                        <option value="5">5 Tracks</option>
                    </select>
                </div>
                <div class="both_tracks btn-row">
                    <div>
                        <label for="trackSelector"></label>
                        <select id="trackSelector" onchange="showHideTracks()"></select>
                    </div>
                    <select name="bcolor" id="bcolor">
                        <option value="" disabled="" selected=""></option>
                        <option value="white">white</option>
                        <option value="grey">grey</option>
                    </select>
                </div>
                <div id="data-load" class="btn-row">
                    <div id="container"></div> 
                </div>
            </div>
        </div>
        <div class="right-section">
            <div class='bars'> 
                <button id='view1-btn' class='view-btn'> View 1 </button>
                <button id='view2-btn' class='view-btn' style='display:none;'> View 2 </button>
                <button id='view3-btn' class='view-btn' style='display:none;'> View 3 </button>
            </div>
            <div id='canvas-container-1' class='canvas-container'>
                <div id='canvas-bar-1' class='canvas_bar'>
                    <h3 class = 'view-control'>View Controls 1</h3>
                </div>
                <div class="canvas_content">
                    <div class="btn-row" id="global-variables">
                        <div class="column-container">
                            <div id="columnLabelX"></div>
                            <label for="columnSelectorX_0">X-axis: </label>
                            <select name="xcolumn" id="columnSelectorX_0" class="columnSelectorX" data-track="0">
                                <option value="" disabled selected></option>
                            </select>                
                            <label for="x_range_start">X-range:</label>
                            <input type="text" class="interval-input" id="x_range_start">                    
                            <span>-</span>
                            <input type="text" class="interval-input" id="x_range_end">
                            <button class="x_interval_button">Apply</button>
                        </div>
                    </div>
                    <div class="btn-row" id="global-y-variables-left">                
                        <h4>Left axis</h4>
                        <form id="checkbox-left-axis">
                            <div class="y-checkbox-option">    
                                <input class="y-checkbox-option" type="checkbox" id="track1-left" name="option" value="Track 1" checked>
                                <label for="track1-left">Track 1</label><br>
                            </div>
                            <div class="y-checkbox-option">        
                                <input class="y-checkbox-option" type="checkbox" id="track2-left" name="option" value="Track 2" checked>
                                <label for="track2-left">Track 2</label><br>                    
                            </div>
                        </form>
                        <div class="column-container">
                            <div id="columnLabelY"></div>
                            <label for="columnSelectorYLeft">Left-Y-axis: </label>
                            <select name="ycolumn" id="columnSelectorYLeft" class="columnSelectorY" data-track="0">
                                <option value="" disabled selected=""></option>
                            </select>                
                            <label for="y_start">Y-range:</label>
                            <input type="text" class="interval-input" id="y_start_left">
                            <span>-</span>
                            <input type="text" class="interval-input" id="y_end_left">
                            <button class="y_interval_button" id="y_interval_button_left">Apply</button>
                        </div>
                    </div>
                    <div class="btn-row" id="global-y-variables-right">                
                        <h4>Right axis</h4>
                        <form id="checkbox-right-axis">
                            <div class="y-checkbox-option">    
                                <input class="y-checkbox-option" type="checkbox" id="track1-right" name="option" value="Track 1">
                                <label for="track1-right">Track 1</label><br>
                            </div>
                            <div class="y-checkbox-option">    
                                <input class="y-checkbox-option" type="checkbox" id="track2-right" name="option" value="Track 2">
                                <label for="track2-right">Track 2</label><br>                    
                            </div>
                        </form>
                        <div class="column-container">
                            <div id="columnLabelY"></div>
                            <label for="columnSelectorYRight">Right-Y-axis: </label>
                            <select name="ycolumn" id="columnSelectorYRight" class="columnSelectorY" data-track="0">
                                <option value="" disabled selected=""></option>
                            </select>
                            <label for="y_start">Y-range:</label>
                            <input type="text" class="interval-input" id="y_start_right">
                            <span>-</span>
                            <input type="text" class="interval-input" id="y_end_right">
                            <button class="y_interval_button" id="y_interval_button_right">Apply</button>
                        </div>
                    </div>
                </div>
            </div>
            <div id="plot-container-1" class="plot-container"></div>
        </div>
    </div>
    `;

    const canvas1 = document.getElementById('canvas1');
    const canvas2 = document.getElementById('canvas2');
    const canvas3 = document.getElementById('canvas3');
    const view_control = document.querySelector('.view-control');
    const canvas_number = document.querySelector('.canvas_number');
    const add_canvas = document.getElementById('add_canvas');

    add_canvas.addEventListener('click', function () {
        if (displayed_canvas === 1) {
            canvas2.style.display = 'block';
            displayed_canvas = 2
            const view2_btn = document.getElementById('view2-btn');
            view_control.innerHTML = 'View Controls 2';
            window.canvas_num = 2;
            canvas_number.innerHTML = 'Canvas 2';
            if (!document.getElementById('canvas-container-2')) {
                view2_btn.style.display = 'block';
            }
            if (!window.object_2_created) {
                addOrUpdateCanvasObject('canvas2');
                window.object_2_created = true
            }
            resetSelections();
            updateCanvasUI();
        }
        
        else if (displayed_canvas === 2) {
            canvas3.style.display = 'block';
            view_control.innerHTML = 'View Controls 3';
            window.canvas_num = 3;
            canvas_number.innerHTML = 'Canvas 3';
            if (!document.getElementById('canvas-container-3')) {
                view3_btn.style.display = 'block';
            }
            if (!window.object_3_created) {
                addOrUpdateCanvasObject('canvas3');
                window.object_3_created = true
            }
            resetSelections();
            updateCanvasUI();
            this.style.cursor = 'not-allowed';
            this.disabled = true;
        }
    })

    canvas1.addEventListener('click', function () {
        view_control.innerHTML = 'View Controls 1';
        window.canvas_num = 1;
        canvas_number.innerHTML = 'Canvas 1';
        resetSelections();
        updateCanvasUI();
    });

    canvas2.addEventListener('click', function () {
        const view2_btn = document.getElementById('view2-btn');
        view_control.innerHTML = 'View Controls 2';
        window.canvas_num = 2;
        canvas_number.innerHTML = 'Canvas 2';
        if (!document.getElementById('canvas-container-2')) {
            view2_btn.style.display = 'block';
        }
        if (!window.object_2_created) {
            addOrUpdateCanvasObject('canvas2');
            window.object_2_created = true
        }
        resetSelections();
        updateCanvasUI();
    });

    canvas3.addEventListener('click', function () {
        view_control.innerHTML = 'View Controls 3';
        window.canvas_num = 3;
        canvas_number.innerHTML = 'Canvas 3';
        if (!document.getElementById('canvas-container-3')) {
            view3_btn.style.display = 'block';
        }
        if (!window.object_3_created) {
            addOrUpdateCanvasObject('canvas3');
            window.object_3_created = true
        }
        resetSelections();
        updateCanvasUI();
    });

    const view1_btn = document.getElementById('view1-btn');
    const view2_btn = document.getElementById('view2-btn');
    const view3_btn = document.getElementById('view3-btn');
    const canvas_container_1 = document.getElementById('canvas-container-1');

    view1_btn.addEventListener('click', function () {
        view_control.innerHTML = 'View Controls 1';
        canvas_container_1.id = 'canvas-container-1';
        resetSelections();
    });
    view2_btn.addEventListener('click', function () {
        view_control.innerHTML = 'View Controls 2';
        canvas_container_1.id = 'canvas-container-2';
        resetSelections();
    });
    view3_btn.addEventListener('click', function () {
        view_control.innerHTML = 'View Controls 3';
        canvas_container_1.id = 'canvas-container-3';
        resetSelections();
    });

    // Add the toggle effect for the initial canvas container
    addCanvasBarToggle('canvas-bar-1', 'canvas-container-1');
    updateCanvasUI();
}

function addOrUpdateCanvasObject(canvasId) {
    const canvas_container = document.createElement('div');
    canvas_container.id = `canvas-container-${canvasId}`;
    const newCanvasObject = {
        id: canvasId,
        title: `Canvas ${canvasId.slice(-1)}`,
        static: false,
        xDomain: { interval: [0, 200000] },
        alignment: "overlay",
        width: 900,
        height: 200,
        assembly: "unknown",
        linkingId: "detail",
        style: {
            background: "#D3D3D3",
            backgroundOpacity: 0.1,
        },
        tracks: [
            window.plotSpecManager.createTrack(),
            window.plotSpecManager.createTrack(),
            window.plotSpecManager.createTrack(),
            window.plotSpecManager.createTrack(),
            window.plotSpecManager.createTrack(),
        ],
    };

    window.plotSpecManager.addOrUpdateCanvasObject(canvasId, newCanvasObject);
    GoslingPlotWithLocalData();
    
}

function resetSelections() {
    const xSelectors = document.querySelectorAll('.columnSelectorX');
    const yLeftSelectors = document.querySelectorAll('#columnSelectorYLeft');
    const yRightSelectors = document.querySelectorAll('#columnSelectorYRight');

    xSelectors.forEach(selector => {
        selector.selectedIndex = 0;
    });

    yLeftSelectors.forEach(selector => {
        selector.selectedIndex = 0;
    });

    yRightSelectors.forEach(selector => {
        selector.selectedIndex = 0;
    });
}

function addCanvasBarToggle(barId, containerId) {
    const canvasBar = document.getElementById(barId);
    const canvasContainer = document.getElementById(containerId);
    if (canvasBar && canvasContainer) {
        canvasBar.addEventListener('click', () => {
            const canvasContent = canvasContainer.querySelector('.canvas_content');
            if (canvasContent) {
                canvasContent.style.display = canvasContent.style.display === 'none' ? 'block' : 'none';
            }
        });
    }

    // Add event listener to the clear all settings button
    const clearAllSettingsButton = document.querySelector('#clear_url_button');
    if (clearAllSettingsButton) {
        clearAllSettingsButton.addEventListener('click', () => {
            location.reload();
        });
    }
}

function updateCanvasUI() {
    const currentCanvasState = window.canvas_states[window.canvas_num];
    document.getElementById('trackCountSelector').value = currentCanvasState.trackCount;
    generateTracks();
    // GoslingPlotWithLocalData();
}

window.updateTrackNumber = async function () {
    const currentCanvasState = window.canvas_states[window.canvas_num];
    currentCanvasState.trackCount++;
    if (currentCanvasState.trackCount > 5) currentCanvasState.trackCount = 5;
    document.getElementById("trackCountSelector").value = currentCanvasState.trackCount;
    generateTracks();

}

window.generateTracks = async function () {
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
        const defaultColor = document.getElementById(`color_${i}`).value;
        await updateURLParameters(`color.value${i}`, defaultColor);      
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
            <span id="clear_url_button${i}"><u class="clear_url_button"> Clear settings <i class="fa fa-times-circle" style="font-size:18px;"></i></u></span >  
        </div>
        <div id="data-load" class="btn-row">
        <div>
            <button class="plot-button" data-track="${i}"><i class="fa fa-upload" style="font-size:18px;"></i> Select file </button> 
            <input type="file" class="file-input" style="display: none;">
            <label for="urlinput_${i}" style="margin-right:30px;">OR</label>
            <input type="url" id="urlinput_${i}" class="url-input" placeholder="Enter URL">
            <button class="url-button" data-track="${i}">Load</button>
            <label class="success-msg" id="msg-load-track-${i}"></label>
        </div>
        </div>
        ${await generateTrackBinAndSampleInputs(i)}                                
    </div>`;
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
    await window.generateElementsActions(trackCount);  
    await window.showHideTracks();
    await GoslingPlotWithLocalData();
}

// Ensure the Add Track button triggers the track count update
window.onload = function () {
    document.getElementById('add_track_button').addEventListener('click', updateTrackNumber);
    // generateTracks();
}

window.showHideTracks = async function () {
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
window.generateTrackBinAndSampleInputs = async function (trackNumber) {
    return `
    <div class='bin-sample-container track-${trackNumber}'> 
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
                        <option value="point" selected>point</option>
                        <option value="line">line</option>
                        <option value="area">area</option>
                        <option value="bar">bar</option>
                        <option value="rect">rect</option>
                        <option value="text">text</option>
                        <option value="link">link</option>
                        <option value="triangle">triangle</option>
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
                </div>
            </div>
        </div>
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
            <label for="x_range_start">X-domain:</label>
            <input type="text" class="interval-input" id="x_range_start">
            <span>-</span>
            <input type="text" class="interval-input" id="x_range_end">
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
            <button class="y_interval_button" id="y_interval_button${trackNumber}">Apply</button>
        </div>`;
}

/**
 * Generates HTML for selectors related to mark type, color, and size for a track.
 * @param {number} trackNumber - The number of the track.
 * @returns {string} - The HTML content for mark selectors.
 */
// window.generateTrackMarkSelector = async function(trackNumber) {
//     return `
//         <div class="track${trackNumber} btn-row">

           
//         </div>`;
// }

window.generateElementsActions = async function(trackNumber) {
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

    document.querySelectorAll('.mark').forEach(function (markSelector) {
        markSelector.addEventListener('change', async function () {
            const trackValue = this.getAttribute('data-track');
            const chosenMark = this.value;
            const plotSpec = getCurrentViewSpec();
            plotSpec.tracks[trackValue].mark = chosenMark;
            await GoslingPlotWithLocalData();
            await updateURLParameters(`mark${trackValue}`, chosenMark);
        });
    });

    document.querySelectorAll('.color').forEach(function (colorSelector) {
        colorSelector.addEventListener('change', async function () {
            const trackValue = this.getAttribute('data-track');
            const chosenColor = this.value;
            const plotSpec = getCurrentViewSpec();
            plotSpec.tracks[trackValue].color.value = chosenColor;
            await GoslingPlotWithLocalData();
            await updateURLParameters(`color.value${trackValue}`, chosenColor);
        });
    });

    document.querySelectorAll('.marksize').forEach(function (sizeInput) {
        sizeInput.addEventListener('input', async function () {
            const trackValue = this.getAttribute('data-track');
            const chosenSize = parseFloat(this.value);
            const plotSpec = getCurrentViewSpec();
            plotSpec.tracks[trackValue].size.value = chosenSize;
            await GoslingPlotWithLocalData();
            await updateURLParameters(`size.value${trackValue}`, chosenSize);
        });
    });
    
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
                plotSpec.tracks[trackNumber].binSize = binSize;
                await updateURLParameters(`binsize${trackNumber}`, binSize);
            }
            
            if (!isNaN(sampleLength)) {
                plotSpec.tracks[trackNumber].sampleLength = sampleLength;
                await updateURLParameters(`samplelength${trackNumber}`, sampleLength);
            }
            
            if (!isNaN(markSize)) {
                plotSpec.tracks[trackNumber].size.value = markSize;
                await updateURLParameters(`size.value${trackNumber}`, markSize);
            }
            
            await GoslingPlotWithLocalData();
        });
    });

    document.querySelectorAll('.url-button').forEach(function (urlButton, trackNumber) {
        const urlInput = document.getElementById(`urlinput_${trackNumber}`);
        
        urlButton.addEventListener('click', function () {
            URLfromServer(urlInput.value, trackNumber);
        });
    });

    for (let i = 0; i < trackNumber; i++) {
        let clear_url_button = document.getElementById(`clear_url_button${i}`);
        if (clear_url_button) {
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
                    // window.location.reload();
                } catch (error) {
                    console.error(error);
                }
            });
        }
    }      
}