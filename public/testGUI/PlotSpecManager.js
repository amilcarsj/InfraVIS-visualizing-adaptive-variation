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
    // Initialize with a default assembly info
    this.assemblyInfo = [["", 0]];
    
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

  updateAssemblyInfo(seqid, length) {
    if (seqid && length) {
      this.assemblyInfo = [[seqid, length]];
      
      // Update existing plot specs with new assembly info
      if (this.plotSpecs[1].views && this.plotSpecs[1].views.length > 0) {
        this.plotSpecs[1].views[0].assembly = this.assemblyInfo;
      }

      // Store in local storage for persistence
      try {
        localStorage.setItem('gosling-assembly-info', JSON.stringify(this.assemblyInfo));
      } catch (e) {
        console.warn('Failed to store assembly info in localStorage:', e);
      }
    }
  }

  createNewPlotSpec() {
    // Try to load saved assembly info from localStorage
    try {
      const savedAssembly = localStorage.getItem('gosling-assembly-info');
      if (savedAssembly) {
        this.assemblyInfo = JSON.parse(savedAssembly);
      }
    } catch (e) {
      console.warn('Failed to load assembly info from localStorage:', e);
    }

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
            assembly: this.assemblyInfo, // Will always have a value now
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