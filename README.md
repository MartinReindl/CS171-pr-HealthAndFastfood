# CS 171 Final Project 

** Andre Souffrant & Martin Reindl **

This README file gives an overview of what we are handing in. It also explains the features of our visualization

## Code

### CSS
We have a number of CSS files. The only file we actively worked on is myStyle.css, which can be found in the "css" folder

### JavaScript
We have several JavaScript files. All files within the "js" folder were written by us. Of course we searched the internet for help with problems, and used a fair amount of code from other sources(e.g. from Mike Bostock). When large chunks of code were copied from an online source, we mentioned it in comments directly above the code. 

### Data
We have four data files, which were compiled from a number of sources as indicated in our process book. All of these files can be found in the "data" folder

### Libraries
We used a number of libraries in our code: 
- **Bootstrap, with a bootstrap-theme called "creative bootstrap":** We used these two libraries to help make our website look nice. The theme is rather large and has multiple files/plug-ins (easing.min.js, fittext.js, animate.min.css, font-awesome.min.css) 
- **d3-tip:** We used this to generate nice looking tool-tips on our main visualization. 
- **queue.js:** We used this to simultaneously load several data sets. 
- **colorbrewer.js:** We used this for some of our coloring (especially on the heat map, but also in our story visualizations)

## URLs
Our project website can be found <a href="http://www.healthandfastfood.website">here</a>.

Our project screencast can be found embedded in our website and <a href="">on youtube<a>. 

## Interface
Overall our interface is relatively simple to understand. As outlined in our process book, the interface consists of a scrollable story, our main visualization, and the video at the end: 

### Story
Our story consists of several sections that are almost fully static and require no further explanation. 

### Main Visualization
Our main visualization is an interactive visualization that allows the user to explore the relationship between fast food restaurant locations and measures of health. There are three types of interaction: 
- **Radio controls** allow the user to change the health measures displayed on the map and scatterplot. 
- **Checkboxes** filter the restaurants to be displayed on the map and scatterplot.
- **Map Selections** can be made by clicking on a state on the map. The map is also zoomable and draggable. 

### Video
Our project screencast is embedded at the bottom of our website. 