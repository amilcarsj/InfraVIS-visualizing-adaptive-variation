export function exportingFigures () {
  document.getElementById('export-dropdown').addEventListener('change', (event) => {
      const selectedValue = event.target.value;
      const container = document.getElementById('plot-container-1');
      const notification = document.getElementById('notification');
  
      const showMessage = (message, color) => {
          notification.textContent = message;
          notification.style.backgroundColor = color;
          notification.style.display = 'block';
          setTimeout(() => {
              notification.style.display = 'none';
          }, 3000);
      };
  
      if (!container) {
          console.error('Plot container element not found');
          showMessage('Plot container element not found', '#ff0000');
          return;
      }
  
      const svgElements = container.getElementsByTagName('svg');
  
      if (svgElements.length === 0) {
          console.error('No SVG elements found in the plot container');
          showMessage('No SVG elements found in the plot container', '#ff0000');
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
  
      let endpoint = '';
        switch (selectedValue) {
            case 'json':
                endpoint = '/save-json';
                break;
            case 'png':
                endpoint = '/save-png';
                break;
            case 'html':
                endpoint = '/save-html';
                break;
            default:
                console.error('Invalid export option selected');
                showMessage('Invalid export option selected', '#ff0000');
                return;
        }
        if (selectedValue === 'json') {
            fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ jsonContent: jsonSpec }),
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Success:', data);
                showMessage('JSON file saved successfully', '#33cc33');
            })
            .catch((error) => {
                console.error('Error:', error);
                showMessage('Error during export: ' + error.message, '#ff0000');
            });
        } else {
            // HTML and PNG export logic
            fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ htmlContent }),
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Success:', data);
                showMessage('Export was done successfully', '#33cc33');
            })
            .catch((error) => {
                console.error('Error:', error);
                showMessage('Error during export: ' + error.message, '#ff0000');
            });
        }
    });

    // Add JSON export button event listener
    document.getElementById('export-json-button').addEventListener('click', () => {
        const jsonSpec = window.plotSpecManager.exportPlotSpecAsJSON();
        fetch('/save-json', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ jsonContent: jsonSpec }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Success:', data);
            const a = document.createElement('a');
            a.href = data.fileUrl;
            a.download = 'plotSpec.json';
            a.click();
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    });
}


