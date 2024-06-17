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
      1: null,
      2: null,
      3: null,
    };
  }

  getPlotSpec(canvasNum) {
    if (!this.plotSpecs[canvasNum]) {
      this.plotSpecs[canvasNum] = this.createNewPlotSpec();
    }
    return this.plotSpecs[canvasNum];
  }

  createNewPlotSpec() {
    return {
      title: "",
      static: false,
      xDomain: { interval: [0, 200000] },
      alignment: "overlay",
      width: 900,
      height: 200,
      assembly: "unknown",
      style: {
        background: "#D3D3D3",
        backgroundOpacity: 0.1,
      },
      tracks: [this.createTrack(), this.createTrack(), this.createTrack(), this.createTrack(), this.createTrack()],
    };
  }

  createTrack() {
    return deepCopy(trackTemplate);
  }

  updatePlotSpec(canvasNum, newPlotSpec) {
    this.plotSpecs[canvasNum] = newPlotSpec;
  }

  resetInstance(canvasNum) {
    this.plotSpecs[canvasNum] = null;
  }
}

window.plotSpecManager = new PlotSpecManager();

export { PlotSpecManager };