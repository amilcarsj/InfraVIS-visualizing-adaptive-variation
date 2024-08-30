/**
 * Populates the given container with HTML content for configuring track settings.
 * @param {HTMLElement} container - The container element to populate.
 * @returns {Promise<void>} - A Promise that resolves after the container is populated.
 */

import { URLfromFile, URLfromServer, GoslingPlotWithLocalData, getCurrentViewSpec } from './plot.js';
import { updateURLParameters } from './update_plot_specifications.js';
import {exportingFigures} from './exporting_functionality.js';
import {generateTracks} from './track.js'

window.canvas_states = {
    1: { trackCount: 1, tracks: [],filenames:{}, view_control_settings: {x_axis: '', x_range: [0, 200000], left_y_axis: '', left_y_range: [0, 1], right_y_axis: '', right_y_range: [0, 1], checked_left : [], checked_right : []}},
    2: { trackCount: 1, tracks: [],filenames:{}, view_control_settings: {x_axis: '', x_range: [0, 200000], left_y_axis: '', left_y_range: [0, 1], right_y_axis: '', right_y_range: [0, 1], checked_left : [], checked_right : []}},
    3: { trackCount: 1, tracks: [],filenames:{}, view_control_settings: {x_axis: '', x_range: [0, 200000], left_y_axis: '', left_y_range: [0, 1], right_y_axis: '', right_y_range: [0, 1], checked_left : [], checked_right : []}}
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
                <button id="add_canvas" aria-label="Close"> <i class="fa fa-plus"></i></button>
            </div>  
            <div id="notification" style="display: none; color:white;border-radius: 5px ; padding: 10px; opacity:0.7; margin-top: 10px; position: absolute; top: 10px; left: 12%; transform: translateX(-50%); z-index: 1000;"></div>   
            <div id="header" class="buttons-container">   
                <select id="export-dropdown" class="dropdown-content">
                    <option value="" disabled selected>Export as</option>
                    <option id="export-json-button" value="json">JSON</option>
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
                <button id="add_view" aria-label="Close"> <i class="fa fa-plus"></i></button>
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
    const add_view = document.getElementById('add_view');
    const view1_btn = document.getElementById('view1-btn');
    const view2_btn = document.getElementById('view2-btn');
    const view3_btn = document.getElementById('view3-btn');

    //Adding views functionality
    add_view.addEventListener('click', function(){
        if(currentView === 1) {                       
            view2_btn.style.display = 'block';
            window.currentView = 2
            view_control.innerHTML = 'View Controls 2'
            updateViewSettings(2);
        } else if(currentView === 2) {
            view_control.innerHTML = 'View Controls 3'
            view3_btn.style.display = 'block';
            window.currentView = 3
            updateViewSettings(3);
            this.style.cursor = 'not-allowed';
            this.disabled = true;
        }    
    })
    // Set Canvas 1 as active by default
    canvas1.classList.add('active');
    // Adding canvases
    add_canvas.addEventListener('click', function () {
        if (displayed_canvas === 1) {
            canvas2.style.display = 'block';
            displayed_canvas = 2;
            window.canvas_num = 2;
            canvas_number.innerHTML = 'Canvas 2';
            if (!window.object_2_created) {
                addOrUpdateCanvasObject('canvas2');
                window.object_2_created = true;
            }
            setActiveCanvas(canvas2);
            updateCanvasUI();
        }
        // if there is alreadyt canvas 2
        else if (displayed_canvas === 2) {
            canvas3.style.display = 'block';
            window.canvas_num = 3;
            canvas_number.innerHTML = 'Canvas 3';
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
    // Making canvas1 active
    canvas1.addEventListener('click', function () {
        setActiveCanvas(canvas1);
        window.canvas_num = 1;
        canvas_number.innerHTML = 'Canvas 1';
        updateCanvasUI();
    });
    // Making canvas2 active
    canvas2.addEventListener('click', function () {
        setActiveCanvas(canvas2);
        window.canvas_num = 2;
        canvas_number.innerHTML = 'Canvas 2';
        if (!window.object_2_created) {
            addOrUpdateCanvasObject('canvas2');
            window.object_2_created = true;
        }
        updateCanvasUI();
    });
    // Making canvas3 active
    canvas3.addEventListener('click', function () {
        setActiveCanvas(canvas3);
        window.canvas_num = 3;
        canvas_number.innerHTML = 'Canvas 3';
        if (!window.object_3_created) {
            addOrUpdateCanvasObject('canvas3');
            window.object_3_created = true;
        }
        updateCanvasUI();
    });

    // Switching between views functionality
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
    exportingFigures();
}

/**
 * To change the active canvas, the canvas that is passed in as param will be active. 
 * @param {activeCanvas} activeCanvas 
 */
export function setActiveCanvas(activeCanvas) {
    const canvasButtons = document.querySelectorAll('.canvas-button');
    canvasButtons.forEach(button => button.classList.remove('active'));
    activeCanvas.classList.add('active');
}
/**
 * To update the UI after each change.
 */
export function updateCanvasUI() {
    const currentCanvasState = window.canvas_states[window.canvas_num];
    document.getElementById('trackCountSelector').value = currentCanvasState.trackCount;
    generateTracks();
}
// Add or update a canvas object with the given ID
export function addOrUpdateCanvasObject(canvasId) {
    const canvas_container = document.createElement('div');
    canvas_container.id = `canvas-container-${canvasId}-${currentView}`;
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
    // Generate new canvas with the new ID.
    window.plotSpecManager.addOrUpdateCanvasObject(canvasId, newCanvasObject);
    GoslingPlotWithLocalData();
}
// the toggle effect for the canvas bar
export function addCanvasBarToggle(barId, containerId) {
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
            window.canvas_states[1].filenames = {};
            window.canvas_states[2].filenames = {};
            window.canvas_states[3].filenames = {};
            
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
/**
 * It will generate the default settings for the view control, when a new view is generated
 * @param {view} view 
 */
export function updateViewSettings(view) {
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

    const leftCheckboxes = document.querySelectorAll('#checkbox-left-axis input[type="checkbox"]');
    leftCheckboxes.forEach(checkbox => {
        checkbox.checked = settings.checked_left.includes(checkbox.id);
    });

    // Restore right axis checked boxes
    const rightCheckboxes = document.querySelectorAll('#checkbox-right-axis input[type="checkbox"]');
    rightCheckboxes.forEach(checkbox => {
        checkbox.checked = settings.checked_right.includes(checkbox.id);
    });
    view_control_apply_changes()
}

/**
 * To fetch and preserve the settings for each view. 
 */
export function view_control_apply_changes () {
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
        
        plotSpec.xDomain.interval = currentCanvasState.view_control_settings.x_range;
        // To update the checkboxes for left and right.
        const leftChecked = document.querySelectorAll('#checkbox-left-axis input[type="checkbox"]:checked');
        leftChecked.forEach(function (checkbox) {
            const trackIndex = parseInt(checkbox.value.split(' ')[1]) - 1;
            plotSpec.tracks[trackIndex].y.domain = currentCanvasState.view_control_settings.left_y_range;
            plotSpec.tracks[trackIndex].y.field = document.getElementById('columnSelectorYLeft').options[currentCanvasState.view_control_settings.left_y_axis].textContent
            plotSpec.tracks[trackIndex].y.axis = 'left'
            plotSpec.tracks[trackIndex].x.field = document.getElementById('columnSelectorX_0').options[currentCanvasState.view_control_settings.x_axis].textContent
            currentCanvasState.view_control_settings.checked_left = Array.from(leftChecked).map(checkbox => checkbox.id);
        });
        const rightChecked = document.querySelectorAll('#checkbox-right-axis input[type="checkbox"]:checked');
        rightChecked.forEach(function (checkbox) {
            const trackIndex = parseInt(checkbox.value.split(' ')[1]) - 1;
            plotSpec.tracks[trackIndex].y.domain = currentCanvasState.view_control_settings.right_y_range;
            plotSpec.tracks[trackIndex].y.field = document.getElementById('columnSelectorYRight').options[currentCanvasState.view_control_settings.right_y_axis].textContent
            plotSpec.tracks[trackIndex].y.axis = 'right'
            plotSpec.tracks[trackIndex].x.field = document.getElementById('columnSelectorX_0').options[currentCanvasState.view_control_settings.x_axis].textContent
            currentCanvasState.view_control_settings.checked_right = Array.from(rightChecked).map(checkbox => checkbox.id);
        });    
        updateURLParameters("columnSelectorX_0", currentCanvasState.view_control_settings.x_axis);
        updateURLParameters("columnSelectorYLeft", currentCanvasState.view_control_settings.left_y_axis);
        updateURLParameters("columnSelectorYRight", currentCanvasState.view_control_settings.right_y_axis);
        updateURLParameters("xDomain.interval", currentCanvasState.view_control_settings.x_range);
        updateURLParameters("yDomain.left", currentCanvasState.view_control_settings.left_y_range);
        updateURLParameters("yDomain.right", currentCanvasState.view_control_settings.right_y_range);

        await GoslingPlotWithLocalData();
    });
}
/**
 * To generate a new view with a paraemter currentview that works as an ID. 
 * @param {int} currentView 
 * @returns 
 */
export function generateViewControl(currentView){
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