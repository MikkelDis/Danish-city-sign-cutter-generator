# Danish city sign "cutter" generator
This project generates a 3D model based on the danish city sign, with and arbitary text value (Meant for city names). The 3D model is made as an "cutter", which
can be 3D printed and used for various creative tasks.

## Installation
You need to have Node js installed, and also npm (it typically comes with the node installation, you can easily verify this in the terminal).
Copy the repository down, and in the termninal run
```bash
npm install
````
This will install all the packages used, using the npm.
If it installed everything correctly, you should be able to run
```bash
npx vite
````
Which will print out localhost domain and a random port. You can use this in a broswer, and should be able to use the program from there.

## Useage
The program is pretty much ready-to-use when it is installed, but i made it pretty easy to modify the settings for the text in the main.js file. At the top
I have a lot of constant variables, which are used to generate the text. These variables can easily be changed to make it fit what you prefer.  
```j
const textSize = 6.8; //Size before being scaled
const textDepth = 5; //The depth of the text
const signScaleValue = 0.5; //The scale percentage of the sign width
const maxScaleValue = 1.5; //The maximum amount of scale
const textYOffset = 5; //How much above the center the text is
const negativeDepth = 2; //How low based on the absolute top the text is.
const cameraZPosition = 70;// Z axis for the camera. If you cant see any models, this might be the reason
```

## Background
This project was made as a way to speed up the process of making 3D models for my partners pottery hobby. She enjoys creating personalized cups with city
names, and to make those city name logos she used 3D models i printed. I wanted to make the process of generating those cutters faster, which lead to this project.
It is a very niche project, so i dont really expect people to use it, but I still wanted to put it out for open use. 
