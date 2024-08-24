/**
 * Populates the given container with HTML content for configuring track settings.
 * @param {HTMLElement} container - The container element to populate.
 * @returns {Promise<void>} - A Promise that resolves after the container is populated.
 */

import { URLfromFile, URLfromServer, GoslingPlotWithLocalData, getCurrentViewSpec } from './plot.js';
import { updateURLParameters } from './update_plot_specifications.js';
import {exportingFigures} from './exporting_functionality.js';

window.canvas_states = {
    1: { 
        trackCount: 1, 
        tracks: [],
        view_control_settings: {
            x_axis: '',
            x_range: [0, 200000],
            left_y_axis: '',
            left_y_range: [0, 1],
            right_y_axis: '',
            right_y_range: [0, 1]
        }
    },
    2: { 
        trackCount: 1, 
        tracks: [],
        view_control_settings: {
            x_axis: '',
            x_range: [0, 200000],
            left_y_axis: '',
            left_y_range: [0, 1],
            right_y_axis: '',
            right_y_range: [0, 1]
        }
    },
    3: { 
        trackCount: 1, 
        tracks: [],
        view_control_settings: {
            x_axis: '',
            x_range: [0, 200000],
            left_y_axis: '',
            left_y_range: [0, 1],
            right_y_axis: '',
            right_y_range: [0, 1]
        }
    }
};

window.currentView = 1
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
<div id="notification" style="display: none; color:white;border-radius: 5px ; padding: 10px; opacity:0.7; margin-top: 10px; position: absolute; top: 10px; left: 12%; transform: translateX(-50%); z-index: 1000;"></div>   

            <div id="header" class="buttons-container">   
  
                <select id="export-dropdown" class="dropdown-content">
                    <option value="" disabled selected>Export as</option>
                    <option id="export-svg-button" value="json">JSON</option>
                    <option id="export-png-button" value="png">PNG</option>
                    <option id="export-html-button" value="html">HTML</option>
                </select>  

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
            ${generateViewControl(window.currentView)}
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

    // Set Canvas 1 as active by default
    canvas1.classList.add('active');

    add_canvas.addEventListener('click', function () {
        if (displayed_canvas === 1) {
            canvas2.style.display = 'block';
            displayed_canvas = 2;
            const view2_btn = document.getElementById('view2-btn');
            view_control.innerHTML = 'View Controls 2';
            window.canvas_num = 2;
            window.currentView = 2
            canvas_number.innerHTML = 'Canvas 2';
            if (!document.getElementById('canvas-container-2')) {
                view2_btn.style.display = 'block';
            }
            if (!window.object_2_created) {
                addOrUpdateCanvasObject('canvas2');
                window.object_2_created = true;
            }
            setActiveCanvas(canvas2);
            updateCanvasUI();
        }
        
        else if (displayed_canvas === 2) {
            canvas3.style.display = 'block';
            view_control.innerHTML = 'View Controls 3';
            window.canvas_num = 3;
            window.currentView = 3
            canvas_number.innerHTML = 'Canvas 3';
            if (!document.getElementById('canvas-container-3')) {
                view3_btn.style.display = 'block';
            }
            if (!window.object_3_created) {
                addOrUpdateCanvasObject('canvas3');
                window.object_3_created = true
            }
            updateCanvasUI();
            setActiveCanvas(canvas3);
            this.style.cursor = 'not-allowed';
            this.disabled = true;
        }
    })

    canvas1.addEventListener('click', function () {
        setActiveCanvas(canvas1);
        view_control.innerHTML = 'View Controls 1';
        window.canvas_num = 1;
        canvas_number.innerHTML = 'Canvas 1';
        updateCanvasUI();
    });

    canvas2.addEventListener('click', function () {
        setActiveCanvas(canvas2);
        const view2_btn = document.getElementById('view2-btn');
        view_control.innerHTML = 'View Controls 2';
        window.canvas_num = 2;
        canvas_number.innerHTML = 'Canvas 2';
        if (!document.getElementById('canvas-container-2')) {
            view2_btn.style.display = 'block';
        }
        if (!window.object_2_created) {
            addOrUpdateCanvasObject('canvas2');
            window.object_2_created = true;
        }
        updateCanvasUI();
    });

    canvas3.addEventListener('click', function () {
        setActiveCanvas(canvas3);
        view_control.innerHTML = 'View Controls 3';
        window.canvas_num = 3;
        canvas_number.innerHTML = 'Canvas 3';
        if (!document.getElementById('canvas-container-3')) {
            view3_btn.style.display = 'block';
        }
        if (!window.object_3_created) {
            addOrUpdateCanvasObject('canvas3');
            window.object_3_created = true;
        }
        updateCanvasUI();
    });

    const view1_btn = document.getElementById('view1-btn');
    const view2_btn = document.getElementById('view2-btn');
    const view3_btn = document.getElementById('view3-btn');
    const canvas_container_1 = document.getElementById('canvas-container-1');

    view1_btn.addEventListener('click', function () {
        view_control.innerHTML = 'View Controls 1';
        canvas_container_1.id = 'canvas-container-1';
        window.currentView = 1;
        updateViewSettings(1);
    });
    
    view2_btn.addEventListener('click', function () {
        view_control.innerHTML = 'View Controls 2';
        canvas_container_1.id = 'canvas-container-2';
        window.currentView = 2;
        updateViewSettings(2);
    });
    
    view3_btn.addEventListener('click', function () {
        view_control.innerHTML = 'View Controls 3';
        canvas_container_1.id = 'canvas-container-3';
        window.currentView = 3;
        updateViewSettings(3);
    });

    
    // Add the toggle effect for the initial canvas container
    addCanvasBarToggle('canvas-bar-1', 'canvas-container-1');
    updateCanvasUI();
    exportingFigures();

}


function updateViewSettings(view) {
    const settings = window.canvas_states[view].view_control_settings;
    
    // Update X-axis
    document.getElementById('x_range_start').value = settings.x_range[0];
    document.getElementById('x_range_end').value = settings.x_range[1];
    document.getElementById('columnSelectorX_0').value = settings.x_axis;

    // Update Left Y-axis
    document.getElementById('y_start_left').value = settings.left_y_range[0];
    document.getElementById('y_end_left').value = settings.left_y_range[1];
    document.getElementById('columnSelectorYLeft').value = settings.left_y_axis;

    // Update Right Y-axis
    document.getElementById('y_start_right').value = settings.right_y_range[0];
    document.getElementById('y_end_right').value = settings.right_y_range[1];
    document.getElementById('columnSelectorYRight').value = settings.right_y_axis;
}
function setActiveCanvas(activeCanvas) {
    const canvasButtons = document.querySelectorAll('.canvas-button');
    canvasButtons.forEach(button => button.classList.remove('active'));
    activeCanvas.classList.add('active');
}
// Add or update a canvas object with the given ID
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
// the toggle effect for the canvas bar
function addCanvasBarToggle(barId, containerId) {
    const canvasBar = document.getElementById(barId);
    const canvasContainer = document.getElementById(containerId);
    if (canvasBar && canvasContainer) {
        canvasBar.addEventListener('click', () => {
            const canvasContent = canvasContainer.querySelector('.canvas_content');
            if (canvasContent) {
                canvasContent.classList.toggle('hidden');
            }
        });
    }

    // Add event listener to the clear all settings button
    const clearAllSettingsButton = document.querySelector('#clear_url_button');
    if (clearAllSettingsButton) {
        clearAllSettingsButton.addEventListener('click', () => {
            // Clear FILENAMES object
            window.FILENAMES = {};
            
            // Clear other settings
            updateURLParameters("xDomain.interval", [0, 200000]);
            
            // Reset canvas states
            for (let i = 1; i <= 3; i++) {
                window.canvas_states[i] = {
                    trackCount: 1,
                    tracks: [],
                    view_control_settings: {
                        x_axis: '',
                        x_range: [0, 200000],
                        left_y_axis: '',
                        left_y_range: [0, 1],
                        right_y_axis: '',
                        right_y_range: [0, 1]
                    }
                };
            }
            
            // Reload the page
            location.reload();
        });
    }
}

function updateCanvasUI() {
    const currentCanvasState = window.canvas_states[window.canvas_num];
    document.getElementById('trackCountSelector').value = currentCanvasState.trackCount;
    generateTracks();
}

function resetTrackSettings(trackNumber) {
    // Reset inputs and selectors to their default values
    document.getElementById(`binsize_${trackNumber}`).value = '';
    document.getElementById(`samplelength_${trackNumber}`).value = '';
    document.getElementById(`marksize_${trackNumber}`).value = '';
    document.getElementById(`columnSelectorX_${trackNumber}`).selectedIndex = 0;
    document.getElementById(`columnSelectorYLeft`).selectedIndex = 0;
    document.getElementById(`columnSelectorYRight`).selectedIndex = 0;
    document.getElementById(`mark_${trackNumber}`).selectedIndex = 0;
    document.getElementById(`color_${trackNumber}`).selectedIndex = 0;
    
    // Reset other track-specific settings as needed
    const plotSpec = getCurrentViewSpec();
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
    GoslingPlotWithLocalData();
}



window.updateTrackNumber = async function () {
    const currentCanvasState = window.canvas_states[window.canvas_num];
    currentCanvasState.trackCount++;
    if (currentCanvasState.trackCount > 5) currentCanvasState.trackCount = 5;
    else {
        document.getElementById("trackCountSelector").value = currentCanvasState.trackCount;
        generateTracks();
    }
}
// Generate track elements based on the selected track count
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
                <span id="clear_settings_button${i}" class="clear_settings_button">Clear settings <i class="fa fa-times-circle" style="font-size:18px;"></i></span>
            </div>
        <div id="data-load" class="btn-row">
        <div class=file-container>
            <button class="plot-button" data-track="${i}"><i class="fa fa-upload" style="font-size:18px;"></i> Select file </button> 
            <input type="file" class="file-input" style="display: none;">
            <label for="urlinput_${i}" class='or-inbetween'>OR</label>
            <input type="url" id="urlinput_${i}" class="url-input" placeholder="Enter URL">
            <button class="url-button" data-track="${i}">Load</button>
            <label class="success-msg" id="msg-load-track-${i}"></label>
        </div>
        </div>
        ${await generateTrackBinAndSampleInputs(i)}                                
    </div>`;
    const filenameElement = document.getElementById(`filename-display-${i}`);
    if (filenameElement && window.FILENAMES[i]) {
        filenameElement.textContent = `File: ${window.FILENAMES[i]}`;
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
    await window.track_settings_btns(trackCount);  
    await window.showHideTracks();
}

// Ensure the Add Track button triggers the track count update
window.onload = function () {
    document.getElementById('add_track_button').addEventListener('click', updateTrackNumber);
}

// Show or hide tracks based on the selected track
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
    const fileName = window.FILENAMES[trackNumber] || "No file selected";
    return `
    <div class='bin-sample-container track-${trackNumber}'> 
        <div class="file-info">
            <span id="filename-display-${trackNumber}">File: ${fileName}</span>
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
                        <option value="triangleRight">triangle</option>
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
                    <button class="delete-track-button" data-track="${trackNumber}"><i class="fa fa-trash"></i></button>
                </div>
            </div>
        </div>
    </div>`;
}

async function deleteTrack(trackToDelete) {
    const currentCanvasState = window.canvas_states[window.canvas_num];
    
    // Remove the track from the plotSpec
    const plotSpec = getCurrentViewSpec();
    plotSpec.tracks.splice(trackToDelete, 1);

    // Remove the file name from FILENAMES object
    delete window.FILENAMES[trackToDelete];

    // Shift the remaining file names
    for (let i = trackToDelete + 1; i < currentCanvasState.trackCount; i++) {
        if (window.FILENAMES[i]) {
            window.FILENAMES[i - 1] = window.FILENAMES[i];
            delete window.FILENAMES[i];
        }
    }

    // Update the track count
    currentCanvasState.trackCount--;

    // Update the UI
    document.getElementById('trackCountSelector').value = currentCanvasState.trackCount;
    await generateTracks();

    // Update the plot
    await GoslingPlotWithLocalData();

    // Update URL parameters
    updateURLParameters(`track${trackToDelete}`, null);
}

window.track_settings_btns = async function(trackNumber){
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

    document.querySelectorAll('.delete-track-button').forEach(function (deleteButton) {
        deleteButton.addEventListener('click', async function () {
            const trackToDelete = parseInt(this.getAttribute('data-track'));
            await deleteTrack(trackToDelete);
        });
    });
    document.querySelectorAll('.mark').forEach(function (markSelector) {
        markSelector.addEventListener('change', async function () {
            const trackValue = this.getAttribute('data-track');
            const chosenMark = this.value;
            const plotSpec = getCurrentViewSpec();
            plotSpec.tracks[trackValue].mark = chosenMark;
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
        let clear_settings_button = document.getElementById(`clear_settings_button${i}`);
        if (clear_settings_button) {
            clear_settings_button.addEventListener('click', function () {
                resetTrackSettings(i);
            });
        }
    }      
    
    // Add event listener to the apply all button for the canvas
    document.querySelector('.apply-all-button').addEventListener('click', async function () {
        const currentView = window.currentView;
        const currentCanvasState = window.canvas_states[currentView];
        
        // X-axis range
        const x_start = parseFloat(document.getElementById('x_range_start').value);
        const x_end = parseFloat(document.getElementById('x_range_end').value);
        let x_interval = [x_start, x_end];
        
        if(isNaN(x_start) && isNaN(x_end)) {
            x_interval = [0, 200000];
        }
        
        // Left Y-axis range
        const y_start_left = parseFloat(document.getElementById('y_start_left').value);
        const y_end_left = parseFloat(document.getElementById('y_end_left').value);
        let y_interval_left = [y_start_left, y_end_left];
        
        if(isNaN(y_start_left) && isNaN(y_end_left)) {
            y_interval_left = [0, 1];
        }
        
        // Right Y-axis range
        const y_start_right = parseFloat(document.getElementById('y_start_right').value);
        const y_end_right = parseFloat(document.getElementById('y_end_right').value);
        let y_interval_right = [y_start_right, y_end_right];
    
        if(isNaN(y_start_right) && isNaN(y_end_right)) {
            y_interval_right = [0, 1];
        }
    
        // Update the current view's settings
        currentCanvasState.view_control_settings.x_range = x_interval;
        currentCanvasState.view_control_settings.left_y_range = y_interval_left;
        currentCanvasState.view_control_settings.right_y_range = y_interval_right;
        currentCanvasState.view_control_settings.x_axis = document.getElementById('columnSelectorX_0').value;
        currentCanvasState.view_control_settings.left_y_axis = document.getElementById('columnSelectorYLeft').value;
        currentCanvasState.view_control_settings.right_y_axis = document.getElementById('columnSelectorYRight').value;
    
        // Update plot spec and redraw
        const plotSpec = getCurrentViewSpec();
        plotSpec.xDomain.interval = x_interval;
        
        const leftChecked = document.querySelectorAll('#checkbox-left-axis input[type="checkbox"]:checked');
        leftChecked.forEach(function (checkbox) {
            const trackIndex = parseInt(checkbox.value.split(' ')[1]) - 1;
            plotSpec.tracks[trackIndex].y.domain = y_interval_left;
        });
    
        const rightChecked = document.querySelectorAll('#checkbox-right-axis input[type="checkbox"]:checked');
        rightChecked.forEach(function (checkbox) {
            const trackIndex = parseInt(checkbox.value.split(' ')[1]) - 1;
            plotSpec.tracks[trackIndex].y.domain = y_interval_right;
        });
    
        await GoslingPlotWithLocalData();
        updateURLParameters("xDomain.interval", x_interval);
        updateURLParameters("yDomain.left", y_interval_left);
        updateURLParameters("yDomain.right", y_interval_right);
    });
}

function generateViewControl(currentView){
    return`            
    <div id='canvas-container-${currentView}' class='canvas-container'>
                <div id='canvas-bar-${currentView}' class='canvas_bar'>
                    <h3 class = 'view-control'>View Controls ${currentView}</h3>
                </div>
                <div class="canvas_content hidden">
                    <div class="btn-row" id="global-variables">
                        <h2 class='x_axis_h2'>X axis</h2>
                            <div class="column-container">
                                <div class='x-axis-select'>
                                    <label for="columnSelectorX_0">X-axis: </label>
                                    <select name="xcolumn" id="columnSelectorX_0" class="columnSelectorX"  data-track="0">
                                        <option value="" disabled selected></option>
                                    </select>
                                </div>
                                <div class = 'column1'> 
                                    <label for="x_range_start">X-range:</label>
                                    <input type="text" class="interval-input" id="x_range_start">                    
                                    <span class='dashed-range'>-</span>
                                    <input type="text" class="interval-input" id="x_range_end">
                                </div>
                            </div>
                        <div class='bcolor-container'> 
                            <label for="bcolor">Select background color  </label>
                            <select name="bcolor" id="bcolor">
                                <option value="white">white</option>
                                <option value="grey">grey</option>
                            </select>
                        </div>
                    </div>
                    <div class="btn-row" id="global-y-variables-left"> 
                        <h2>Y-axis</h2>
                        <div class = 'column2'>                
                            <h2 class='y-axis-left'><i class="fa fa-solid fa-caret-left"></i>  Left Y-axis </h2>
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
                                <label for="columnSelectorYLeft">Left-Y-axis: </label>
                                <select name="ycolumn" id="columnSelectorYLeft" class="columnSelectorY" data-track="0">
                                    <option value="" disabled selected=""></option>
                                </select>
                                <div class = 'y-range-left'>                
                                    <label for="y_start_left">Y-range:</label>
                                    <input type="text" class="interval-input" id="y_start_left">
                                    <span class='dashed-range'>-</span>
                                    <input type="text" class="interval-input" id="y_end_left">
                                </div> 
                            </div>
                        </div>
                    </div>
                    <div class="btn-row" id="global-y-variables-right">
                        <div class = 'column3'>                 
                            <h2 class='y-axis-right'>Right Y-axis  <i class="fa fa-solid fa-caret-right"></i></h2>
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
                                <label for="columnSelectorYRight">Right-Y-axis: </label>
                                <select name="ycolumn" id="columnSelectorYRight" class="columnSelectorY" data-track="0">
                                    <option value="" disabled selected=""></option>
                                </select>
                                <div class = 'y-range-right'>   
                                    <label for="y_start_right">Y-range:</label>
                                    <input type="text" class="interval-input" id="y_start_right">
                                    <span class='dashed-range'>-</span>
                                    <input type="text" class="interval-input" id="y_end_right">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="btn-row">
                        <button class="apply-all-button">Apply</button>
                    </div>
                </div>
            </div>`
}