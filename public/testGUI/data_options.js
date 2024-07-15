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
                <button id="export-json-button">Export as JSON</button>
                <button id="export-svg-button">Export as SVG</button>    
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
            <div id='canvas-container-1' class='canvas-container'>
                <div id='canvas-bar-1' class='canvas_bar'>
                    <h3 class = 'view-control'>View Controls 1</h3>
                </div>
                <div class="canvas_content hidden">
                    <div class="btn-row" id="global-variables">
                        <h2>X axis</h2>
                            <div class="column-container">
                                <div class='x-axis-select'>
                                    <label for="columnSelectorX_0">X-axis: </label>
                                    <select name="xcolumn" id="columnSelectorX_0" class="columnSelectorX" data-track="0">
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

    document.getElementById('export-svg-button').addEventListener('click', () => {


    document.getElementById('export-json-button').addEventListener('click', () => {
        const jsonSpec = window.plotSpecManager.exportPlotSpecAsJSON();
        const blob = new Blob([jsonSpec], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'plotSpec.json';
        a.click();
        URL.revokeObjectURL(url);
    });


        const container = document.getElementById('plot-container-1');
    
        if (!container) {
            console.error('Plot container element not found');
            return;
        }
    
        const svgElements = container.getElementsByTagName('svg');
    
        if (svgElements.length === 0) {
            console.error('No SVG elements found in the plot container');
            return;
        }
    
        const svgContent = container.innerHTML;
        const jsonSpec = window.plotSpecManager.exportPlotSpecAsJSON();
    
        // Embed the SVG content into a full HTML document
        const htmlContent = `
            <!DOCTYPE html>
            <html>
                <head>
                    <title>Exported Plot</title>
                    <script type="importmap">
                        {
                           "imports": {
                                "react": "https://esm.sh/react@18",
                                "react-dom": "https://esm.sh/react-dom@18",
                                "pixi": "https://esm.sh/pixi.js@6",
                                "higlass": "https://esm.sh/higlass@^1.13.4?external=react,react-dom,pixi",
                                "gosling.js": "https://esm.sh/gosling.js@0.17.0?external=react,react-dom,pixi,higlass"
                                }
                        }
                    </script>
<style>
._context-menu_18ock_1{position:fixed;background-color:#fffffff2;border:1px solid rgba(0,0,0,.1);border-radius:3px;font-size:12px;cursor:default;padding:3px;box-shadow:0 0 3px #0000001a,0 1px 5px #0000000d}._context-menu-dark_18ock_12{color:#ccc;background-color:#444444f7}._context-menu-icon_18ock_17{display:inline-block;margin-right:3px;vertical-align:middle}._context-menu-icon_18ock_17>svg{width:30px;height:20px}._context-menu-item_18ock_27{padding:2px;white-space:nowrap;border-radius:2px;transition:background .15s cubic-bezier(.25,.1,.25,1),color .15s cubic-bezier(.25,.1,.25,1)}._context-menu-item_18ock_27:hover{background:#337ab7;color:#fff}._context-menu-hr_18ock_38{margin-top:5px;margin-bottom:5px;border:0;border-top:1px solid rgba(0,0,0,.1)}._play-icon_18ock_45{width:12px;height:12px;position:absolute;right:5px}._context-menu-span_18ock_52{margin-right:20px;vertical-align:middle;display:inline-block;line-height:normal;white-space:nowrap}._context-menu-thumbnail_18ock_60{margin-right:10px;border:1px solid #888888}._context-menu-thumbnail-inline_18ock_65{display:inline-block;margin-right:10px;vertical-align:middle}._multitrack-header_1yz7l_1,._multitrack-header-focus_1yz7l_2,._multitrack-header-squeazed_1yz7l_3{position:relative;display:flex;justify-content:space-between;height:24px;margin-top:4px;margin-bottom:4px;color:#999;font-size:12px;line-height:24px;vertical-align:middle;border:0;border-radius:3px;background:#e5e5e5;transition:height .15s cubic-bezier(.25,.1,.25,1),margin .15s cubic-bezier(.25,.1,.25,1)}._multitrack-header-dark_1yz7l_20{background:#222}._multitrack-header-focus_1yz7l_2{height:32px;margin-top:0;margin-bottom:0}._multitrack-header-id_1yz7l_30{padding-left:3px}._multitrack-header-id_1yz7l_30:before{content:"ID:";font-weight:700;padding-right:5px}._multitrack-header-left_1yz7l_39{display:flex;flex-grow:1}._multitrack-header-grabber_1yz7l_44,._multitrack-header-grabber-squeazed_1yz7l_45{display:flex;align-items:center;justify-content:center;width:24px;height:100%;cursor:move;border-radius:3px 0 0 3px;transition:background .15s cubic-bezier(.25,.1,.25,1)}._multitrack-header-grabber_1yz7l_44:hover,._multitrack-header-grabber-squeazed_1yz7l_45:hover{background:#999}._multitrack-header-grabber_1yz7l_44:hover div,._multitrack-header-grabber-squeazed_1yz7l_45:hover div{background:#fff}._multitrack-header-grabber_1yz7l_44 div,._multitrack-header-grabber-squeazed_1yz7l_45 div{width:1px;height:50%;margin:1px;background:#999;transition:background .15s cubic-bezier(.25,.1,.25,1)}._multitrack-header-dark_1yz7l_20 ._multitrack-header-grabber_1yz7l_44 div{background:#666}._multitrack-header-grabber-squeazed_1yz7l_45{width:19.2px}._multitrack-header-search_1yz7l_80{position:relative;flex-grow:1;height:100%;margin-right:12px}._multitrack-header-search_1yz7l_80:after{position:absolute;top:3px;bottom:3px;right:-12px;display:block;content:"";width:1px;margin:0 6px;background:#cccccc}._multitrack-header-dark_1yz7l_20 ._multitrack-header-search_1yz7l_80:after{background:#666}._multitrack-header-nav-list_1yz7l_102,._multitrack-header_1yz7l_1>nav{display:flex}._multitrack-header-icon_1yz7l_107,._multitrack-header-icon-squeazed_1yz7l_108{width:24px;height:100%;padding:6px;transition:background .15s cubic-bezier(.25,.1,.25,1),color .15s cubic-bezier(.25,.1,.25,1)}._multitrack-header-icon_1yz7l_107 g,._multitrack-header-icon-squeazed_1yz7l_108 g{stroke:#999}._multitrack-header-icon_1yz7l_107:hover,._multitrack-header-icon_1yz7l_107:active,._multitrack-header-icon_1yz7l_107:focus,._multitrack-header-icon-squeazed_1yz7l_108:hover,._multitrack-header-icon-squeazed_1yz7l_108:active,._multitrack-header-icon-squeazed_1yz7l_108:focus{color:#fff;background:#337ab7}._multitrack-header-icon_1yz7l_107:hover g,._multitrack-header-icon_1yz7l_107:active g,._multitrack-header-icon_1yz7l_107:focus g,._multitrack-header-icon-squeazed_1yz7l_108:hover g,._multitrack-header-icon-squeazed_1yz7l_108:active g,._multitrack-header-icon-squeazed_1yz7l_108:focus g{stroke:#fff}._multitrack-header-icon_1yz7l_107:last-child,._multitrack-header-icon-squeazed_1yz7l_108:last-child{border-radius:0 3px 3px 0}._mouse-tool-selection_1yz7l_136{color:#fff;border-radius:3px 0 0 3px;background:#337ab7}._multitrack-header-icon-squeazed_1yz7l_108{width:20px 5;padding-left:3px;padding-right:3px}._track-control_w7hx2_1,._track-control-vertical_w7hx2_2{position:absolute;z-index:1;display:flex;background:rgba(255,255,255,.75);right:2px;top:2px;border-radius:2.5px;box-shadow:0 0 0 1px #0000000d,0 0 3px #0000001a;opacity:0;transition:opacity .15s cubic-bezier(.25,.1,.25,1),background .15s cubic-bezier(.25,.1,.25,1),box-shadow .15s cubic-bezier(.25,.1,.25,1)}._track-control-dark_w7hx2_15,._track-control-dark_w7hx2_15 ._track-control-active_w7hx2_16{background:rgba(40,40,40,.85)}._track-control-vertical_w7hx2_2{flex-direction:column-reverse}._track-control-left_w7hx2_24{left:2px;right:auto}._track-control-active_w7hx2_16,._track-control-vertical-active_w7hx2_30{opacity:1;z-index:1}._track-control-active_w7hx2_16:hover,._track-control-vertical-active_w7hx2_30:hover{background:rgb(255,255,255);box-shadow:0 0 0 1px #0000001a,0 0 3px #0003}._track-control-dark_w7hx2_15._track-control-active_w7hx2_16:hover{background:rgba(34,34,34,.95)}._track-control-padding-right_w7hx2_48{right:80px}._track-control-button_w7hx2_52{width:20px;height:20px;padding:4px;cursor:pointer;opacity:.66;transition:background .15s cubic-bezier(.25,.1,.25,1),color .15s cubic-bezier(.25,.1,.25,1),opacity .15s cubic-bezier(.25,.1,.25,1)}._track-control-button_w7hx2_52:hover{color:#fff;background:#337ab7;opacity:1}._track-control-button_w7hx2_52:first-child{border-radius:2.5px 0 0 2.5px}._track-control-button_w7hx2_52:last-child{border-radius:0 2.5px 2.5px 0}._track-control-dark_w7hx2_15 ._track-control-button_w7hx2_52{color:#ccc}._track-control-dark_w7hx2_15 ._track-control-button_w7hx2_52:hover{color:#fff;background:#337ab7;opacity:1}._track-control-button-vertical_w7hx2_81:first-child{border-radius:0 0 2.5px 2.5px}._track-control-button-vertical_w7hx2_81:last-child{border-radius:2.5px 2.5px 0 0}._center-track_fiu64_1{position:relative;background:transparent}._center-track-container_fiu64_6{position:absolute;z-index:1}._track-range-selection_5bcsr_1{position:absolute;z-index:-1;opacity:0;transition:opacity .15s cubic-bezier(.25,.1,.25,1)}._track-range-selection-active_5bcsr_8{z-index:1;opacity:1}._track-range-selection-group-inactive_5bcsr_22{display:none}._track-range-selection-group-brush-selection_5bcsr_26{outline:2px solid rgba(0,0,0,.33);fill:#000;fill-opacity:.1}._drag-listening-div-active_19gkt_1{z-index:10;box-shadow:inset 0 0 3px red}._gallery-tracks_fbxxi_1{position:relative;top:0;left:0;width:100%;height:100%}._gallery-track_fbxxi_1{position:absolute;box-sizing:border-box;top:0;right:0;bottom:0;left:0}._gallery-sub-track_fbxxi_18,._gallery-invisible-track_fbxxi_19{position:absolute}._tiled-plot_1y7td_1{position:relative;flex:1;overflow:hidden}._horizontalList_1y7td_7{display:flex;width:600px;height:300px;white-space:nowrap}._list_1y7td_14{width:400px;height:600px;overflow:hidden;-webkit-overflow-scrolling:touch}._stylizedList_1y7td_21{position:relative;z-index:0;background-color:#f3f3f3;outline:none}._stylizedItem_1y7td_28{position:relative;display:flex;align-items:center;width:100%;background-color:transparent;-webkit-user-select:none;user-select:none;color:#333;font-weight:400}._stylizedHelper_1y7td_39{box-shadow:0 5px 5px -5px #0003,0 -5px 5px -5px #0003;background-color:#fffc;cursor:row-resize}._stylizedHelper_1y7td_39._horizontalItem_1y7td_44{cursor:col-resize}._horizontalItem_1y7td_44{display:flex;flex-shrink:0;align-items:center;justify-content:center}._resizable-track_1y7td_55{width:100%;height:100%}path._domain_1y7td_60{stroke-width:0px}._top-right-handle_cizw2_1,._bottom-right-handle_cizw2_2{border-right:black solid;border-top:black solid}._top-left-handle_cizw2_7,._bottom-left-handle_cizw2_8{border-left:black solid;border-top:black solid}._top-draggable-handle_cizw2_13,._bottom-draggable-handle_cizw2_14,._left-draggable-handle_cizw2_15,._right-draggable-handle_cizw2_16{position:absolute;opacity:0;transition:transform .15s cubic-bezier(.25,.1,.25,1),opacity .15s cubic-bezier(.25,.1,.25,1)}._draggable-div_cizw2_22{background-color:transparent;box-sizing:border-box}._top-draggable-handle-grabber_cizw2_27,._bottom-draggable-handle-grabber_cizw2_28{width:10px;height:4px;border-top:1px solid black;border-bottom:1px solid black}._top-draggable-handle-grabber_cizw2_27,._bottom-draggable-handle-grabber_cizw2_28{margin:4px 7px}._left-draggable-handle-grabber_cizw2_43,._right-draggable-handle-grabber_cizw2_44{width:4px;height:10px;border-left:1px solid black;border-right:1px solid black}._left-draggable-handle-grabber_cizw2_43,._right-draggable-handle-grabber_cizw2_44{margin:7px 4px}._draggable-div_cizw2_22:hover ._top-draggable-handle_cizw2_13,._draggable-div_cizw2_22:hover ._bottom-draggable-handle_cizw2_14,._draggable-div_cizw2_22:hover ._left-draggable-handle_cizw2_15,._draggable-div_cizw2_22:hover ._right-draggable-handle_cizw2_16{opacity:.5;background:rgba(255,255,255,.75);box-shadow:0 0 3px 1px #ffffffbf;border-radius:3px}._top-draggable-handle_cizw2_13:hover,._top-draggable-handle_cizw2_13:active,._bottom-draggable-handle_cizw2_14:hover,._bottom-draggable-handle_cizw2_14:active,._left-draggable-handle_cizw2_15:hover,._left-draggable-handle_cizw2_15:active,._right-draggable-handle_cizw2_16:hover,._right-draggable-handle_cizw2_16:active{opacity:1!important;transform:scale(2)}._top-draggable-handle_cizw2_13:hover ._top-draggable-handle-grabber_cizw2_27,._top-draggable-handle_cizw2_13:hover ._bottom-draggable-handle-grabber_cizw2_28,._top-draggable-handle_cizw2_13:hover ._left-draggable-handle-grabber_cizw2_43,._top-draggable-handle_cizw2_13:hover ._right-draggable-handle-grabber_cizw2_44,._top-draggable-handle_cizw2_13:active ._top-draggable-handle-grabber_cizw2_27,._top-draggable-handle_cizw2_13:active ._bottom-draggable-handle-grabber_cizw2_28,._top-draggable-handle_cizw2_13:active ._left-draggable-handle-grabber_cizw2_43,._top-draggable-handle_cizw2_13:active ._right-draggable-handle-grabber_cizw2_44,._bottom-draggable-handle_cizw2_14:hover ._top-draggable-handle-grabber_cizw2_27,._bottom-draggable-handle_cizw2_14:hover ._bottom-draggable-handle-grabber_cizw2_28,._bottom-draggable-handle_cizw2_14:hover ._left-draggable-handle-grabber_cizw2_43,._bottom-draggable-handle_cizw2_14:hover ._right-draggable-handle-grabber_cizw2_44,._bottom-draggable-handle_cizw2_14:active ._top-draggable-handle-grabber_cizw2_27,._bottom-draggable-handle_cizw2_14:active ._bottom-draggable-handle-grabber_cizw2_28,._bottom-draggable-handle_cizw2_14:active ._left-draggable-handle-grabber_cizw2_43,._bottom-draggable-handle_cizw2_14:active ._right-draggable-handle-grabber_cizw2_44,._left-draggable-handle_cizw2_15:hover ._top-draggable-handle-grabber_cizw2_27,._left-draggable-handle_cizw2_15:hover ._bottom-draggable-handle-grabber_cizw2_28,._left-draggable-handle_cizw2_15:hover ._left-draggable-handle-grabber_cizw2_43,._left-draggable-handle_cizw2_15:hover ._right-draggable-handle-grabber_cizw2_44,._left-draggable-handle_cizw2_15:active ._top-draggable-handle-grabber_cizw2_27,._left-draggable-handle_cizw2_15:active ._bottom-draggable-handle-grabber_cizw2_28,._left-draggable-handle_cizw2_15:active ._left-draggable-handle-grabber_cizw2_43,._left-draggable-handle_cizw2_15:active ._right-draggable-handle-grabber_cizw2_44,._right-draggable-handle_cizw2_16:hover ._top-draggable-handle-grabber_cizw2_27,._right-draggable-handle_cizw2_16:hover ._bottom-draggable-handle-grabber_cizw2_28,._right-draggable-handle_cizw2_16:hover ._left-draggable-handle-grabber_cizw2_43,._right-draggable-handle_cizw2_16:hover ._right-draggable-handle-grabber_cizw2_44,._right-draggable-handle_cizw2_16:active ._top-draggable-handle-grabber_cizw2_27,._right-draggable-handle_cizw2_16:active ._bottom-draggable-handle-grabber_cizw2_28,._right-draggable-handle_cizw2_16:active ._left-draggable-handle-grabber_cizw2_43,._right-draggable-handle_cizw2_16:active ._right-draggable-handle-grabber_cizw2_44{box-shadow:0 0 3px 1px #0089ff;background:#0089ff}._top-draggable-handle_cizw2_13,._bottom-draggable-handle_cizw2_14{height:12px;cursor:row-resize}._left-draggable-handle_cizw2_15,._right-draggable-handle_cizw2_16{width:12px;cursor:col-resize}._horizontal-tiled-plot_1bqkg_1{position:relative}._button_1wnjn_1{display:flex;align-items:center;box-sizing:border-box;padding:.5em;color:#000;font-size:1em;line-height:1em;border:0;border-radius:2.5px;background:#fff;box-shadow:0 0 0 1px #ccc;transition:transform .15s cubic-bezier(.25,.1,.25,1),box-shadow .15s cubic-bezier(.25,.1,.25,1),background .15s cubic-bezier(.25,.1,.25,1);-webkit-appearance:none}._button_1wnjn_1:hover{background:#f2f2f2;box-shadow:0 0 0 1px #ccc}._button_1wnjn_1:focus{box-shadow:0 0 0 2px #0089ff}._button_1wnjn_1:active{transform:scale(.9)}._button_1wnjn_1:hover,._button_1wnjn_1:focus,._button_1wnjn_1:active{cursor:pointer;outline:none}._button-shortcut_1wnjn_35{padding:.1em 5px;color:#999;font-size:.8em;transition:color .15s cubic-bezier(.25,.1,.25,1)}._cross_2ke8w_1{position:relative;width:1em;height:1em}._cross_2ke8w_1:before,._cross_2ke8w_1:after{content:"";display:block;position:absolute;top:50%;left:0;width:1em;height:1px;background:black;transform-origin:center}._cross_2ke8w_1:before{-webkit-transform:translate(0,-50%) rotate(45deg);-moz-transform:translate(0,-50%) rotate(45deg);transform:translateY(-50%) rotate(45deg)}._cross_2ke8w_1:after{-webkit-transform:translate(0,-50%) rotate(-45deg);-moz-transform:translate(0,-50%) rotate(-45deg);transform:translateY(-50%) rotate(-45deg)}._modal-background_zzhoe_1{position:absolute;z-index:1000;top:0;right:0;bottom:0;left:0;background:rgba(0,0,0,.666);animation:_fade-in_zzhoe_1 .2s cubic-bezier(.25,.1,.25,1) 1;transition:opacity .2s cubic-bezier(.25,.1,.25,1)}._modal-hide_zzhoe_13{opacity:0}._modal-wrap_zzhoe_17{position:absolute;top:20px;right:20px;bottom:20px;left:20px}._modal-window_zzhoe_25{position:relative;width:100%;max-width:640px;max-height:100%;margin-left:auto;margin-right:auto;color:#000;border-radius:5px;background:#fff;animation:_fade-scale-in_zzhoe_1 .2s cubic-bezier(.25,.1,.25,1) 1}._modal-window-max-height_zzhoe_38{height:100%}._modal-content_zzhoe_42{padding:10px}@keyframes _fade-in_zzhoe_1{0%{opacity:0}to{opacity:1}}@keyframes _fade-scale-in_zzhoe_1{0%{opacity:0;transform:scale(.5)}to{opacity:1;transform:scale(1)}}._dialog-header_wp50s_1{position:relative;z-index:2;display:flex;justify-content:space-between;margin:0 -10px 10px;padding:0 10px 10px;border-bottom:1px solid #cccccc}._dialog-header_wp50s_1 h3{margin:0;padding:0;font-size:20px;line-height:1em}._dialog-header_wp50s_1 button{font-size:10px}._dialog-main-max-height_wp50s_20{position:absolute;z-index:1;top:40px;right:0;bottom:50px;left:0;padding:10px;overflow:auto}._dialog-footer_wp50s_31,._dialog-footer-max-height_wp50s_31{display:flex;justify-content:space-between;margin:10px -10px 0;padding:10px 10px 0;border-top:1px solid #cccccc}._dialog-footer_wp50s_31 button,._dialog-footer-max-height_wp50s_31 button{font-size:14px}._dialog-footer-max-height_wp50s_31{position:absolute;z-index:2;left:10px;right:10px;bottom:10px}table.table-track-options{border-collapse:collapse;margin-left:auto;margin-right:auto}td.td-track-options{border:1px solid #fff;outline:none;padding:3px;position:relative;font-family:Roboto,sans-serif;font-size:14px;color:#666}.cell-label{position:absolute;left:0;top:0;margin-left:5px;color:#777}.modal-dialog{position:relative;display:table;overflow-y:auto;overflow-x:auto;width:auto;min-width:300px;margin:auto}._track-renderer_11dwb_1{position:relative}._track-renderer-element_11dwb_5,._track-renderer-events_11dwb_6{position:absolute;top:0;right:0;bottom:0;left:0;z-index:-1}._track-renderer-events_11dwb_6{z-index:1}.tileset-finder-label{font-weight:700}.tileset-finder-search-box{margin-left:10px}.tileset-finder-search-bar{display:flex;margin-left:5px;justify-content:space-between;align-items:center}.tileset-finder-checkbox-tree{margin:5px;padding:3px;border:1px solid #aaaaaa;border-radius:5px}.react-checkbox-tree{display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-orient:horizontal;-webkit-box-direction:reverse;-ms-flex-direction:row-reverse;flex-direction:row-reverse;font-size:16px}.react-checkbox-tree>ol{-webkit-box-flex:1;-ms-flex:1 1 auto;flex:1 1 auto}.react-checkbox-tree ol{margin:0;padding-left:0;list-style-type:none}.react-checkbox-tree ol ol{padding-left:24px}.react-checkbox-tree button{line-height:normal;color:inherit}.react-checkbox-tree button:disabled{cursor:not-allowed}.react-checkbox-tree .rct-bare-label{cursor:default}.react-checkbox-tree label{margin-bottom:0;cursor:pointer}.react-checkbox-tree label:hover{background:rgba(51,51,204,.1)}.react-checkbox-tree label:active,.react-checkbox-tree label:focus{background:rgba(51,51,204,.15)}.react-checkbox-tree:not(.rct-native-display) input{display:none}.react-checkbox-tree.rct-native-display input{margin:0 5px}.react-checkbox-tree .rct-icon{display:inline-block;text-align:center;text-rendering:auto;font-family:"Font Awesome 5 Free",FontAwesome,sans-serif;font-weight:400;font-variant:normal;font-style:normal}.rct-disabled>.rct-text>label{opacity:.75;cursor:not-allowed}.rct-disabled>.rct-text>label:hover{background:transparent}.rct-disabled>.rct-text>label:active{background:transparent}.rct-text{display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-ms-flex-align:center;align-items:center}.rct-options{-webkit-box-flex:0;-ms-flex:0 0 auto;flex:0 0 auto;margin-left:.5rem;text-align:right}.rct-option{opacity:.75;border:0;background:none;cursor:pointer;padding:0 4px;font-size:18px}.rct-option:hover{opacity:1}.rct-option+.rct-option{margin-left:2px}.rct-collapse,.rct-checkbox,.rct-node-icon{padding:0 5px}.rct-collapse *,.rct-checkbox *,.rct-node-icon *{display:inline-block;margin:0;width:14px}.rct-collapse{-ms-flex-item-align:stretch;align-self:stretch;border:0;background:none;line-height:normal;color:inherit;font-size:12px}.rct-collapse.rct-collapse-btn{cursor:pointer}.rct-collapse>.rct-icon-expand-close{opacity:.5}.rct-collapse>.rct-icon-expand-close:hover{opacity:1}.rct-native-display .rct-checkbox{display:none}.rct-node-clickable{cursor:pointer}.rct-node-clickable:hover{background:rgba(51,51,204,.1)}.rct-node-clickable:focus{outline:0;background:rgba(51,51,204,.2)}.rct-node-icon{color:#33c}.rct-title{padding:0 5px}.rct-icons-fa4 .rct-icon-expand-close:before{content:""}.rct-icons-fa4 .rct-icon-expand-open:before{content:""}.rct-icons-fa4 .rct-icon-uncheck:before{content:""}.rct-icons-fa4 .rct-icon-check:before{content:""}.rct-icons-fa4 .rct-icon-half-check:before{opacity:.5;content:""}.rct-icons-fa4 .rct-icon-leaf:before{content:""}.rct-icons-fa4 .rct-icon-parent-open:before{content:""}.rct-icons-fa4 .rct-icon-parent-close:before{content:""}.rct-icons-fa4 .rct-icon-expand-all:before{content:""}.rct-icons-fa4 .rct-icon-collapse-all:before{content:""}.rct-icons-fa5 .rct-icon-expand-close:before{font-weight:900;content:""}.rct-icons-fa5 .rct-icon-expand-open:before{font-weight:900;content:""}.rct-icons-fa5 .rct-icon-uncheck:before{content:""}.rct-icons-fa5 .rct-icon-check:before{content:""}.rct-icons-fa5 .rct-icon-half-check:before{opacity:.5;content:""}.rct-icons-fa5 .rct-icon-leaf:before{content:""}.rct-icons-fa5 .rct-icon-parent-open:before{content:""}.rct-icons-fa5 .rct-icon-parent-close:before{content:""}.rct-icons-fa5 .rct-icon-expand-all:before{content:""}.rct-icons-fa5 .rct-icon-collapse-all:before{content:""}.rct-direction-rtl{direction:rtl}.rct-direction-rtl ol ol{padding-right:24px;padding-left:0}.rct-direction-rtl.rct-icons-fa4 .rct-icon-expand-close:before{content:""}.rct-direction-rtl.rct-icons-fa5 .rct-icon-expand-close:before{content:""}.plot-type-selected{background-color:#0000ff4d}.plot-type-container{overflow-y:scroll;margin:5px;padding:3px;border:1px solid #aaaaaa;border-radius:5px;max-height:15vh}.plot-type-container-empty{margin:5px;padding:3px 8px;border:1px solid #aaaaaa;background-color:#e8e8e8;border-radius:5px}.plot-type-item{cursor:pointer}.plot-type-item:not(.plot-type-selected):hover{background-color:#3333cc1a}.track-thumbnail{width:30px;height:20px;display:inline-block;margin-right:10;vertical-align:middle}.track-thumbnail>svg{width:20px;height:20px}._collapse-toggle-icon_ub7s6_1:before{font-family:Glyphicons Halflings;content:"";float:left;padding-right:3px}._collapse-toggle-icon_ub7s6_1._collapsed_ub7s6_9:before{content:""}._modal-title_ub7s6_14{font-family:Roboto;font-weight:700}._modal-container_ub7s6_19{position:relative}._modal-container_ub7s6_19 ._modal_ub7s6_14,._modal-container_ub7s6_19 ._modal-backdrop_ub7s6_23{position:absolute}._modal-dialog_ub7s6_27{position:relative;display:table;overflow-y:auto;overflow-x:auto;width:600px;min-width:300px;margin:auto}._vertical-tiled-plot_f3ho8_1{position:relative}._genome-position-search_1l2sx_1,._genome-position-search-focus_1l2sx_2{position:relative;display:flex;align-items:stretch;height:100%;margin-bottom:0;font-size:13.7142857143px;transition:box-shadow .15s cubic-bezier(.25,.1,.25,1),font-size .15s cubic-bezier(.25,.1,.25,1)}._genome-position-search-focus_1l2sx_2{box-shadow:0 0 0 1px #337ab7,0 0 3px 1px #337ab7}._genome-position-search-bar_1l2sx_16{position:relative;box-sizing:border-box;width:100%;height:100%;padding:3px;color:#666;font-size:inherit;line-height:24px;border:0;border-radius:3px 0 0 3px;background:transparent}._genome-position-search-bar_1l2sx_16:focus{outline:none;color:#000}._genome-position-search-dark_1l2sx_34 ._genome-position-search-bar_1l2sx_16:focus{color:#e5e5e5}._genome-position-search-bar-button_1l2sx_38,._genome-position-search-bar-button-focus_1l2sx_39{display:block;height:100%;padding:0 8px!important;color:#999;border:0!important;border-radius:0!important;background:transparent;transition:background .15s cubic-bezier(.25,.1,.25,1),color .15s cubic-bezier(.25,.1,.25,1)}._genome-position-search-bar-button_1l2sx_38:active,._genome-position-search-bar-button_1l2sx_38:focus,._genome-position-search-bar-button_1l2sx_38:hover,._genome-position-search-bar-button-focus_1l2sx_39:active,._genome-position-search-bar-button-focus_1l2sx_39:focus,._genome-position-search-bar-button-focus_1l2sx_39:hover{color:#fff;background:#337ab7}._genome-position-search-bar-button-focus_1l2sx_39{color:#fff;background:#337ab7}._genome-position-search-bar-icon_1l2sx_62,._genome-position-search-bar-icon-focus_1l2sx_63{display:flex;align-items:center;transition:color .15s cubic-bezier(.25,.1,.25,1)}._genome-position-search-bar-icon_1l2sx_62:first-child,._genome-position-search-bar-icon-focus_1l2sx_63:first-child{margin-left:6px;margin-right:2px}._genome-position-search-bar-icon_1l2sx_62 span,._genome-position-search-bar-icon-focus_1l2sx_63 span{display:block;margin-top:-2px}._genome-position-search-bar-icon-focus_1l2sx_63{color:#337ab7}._genome-position-search-bar-suggestions_1l2sx_83{position:fixed;border-radius:3px;box-shadow:0 0 3px #0000001a,0 1px 5px #0000000d;background-color:#fffffff2;border:1px solid rgba(0,0,0,.1);padding:2px 0;font-size:90%;overflow:auto;max-height:50%}._btn_1l2sx_95{display:inline-block;margin-bottom:0;font-size:13.7142857143px;font-weight:400;line-height:1.42857143;text-align:center;white-space:nowrap;vertical-align:middle;-ms-touch-action:manipulation;touch-action:manipulation;cursor:pointer;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;background-image:none;border:1px solid transparent;border-radius:4px}._btn-sm_1l2sx_116{font-size:12px;line-height:1.5;border-radius:3px}._btn-default_1l2sx_122{color:#666;background-color:#fff;border-color:#ccc}._btn-default_1l2sx_122:hover{color:#000;background:#ccc}._btn-default_1l2sx_122:active,._btn-default_1l2sx_122:focus{color:#fff;border-color:#000;background:#000}._genome-position-search_1l2sx_1 ._btn_1l2sx_95{border-radius:0 3px 3px 0}._export-link-dialog-wrapper_p9gxw_1{display:flex}._export-link-dialog-wrapper_p9gxw_1 input{flex-grow:1}._add-track-position-table_wdy5w_1{border-collapse:collapse;margin:5px;color:#666}._add-track-position-table-dark_wdy5w_7{color:#ccc}._add-track-position-other_wdy5w_11{outline:none}._add-track-position-top-center_wdy5w_15{min-width:80px;min-height:20px;text-align:center;outline:none;border-top:1px solid #999;border-left:1px solid #999;border-right:1px solid #999;border-radius:2px 2px 0 0}._add-track-position-top-center_wdy5w_15:hover{color:#fff;background-color:#337ab7}._add-track-position-middle-left_wdy5w_30{min-width:40px;text-align:center;outline:none;border-top:1px solid #999;border-left:1px solid #999;border-bottom:1px solid #999;border-radius:2px 0 0 2px}._add-track-position-middle-left_wdy5w_30:hover{background-color:#337ab7;color:#fff}._add-track-position-middle-right_wdy5w_45{min-width:40px;text-align:center;outline:none;border-top:1px solid #999;border-right:1px solid #999;border-bottom:1px solid #999;border-radius:0 2px 2px 0}._add-track-position-middle-right_wdy5w_45:hover{background-color:#337ab7;color:#fff}._add-track-position-middle-middle_wdy5w_60{text-align:center;outline:none;border:1px solid #999}._add-track-position-middle-middle_wdy5w_60:hover{background-color:#337ab7;color:#fff}._add-track-position-bottom-middle_wdy5w_71{min-height:20px;text-align:center;outline:none;border-left:1px solid #999;border-right:1px solid #999;border-bottom:1px solid #999;border-radius:0 0 2px 2px}._add-track-position-bottom-middle_wdy5w_71:hover{background-color:#337ab7;color:#fff}._add-track-position-span_wdy5w_86{margin:5px}._view-config-editor-header_1hlm6_1{margin:-10px -10px 0;padding:10px;display:flex;justify-content:space-between;background:#f2f2f2}._view-config-editor-header_1hlm6_1 button{display:flex;align-items:center;font-size:14px;background:#f2f2f2}._view-config-editor-header_1hlm6_1 button:hover{background:#e5e5e5}._view-config-editor-header_1hlm6_1 button:hover span{color:#666}._view-config-editor_1hlm6_1{position:absolute;top:50px;right:0;bottom:0;left:0;margin:1px 0 0;padding:0;overflow:auto;font-size:12.5px;height:calc(100% - 80px)}._view-config-log_1hlm6_34{position:absolute;right:0;bottom:0;left:0;margin:1px 0 0;padding:0;min-height:30px;background:#f2f2f2;transition:height .15s cubic-bezier(.25,.1,.25,1)}._view-config-log-header_1hlm6_46{background:#f2f2f2;border-top:1px solid #cccccc;border-bottom:1px solid #cccccc;padding-left:10px;height:30px;display:flex;align-items:center;cursor:pointer;position:sticky;position:-webkit-sticky;top:0}._view-config-log-msg_1hlm6_60{background:#f2f2f2;overflow:auto;height:calc(100% - 30px)}._view-config-log-msg_1hlm6_60 tr,._view-config-log-msg_1hlm6_60 td{outline:none;vertical-align:top}._view-config-log-msg_1hlm6_60 ._title_1hlm6_70{font-weight:700;padding-left:8px;padding-top:8px;width:100px}._view-config-log-msg_1hlm6_60 ._Warning_1hlm6_76{color:orange}._view-config-log-msg_1hlm6_60 ._Success_1hlm6_79{color:green}._view-config-log-msg_1hlm6_60 ._Error_1hlm6_82{color:red}._view-config-log-msg_1hlm6_60 pre{background:white;white-space:pre-wrap;white-space:-moz-pre-wrap;white-space:-pre-wrap;white-space:-o-pre-wrap;word-wrap:break-word}._higlass_1uoq8_1{position:relative}._higlass-dark-theme_1uoq8_5{background:black}._higlass-container-overflow_1uoq8_9,._higlass-scroll-container-overflow_1uoq8_10,._higlass-scroll-container-scroll_1uoq8_11{position:absolute;top:0;right:0;bottom:0;left:0}._higlass-scroll-container-overflow_1uoq8_10{overflow:hidden}._higlass-scroll-container-scroll_1uoq8_11{overflow-x:hidden;overflow-y:auto}._higlass-canvas_1uoq8_28{position:absolute;width:100%;height:100%}._higlass-drawing-surface_1uoq8_34{position:relative}._higlass-svg_1uoq8_38{position:absolute;width:100%;height:100%;left:0;top:0;pointer-events:none}._tiled-area_1uoq8_47{display:flex;flex-direction:column}._track-mouseover-menu_1uoq8_52{position:fixed;z-index:1;margin:17px 0 0 9px;padding:0 .25rem;max-width:50vw;word-wrap:break-word;font-size:.8em;pointer-events:none;background:white;border-radius:.25rem;box-shadow:0 0 0 1px #0000001a,0 0 3px #00000013,0 0 7px #0000000d}.react-grid-layout{position:relative;transition:height .2s ease}.react-grid-item{transition:all .2s ease;transition-property:left,top}.react-grid-item.cssTransforms{transition-property:transform}.react-grid-item.resizing{z-index:1;will-change:width,height}.react-grid-item.react-draggable-dragging{transition:none;z-index:3;will-change:transform}.react-grid-item.react-grid-placeholder{background:red;opacity:.2;transition-duration:.1s;z-index:2;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;-o-user-select:none;user-select:none}.react-grid-item>.react-resizable-handle{position:absolute;width:20px;height:20px;bottom:0;right:0;cursor:se-resize}.react-grid-item>.react-resizable-handle:after{content:"";position:absolute;right:3px;bottom:3px;width:5px;height:5px;border-right:2px solid rgba(0,0,0,.4);border-bottom:2px solid rgba(0,0,0,.4)}.react-resizable{position:relative}.react-resizable-handle{position:absolute;width:20px;height:20px;background-repeat:no-repeat;background-origin:content-box;box-sizing:border-box;background-image:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2IDYiIHN0eWxlPSJiYWNrZ3JvdW5kLWNvbG9yOiNmZmZmZmYwMCIgeD0iMHB4IiB5PSIwcHgiIHdpZHRoPSI2cHgiIGhlaWdodD0iNnB4Ij48ZyBvcGFjaXR5PSIwLjMwMiI+PHBhdGggZD0iTSA2IDYgTCAwIDYgTCAwIDQuMiBMIDQgNC4yIEwgNC4yIDQuMiBMIDQuMiAwIEwgNiAwIEwgNiA2IEwgNiA2IFoiIGZpbGw9IiMwMDAwMDAiLz48L2c+PC9zdmc+);background-position:bottom right;padding:0 3px 3px 0}.react-resizable-handle-sw{bottom:0;left:0;cursor:sw-resize;transform:rotate(90deg)}.react-resizable-handle-se{bottom:0;right:0;cursor:se-resize}.react-resizable-handle-nw{top:0;left:0;cursor:nw-resize;transform:rotate(180deg)}.react-resizable-handle-ne{top:0;right:0;cursor:ne-resize;transform:rotate(270deg)}.react-resizable-handle-w,.react-resizable-handle-e{top:50%;margin-top:-10px;cursor:ew-resize}.react-resizable-handle-w{left:0;transform:rotate(135deg)}.react-resizable-handle-e{right:0;transform:rotate(315deg)}.react-resizable-handle-n,.react-resizable-handle-s{left:50%;margin-left:-10px;cursor:ns-resize}.react-resizable-handle-n{top:0;transform:rotate(225deg)}.react-resizable-handle-s{bottom:0;transform:rotate(45deg)}code[class*=language-],pre[class*=language-]{color:#393a34;font-family:Consolas,Bitstream Vera Sans Mono,Courier New,Courier,monospace;direction:ltr;text-align:left;white-space:pre;word-spacing:normal;word-break:normal;font-size:.95em;line-height:1.2em;-moz-tab-size:4;-o-tab-size:4;tab-size:4;-webkit-hyphens:none;-moz-hyphens:none;-ms-hyphens:none;hyphens:none}pre[class*=language-]::-moz-selection,pre[class*=language-] ::-moz-selection,code[class*=language-]::-moz-selection,code[class*=language-] ::-moz-selection{background:#b3d4fc}pre[class*=language-]::selection,pre[class*=language-] ::selection,code[class*=language-]::selection,code[class*=language-] ::selection{background:#b3d4fc}pre[class*=language-]{padding:1em;margin:.5em 0;overflow:auto;border:1px solid #dddddd;background-color:#fff}:not(pre)>code[class*=language-]{padding:1px .2em;background:#f8f8f8;border:1px solid #dddddd}.token.comment,.token.prolog,.token.doctype,.token.cdata{color:#998;font-style:italic}.token.namespace{opacity:.7}.token.string,.token.attr-value{color:#e3116c}.token.punctuation,.token.operator{color:#393a34}.token.entity,.token.url,.token.symbol,.token.number,.token.boolean,.token.variable,.token.constant,.token.property,.token.regex,.token.inserted{color:#36acaa}.token.atrule,.token.keyword,.token.attr-name,.language-autohotkey .token.selector{color:#00a4db}.token.function,.token.deleted,.language-autohotkey .token.tag{color:#9a050f}.token.tag,.token.selector,.language-autohotkey .token.keyword{color:#00009f}.token.important,.token.function,.token.bold{font-weight:700}.token.italic{font-style:italic}.higlass *{box-sizing:border-box}.higlass .react-resizable-handle{z-index:1}
</style>
                </head>
                <body>
                <div id="gosling-container">
                    ${svgContent}
                </div>
                    <script type="module">
                        import { embed } from 'gosling.js';
                        embed(document.getElementById('gosling-container'), ${jsonSpec});
                    </script>
                </body>
                
            </html>
        `;
    
        // Create a Blob from the HTML data
        const htmlBlob = new Blob([htmlContent], { type: 'text/html' });
        const htmlUrl = URL.createObjectURL(htmlBlob);
    
        // Create a link element and trigger the download
        const a = document.createElement('a');
        a.href = htmlUrl;
        a.download = 'plot-container.html';
        a.click();
    
        // Revoke the object URL after the download
        URL.revokeObjectURL(htmlUrl);
    });
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
                canvasContent.classList.toggle('hidden');
            }
        });
    }

    // Add event listener to the clear all settings button
    const clearAllSettingsButton = document.querySelector('#clear_url_button');
    if (clearAllSettingsButton) {
        clearAllSettingsButton.addEventListener('click', () => {
            updateURLParameters("xDomain.interval", [0, 200000]);
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

}

// Ensure the Add Track button triggers the track count update
window.onload = function () {
    document.getElementById('add_track_button').addEventListener('click', updateTrackNumber);
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
                </div>
            </div>
        </div>
    </div>`;
}



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
    
    document.getElementById('export-json-button').addEventListener('click', () => {
        const jsonSpec = window.plotSpecManager.exportPlotSpecAsJSON();
        const blob = new Blob([jsonSpec], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'plotSpec.json';
        a.click();
        URL.revokeObjectURL(url);
    });

    document.querySelectorAll('.mark').forEach(function (markSelector) {
        markSelector.addEventListener('change', async function () {
            const trackValue = this.getAttribute('data-track');
            const chosenMark = this.value;
            const plotSpec = getCurrentViewSpec();
            plotSpec.tracks[trackValue].mark = chosenMark;
            // await GoslingPlotWithLocalData();
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

    document.querySelector('.apply-all-button').addEventListener('click', async function () {
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
        const y_interval_right = [y_start_right, y_end_right];
        

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
}