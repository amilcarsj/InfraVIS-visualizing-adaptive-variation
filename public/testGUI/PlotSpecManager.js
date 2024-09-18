import { trackTemplate } from './track_spec.js';

function deepCopy(obj) {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(deepCopy);
  }

  const copied = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      copied[key] = deepCopy(obj[key]);
    }
  }

  return copied;
}

class PlotSpecManager {
  constructor() {
    this.plotSpecs = {
      1: this.createNewPlotSpec(),
    };
  }

  getPlotSpec() {
    return this.plotSpecs[1];
  }

  getPlotSpecViewById(viewId) {
    const plotSpec = this.getPlotSpec();
    return plotSpec.views.find(view => view.id === viewId);
  }

  createNewPlotSpec() {
    if (window.canvas_num == 0) {
      return {
        views: [
          {
            id: "canvas0",
            title: "Gene",
            static: false,
            xDomain: { interval: [0, 200000] },
            alignment: "overlay",
            width: 900,
            height: 150,
            assembly: "unknown",
            linkingId: "detail",
            style: {
              background: "#D3D3D3",
              backgroundOpacity: 0.1,
            },
            tracks: [
              this.createTrack(),
              this.createTrack(),
              this.createTrack(),
              this.createTrack(),
              this.createTrack(),
            ]
          }
        ]
      };
    } else {
      return {
        views: [
          {
            id: "canvas1",
            title: "Canvas 1",
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
              this.createTrack(),
              this.createTrack(),
              this.createTrack(),
              this.createTrack(),
              this.createTrack(),
            ]
          }
        ]
      };
    }

  }

  createTrack() {
    return deepCopy(trackTemplate);
  }

  generateCanvas(canvasId, newCanvasObject) {
    const plotSpec = this.getPlotSpec();
    const existingViewIndex = plotSpec.views.findIndex(view => view.id === canvasId);

    if (existingViewIndex !== -1) {
      plotSpec.views[existingViewIndex] = newCanvasObject;
    } else {
      plotSpec.views.push(newCanvasObject);
    }
  }

  resetInstance() {
    this.plotSpecs[1] = this.createNewPlotSpec();
  }
}

PlotSpecManager.prototype.exportPlotSpecAsJSON = function() {
  const plotSpec = this.getPlotSpec();
  const jsonString = JSON.stringify(plotSpec, null, 2);
  return jsonString;
}
export { PlotSpecManager };