import { trackTemplate } from './track_spec.js';
import { gene_template } from './gene_spec.js';

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
    this.plotSpecs = {}; // Store plotSpecs per canvas number
  }

  getPlotSpec(canvasNum) {
    if (!this.plotSpecs[canvasNum]) {
      this.createNewPlotSpec(canvasNum);
    }
    return this.plotSpecs[canvasNum];
  }

  getPlotSpecViewById(canvasNum, viewId) {
    const plotSpec = this.getPlotSpec(canvasNum);
    if (plotSpec) {
      return plotSpec.views.find(view => view.id === viewId);
    }
    return null;
  }

  createNewPlotSpec(canvasNum) {
    let newPlotSpec;
    if (canvasNum === 0) {
      newPlotSpec = {
        views: [
          {
            id: `canvas${canvasNum}`,
            title: "Gene",
            static: false,
            xDomain: { interval: [69651, 437352] },
            alignment: "overlay",
            width: 900,
            height: 150,
            assembly: [["seq_s_6130", 4641652]], // Updated to match gene_spec.js
            linkingId: "detail",
            style: {
              background: "#D3D3D3",
              backgroundOpacity: 0.1,
            },
            tracks: [
              this.createGeneTrack(0),
              this.createGeneTrack(1),
              this.createGeneTrack(2),
              this.createGeneTrack(3),
              this.createGeneTrack(4),
            ]
          }
        ]
      };
    } else {
      newPlotSpec = {
        views: [
          {
            id: `canvas${canvasNum}`,
            title: `canvas${canvasNum}`,
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
    this.plotSpecs[canvasNum] = newPlotSpec;
    return newPlotSpec;
  }

  createTrack() {
    return deepCopy(trackTemplate);
  }

  /**
   * Creates a gene track by copying a specific track from gene_template
   * @param {number} index - Index of the track to copy
   * @returns {Object} - A single track object
   */
  createGeneTrack(index) {
    if (gene_template.views && gene_template.views[0] && gene_template.views[0].tracks && gene_template.views[0].tracks[index]) {
      const track = deepCopy(gene_template.views[0].tracks[index]);
      
      // Ensure data configuration is correct
      if (!track.data) {
        track.data = {
          type: "gff",
          url: "",
          indexUrl: "",
          attributesToFields: [
            { attribute: "gene_biotype", defaultValue: "unknown" },
            { attribute: "Name", defaultValue: "unknown" },
            { attribute: "ID", defaultValue: "unknown" } // Added ID attribute
          ]
        };
      }
      // Update tooltip configuration
      track.tooltip = [
        { field: "seqid", type: "nominal", alt: "Chromosome" },
        { field: "start", type: "quantitative", alt: "Start" },
        { field: "end", type: "quantitative", alt: "End" },
        { field: "strand", type: "nominal", alt: "Strand" },
        { field: "type", type: "nominal", alt: "Feature Type" },
        { field: "gene_biotype", type: "nominal", alt: "Gene Biotype" },
        { field: "Name", type: "nominal", alt: "Gene Name" },
        { field: "ID", type: "nominal", alt: "Gene ID" }
      ];
      
      return track;
    } else {
      console.error(`Track index ${index} does not exist in gene_template.`);
      return {};
    }
  }

  generateCanvas(canvasNum, canvasId, newCanvasObject) {
    let plotSpec = this.getPlotSpec(canvasNum);
  
    if (!plotSpec) {
      plotSpec = this.createNewPlotSpec(canvasNum);
    }
  
    const existingViewIndex = plotSpec.views.findIndex(view => view.id === canvasId);
  
    if (existingViewIndex !== -1) {
      // Update the tracks array if needed
      plotSpec.views[existingViewIndex].tracks = newCanvasObject.tracks;
      plotSpec.views[existingViewIndex] = { ...plotSpec.views[existingViewIndex], ...newCanvasObject };
    } else {
      plotSpec.views.push(newCanvasObject);
    }
  }

  resetInstance(canvasNum) {
    this.plotSpecs[canvasNum] = this.createNewPlotSpec(canvasNum);
  }
}

PlotSpecManager.prototype.exportPlotSpecAsJSON = function (canvasNum) {
  const plotSpec = this.getPlotSpec(canvasNum);
  const jsonString = JSON.stringify(plotSpec, null, 2);
  return jsonString;
};

export { PlotSpecManager };