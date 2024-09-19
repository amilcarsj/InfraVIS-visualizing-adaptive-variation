const gene_template = {
  "spacing": 0,
  "layout": "linear",
  "assembly": [["seq_s_6130", 4641652]],
  "style": { "enableSmoothPath": true },
  "views": [
    {
      "id": "canvas0",
      "xDomain": { "chromosome": "seq_s_6130", "interval": [69651, 437352] },
      "alignment": "overlay",
      "data": {
        "url": "",
        "indexUrl": "",
        "type": "gff",
        "attributesToFields": [
          { "attribute": "gene_biotype", "defaultValue": "unknown" },
          { "attribute": "Name", "defaultValue": "unknown" }
        ]
      },
      "color": {
        "type": "nominal",
        "field": "gene_biotype",
        "domain": [
          "protein_coding",
          "tRNA",
          "rRNA",
          "ncRNA",
          "pseudogene",
          "unknown"
        ],
        "range": ["orange", "blue", "green", "red", "purple", "black"]
      },
      "tracks": [
        {
          "mark": "triangleRight",
          "x": { "field": "end", "type": "genomic", "axis": "top" },
          "size": { "value": 10 },
          "tooltip": [
            { "field": "gene_biotype", "type": "nominal", "alt": "Gene Biotype" },
            { "field": "Name", "type": "nominal", "alt": "Gene Name" }
          ]
        },
        {
          "mark": "text",
          "text": { "field": "Name", "type": "nominal" },
          "x": { "field": "start", "type": "genomic" },
          "xe": { "field": "end", "type": "genomic" },
          "style": { "dy": -10 },
          "tooltip": [
            { "field": "gene_biotype", "type": "nominal", "alt": "Gene Biotype" },
            { "field": "Name", "type": "nominal", "alt": "Gene Name" }
          ]
        },
        {
          "mark": "triangleLeft",
          "x": { "field": "start", "type": "genomic" },
          "size": { "value": 10 },
          "style": { "align": "right" },
          "tooltip": [
            { "field": "gene_biotype", "type": "nominal", "alt": "Gene Biotype" },
            { "field": "Name", "type": "nominal", "alt": "Gene Name" }
          ]
        },
        {
          "mark": "rule",
          "x": { "field": "start", "type": "genomic" },
          "strokeWidth": { "value": 3 },
          "xe": { "field": "end", "type": "genomic" },
          "style": { "linePattern": { "type": "triangleRight", "size": 5 } },
          "tooltip": [
            { "field": "gene_biotype", "type": "nominal", "alt": "Gene Biotype" },
            { "field": "Name", "type": "nominal", "alt": "Gene Name" }
          ]
        },
        {
          "mark": "rule",
          "x": { "field": "start", "type": "genomic" },
          "strokeWidth": { "value": 3 },
          "xe": { "field": "end", "type": "genomic" },
          "style": { "linePattern": { "type": "triangleLeft", "size": 5 } },
          "tooltip": [
            { "field": "gene_biotype", "type": "nominal", "alt": "Gene Biotype" },
            { "field": "Name", "type": "nominal", "alt": "Gene Name" }
          ]
        }
      ],
      "opacity": { "value": 0.8 },
      "width": 800,
      "height": 80
    }
  ]
}

export { gene_template };