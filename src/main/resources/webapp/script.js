let imgPreview = document.querySelector("#previewImage");
let pixelCanvas = document.querySelector(".pixelCanvas");


var testButton = document.querySelector(".test-button");
var succButton = document.querySelector(".btn-success");
var pixelStep = document.querySelector("#pixelStep");
var startX = document.querySelector("#startX");
var startY = document.querySelector("#startY");
var includeComments = document.querySelector("#includeComments");
var colorFormat = document.querySelector("#colorFormat");
var templateInput = document.querySelector("#templateInput");
let changedFileInput = false;

let codeOutput = document.querySelector(".code-output");



function setSizeCanvas(canvasWidth, canvasHeight, startX, startY) {
    pixelCanvas.width = canvasWidth + startX;
    pixelCanvas.height = canvasHeight + startY;
}


function writePixels(pixelList) {
    let ctx = pixelCanvas.getContext("2d");
    for (let i of pixelList) {
        if (i[2] == 0) continue;
        ctx.fillStyle = `rgba(${i[3]}, ${i[4]}, ${i[5]}, ${i[2]})`
        ctx.fillRect(i[0], i[1], 1, 1);
    }

}


function writeCode(pixelList) {
    pixelList.forEach(pixelInfo => {
        prePixel = document.createElement("pre")
        prePixel.innerHTML = pixelInfo;
        codeOutput.append(prePixel);
    });
}

function clearCode() {
    codeOutput.innerHTML = "";
}


testButton.addEventListener("click", function() {
        bridge.conJavaMess("JAVA message button");
        bridge.sendToJS();
});

fileInput.addEventListener("change", (event) => {
    changedFileInput = true;
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        const base64String = e.target.result;
        imgPreview.src = base64String;


        bridge.conJavaMess(base64String.substring(0, 50) + "...");
        let qwe = bridge.generatePicture(templateInput.value, colorFormat.value,
            pixelStep.value, startX.value, startY.value, base64String);

        bridge.conJavaMess(qwe);

    };
    reader.readAsDataURL(file);
});


succButton.addEventListener("click", function() {

        if (!changedFileInput) {
            bridge.conJavaMess("File doesn't uploaded yet");
        }
        else {
            const resultImage = bridge.generatePicture(templateInput.value, colorFormat.value,
                +pixelStep.value, +startX.value, +startY.value, base64String);
            bridge.conJavaMess(resultImage);
        }

});


