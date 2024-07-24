# Running the project

```bash
# Install project dependencies
npm install

# Serve the files
node app

# Go to your browser and access it going to the link
http://localhost:3000/
```

# Visualizing-adaptive-variation
A project within the course of Applied Bioinformatics, using the Gosling grammar to visualize adaptive variation. The project consists of two main parts: the development of a Graphical User Interface for the use of Gosling, as well as the generation of a catalog consisting of HTML pages with visualizations tailored for data provided. 

## Gosling Graphical User interface
A simple GUI was developed for easy use of the Gosling grammar using data provided by the user. 

## Gene catalog
A collection of scripts involved in the creation of visualizations of adaptive variation within Northern krill. The script can generate a large catalogue of plots for candidate genes linked to ecological adaptation, and the scripts are customized for these genes. However the code can be adapted to fit other use cases. 


## How it works!
You can upload file either locally from your machine or from a url, the file has to be CSV or TSV format.
You have to press on apply button for any change you make.
There are 3 ways for exporting, either as PNG, HTML or JSON.
The exported files will be available in the exports folder.

Note: make sure to use a file from a url, since you wont be able to see the plot if you used a local file for PNG (this does not yeild for JSON or HTML exportation)

