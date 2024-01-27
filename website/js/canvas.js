const { predict, getCoordinates, getModelStatus, train } = require("./grpc");

// get references to the canvas and context
const canvas = document.getElementById("thecanvas");
const ctx = canvas.getContext("2d");

// style the context
ctx.strokeStyle = "orange";
ctx.lineWidth = 2;

// calculate where the canvas is on the window
// (used to help calculate mouseX/mouseY)
const canvasOffset = canvas.getBoundingClientRect();
let offsetX = canvasOffset.left;
let offsetY = canvasOffset.top;

let rects = [];

// this flage is true when the user is dragging the mouse
let isDown = false;

// these vars will hold the starting mouse position
let startX;
let startY;

let x1 = null;
let x2 = null;
let y1 = null;
let y2 = null;

let modelStatus = null;

function handleMouseDown(e) {
  e.preventDefault();
  e.stopPropagation();

  // save the starting x/y of the rectangle
  startX = parseInt(e.clientX - offsetX);
  startY = parseInt(e.clientY - offsetY);

  // set a flag indicating the drag has begun
  isDown = true;
}

function handleMouseUp(e) {
  e.preventDefault();
  e.stopPropagation();

  if (x1 && y1) {
    rects.push({
      lat: x1,
      long: y1,
      width: x2,
      height: y2,
    });
  }

  // the drag is over, clear the dragging flag
  isDown = false;
}

function handleMouseOut(e) {
  e.preventDefault();
  e.stopPropagation();

  // the drag is over, clear the dragging flag
  isDown = false;
}

function handleMouseMove(e) {
  e.preventDefault();
  e.stopPropagation();

  // if we're not dragging, just return
  if (!isDown) {
    return;
  }

  // get the current mouse position
  mouseX = parseInt(e.clientX - offsetX);
  mouseY = parseInt(e.clientY - offsetY);

  // Put your mousemove stuff here

  // clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  rects.forEach((r) => {
    if (r.isPredicted) {
      ctx.strokeStyle = "red";
    }
    ctx.strokeRect(r.lat, r.long, r.width, r.height);
  });

  // calculate the rectangle width/height based
  // on starting vs current mouse position
  const width = mouseX - startX;
  const height = mouseY - startY;

  // draw a new rect from the start position
  // to the current mouse position

  ctx.strokeRect(startX, startY, width, height);
  x1 = startX;
  y1 = startY;
  x2 = width;
  y2 = height;
}

getCoordinates().then((data) => {
  rects = data.map((coords) => ({
    lat: coords[0],
    long: coords[1],
    width: coords[2],
    height: coords[3],
  }));

  rects.forEach((r) => {
    ctx.strokeRect(r.lat, r.long, r.width, r.height);
  });
});

getModelStatus().then((data) => {
  document.getElementById("ModelStatus").innerText = data;
});

document
  .getElementById("thecanvas")
  .addEventListener("mousedown", function (e) {
    handleMouseDown(e);
  });
document
  .getElementById("thecanvas")
  .addEventListener("mousemove", function (e) {
    handleMouseMove(e);
  });
document.getElementById("thecanvas").addEventListener("mouseup", function (e) {
  handleMouseUp(e);
});
document.getElementById("thecanvas").addEventListener("mouseout", function (e) {
  handleMouseOut(e);
});

document
  .getElementById("saveRects")
  .addEventListener("click", async function (e) {
    const predictedCoordinate = await predict(rects);
    rects.push({
      lat: predictedCoordinate[0],
      long: predictedCoordinate[1],
      width: predictedCoordinate[2],
      height: predictedCoordinate[3],
      isPredicted: true,
    });

    render();
  });

document.getElementById("clearRects").addEventListener("click", function (e) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  rects = [];
});

document.getElementById("thecanvas").onload = () => {
  getCoordinates();
};

const render = () => {
  rects.forEach((r) => {
    if (r.isPredicted) {
      ctx.strokeStyle = "red";
    }
    ctx.strokeRect(r.lat, r.long, r.width, r.height);
  });
};

let trainingData = [];

document
  .getElementById("inputDataTrain")
  .addEventListener("change", function (e) {
    const rows = e.target.value.split("\n");
    trainingData = rows.map((row) => {
      const [lat, long, width, height] = row
        .split(",")
        .map((c) => parseInt(c.trim()));
      return {
        lat,
        long,
        width,
        height,
      };
    });
  });

document
  .getElementById("saveDataTrainButton")
  .addEventListener("click", function (e) {
    train(trainingData);
  });
