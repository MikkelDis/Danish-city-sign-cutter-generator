//Loader, exporters and packages
import * as THREE from 'three';
import { STLLoader } from 'three/addons/loaders/STLLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { STLExporter } from 'three/addons/exporters/STLExporter.js';

//Const variables used for the 3D generation
const textSize = 6.8; //Size before being scaled
const textDepth = 5; //The depth of the text
const signScaleValue = 0.5; //The scale percentage of the sign width
const maxScaleValue = 1.5; //The maximum amount of scale
const textYOffset = 5; //How much above the center the text is
const negativeDepth = 2; //How low based on the absolute top the text is.
const cameraZPosition = 70;// Z axis for the camera. If you cant see any models, this might be the reason

//Initalize the loaders
const loader = new STLLoader();
const fontLoader = new FontLoader();

//Initialize the STLexporter
const exporter = new STLExporter();

//Initalize the used font
const font = await fontLoader.loadAsync('./Cantarell_Regular.json');

//Initalize the scene and camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z = cameraZPosition;

//Initalize the renderer, adds to the body of document (purely for visualization)
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth/2, window.innerHeight/2 );
document.body.appendChild( renderer.domElement );

//Load the city template (Has everything except the city name)
const byTemplateGeometry = await loader.loadAsync( './byTemplate.stl' );
byTemplateGeometry.scale(1, 1, 1); //Scales it to the standard scale
const byTemplateMesh = new THREE.Mesh(byTemplateGeometry); //Creates the mesh (from the geometry)
scene.add(byTemplateMesh); //Adds it to the scene
byTemplateGeometry.computeBoundingBox(); //Comoutes the bounding box. Needed for later use

//Adds event listener for new text input
document.querySelector("#TekstInput").addEventListener('change', loadText);

//Add event listener for download
document.querySelector("#buttonDownload").addEventListener('click', ()=>{
    //Checks if there exists an active text
    const activeText = scene.getObjectByName('textMesh');
    //Updates the matrix world so the STL export get correct position and scale
    if(activeText) {
        activeText.updateMatrixWorld();
    }
    byTemplateMesh.updateMatrixWorld();
    //We get the stl string 
    const stlString = exporter.parse(scene);

    //Create a blow with the new stl string
    const blob = new Blob([stlString], { type: 'text/plain' });
    //Downloads the new stl
    const downloadButton = document.querySelector("#stlDownload");
    downloadButton.href = URL.createObjectURL(blob);
    downloadButton.download = 'sign.stl';
})

//Load text function (Event is the event thrown by the event listener)
function loadText(event){
    //Check if an text is already created, if so, remove it from the scene
    if (scene.getObjectByName('textMesh')) {
        const oldText = scene.getObjectByName('textMesh');
        scene.remove(oldText);
        oldText.geometry.dispose(); //Disposes of the geometry
        oldText.material.dispose(); //Disposes of the material
    }
    //Creates new text geometry
    const textGeometry = new TextGeometry(event.target.value, {
    font: font,
    size: textSize,
    depth: textDepth,
    curveSegments: 12, //Standard value from documentation
    bevelEnabled: false //Standard value from documentation
    });
    //Creates a standard material
    const textMaterial = new THREE.MeshNormalMaterial();
    //Creates the text mesh
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);
    //Creates the mesh of the text
    textMesh.name = "textMesh";
    //Computes the bounding box, needed for finding width and center
    textGeometry.computeBoundingBox();

    //----------ALL CODE BELOW RELIES ON THE BOUNDING BOX BEING COMPUTED----------
    //Find width of sign
    let signWidth = byTemplateGeometry.boundingBox.max.x - byTemplateGeometry.boundingBox.min.x;
    //Find center of sign
    const signCenter = (byTemplateGeometry.boundingBox.max.x + byTemplateGeometry.boundingBox.min.x) / 2;
    //Text width
    let textWidth = textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x;
    //Text center
    const textCenter = (textGeometry.boundingBox.min.x + textGeometry.boundingBox.max.x) / 2;
    //Set the text size
    const targetWidth = signWidth * signScaleValue; //Scales the text to x% of the sign size
    const scale = -Math.min(targetWidth / textWidth,maxScaleValue); // Max scale value. We use negative to invert the text
    //Scales the text
    textWidth = textWidth * scale;
    textMesh.scale.set(scale, 1, 1);
    //Sets the position of the sign
    textMesh.position.x = -textCenter * scale + signCenter;
    //Y offset
    textMesh.position.y += textYOffset;
    //Comput the absolute top value of the top sign
    const topOfSign = byTemplateGeometry.boundingBox.max.z;
    //Positions it down so the text touches the sign
    textMesh.position.z = negativeDepth;
    //Adds it to the scene
    scene.add(textMesh);
}

//Creates the animation loop
function animate( time ) {
    renderer.render( scene, camera );
}

renderer.setAnimationLoop( animate );





