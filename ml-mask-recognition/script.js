const webcamElement = document.getElementById('webcam');
const videoContainerElement = document.querySelector('.container-video')
const classResultElement = document.querySelector('.text-class-result')

let net;
const classifier = knnClassifier.create();
let predictions = []

const noMaskElement = document.querySelector('.no-mask')
const maskElement = document.querySelector('.mask')
const canvas = document.getElementById('canvas');

const MAX_SEQUENCE = 30

const allEqual = arr => arr.every(val => val === arr[0]);

const width = 100
const height = 100
canvas.setAttribute('width', width);
canvas.setAttribute('height', height);

function takepicture(classId) {
    var context = canvas.getContext('2d');
    if (width && height) {
        canvas.width = width;
        canvas.height = height;
        context.drawImage(webcamElement, 0, 0, width, height);

        var data = canvas.toDataURL('image/png');
        let photo = document.createElement('img')
        photo.setAttribute('src', data);
        if (classId == 0) {
            photo.style.borderColor = "red";
            noMaskElement.appendChild(photo)
        } else if (classId == 2) {
            photo.style.borderColor = "green";
            maskElement.appendChild(photo)
        }
        
    }
}

async function app() {

  // Load the model.
  net = await mobilenet.load();
  console.log('Successfully loaded model');

  // Create an object from Tensorflow.js data API 
  // which could capture image from the web camera as Tensor.
  const webcam = await tf.data.webcam(webcamElement);

  // Reads an image from the webcam and associates it with a specific class Index
  const addExample = async classId => {
    // Capture an image from the web camera.
    const img = await webcam.capture();
    takepicture(classId)
    // Get the intermediate activation of MobileNet 'conv_preds' and pass that
    // to the KNN classifier.
    const activation = net.infer(img, true);
    // Pass the intermediate activation to the classifier.
    classifier.addExample(activation, classId);
    // Dispose the tensor to release the memory.
    img.dispose();
  };
  // When clicking a button, add an example for that class.
  document.getElementById('class-a').addEventListener('click', () => addExample(0));
  document.getElementById('class-b').addEventListener('click', () => addExample(1));
  document.getElementById('class-c').addEventListener('click', () => addExample(2));

  let classCounter = 0;
  while (true) {
    if (classifier.getNumClasses() === 3) {
      const img = await webcam.capture();
      // Get the activation from mobilenet from the webcam.
      const activation = net.infer(img, 'conv_preds');
      // Get the most likely class and confidence from the classifier module.
      const result = await classifier.predictClass(activation, k=3);
      const classes = ['Sem Mascara', 'Neutro', 'Com Mascara'];
      console.log(result.label, result.label === classes[0])
    if (predictions.length === MAX_SEQUENCE) {
        predictions.shift()
      }
      predictions.push(result.label)

      if (predictions.length === MAX_SEQUENCE && allEqual(predictions)) {
        if (classes[result.label] === classes[0]) {
            videoContainerElement.style.borderColor = "red"
            classResultElement.innerHTML = classes[0]
            classResultElement.style.color = "red"
        } else if (classes[result.label] === classes[2]) {
            videoContainerElement.style.borderColor = "green"
            classResultElement.innerHTML = classes[2]
            classResultElement.style.color = "green"
        } else {
            videoContainerElement.style.borderColor = "black"
            classResultElement.innerHTML = classes[1]
            classResultElement.style.color = "black"
        }
        predictions = []
      }
      // Dispose the tensor to release the memory.
      img.dispose();
    }

    await tf.nextFrame();
  }
}

app();