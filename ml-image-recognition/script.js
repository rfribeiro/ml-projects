let net;
const webcamElement = document.getElementById('webcam');
const classifier = knnClassifier.create();
const imgContainer = document.querySelector('.container_img')
const aniContainer = document.querySelector('.animation')
let imageElement = getNewImage()
let nextImageElement = getNewImage(true)

let predictions = []

const MAX_SEQUENCE = 30

function getNewImage(next = false) {
  const img = document.createElement("img")
  img.src = "https://picsum.photos/1000?" + Math.random()
  if (next) {
      img.classList.add("next")
  }
  imgContainer.append(img)
  return img
}

function setNewImageSlider() {
  setTimeout(() => {
      imageElement.remove()
      nextImageElement.classList.remove('next')
      aniContainer.className = "animation fas";
      imageElement = nextImageElement
      nextImageElement = getNewImage(true)
  }, 500)
}

const allEqual = arr => arr.every(val => val === arr[0]);

async function app() {
  console.log('Loading mobilenet..');

  // Load the model.
  net = await mobilenet.load();
  console.log('Successfully loaded model');

  // Create an object from Tensorflow.js data API which could capture image
  // from the web camera as Tensor.
  const webcam = await tf.data.webcam(webcamElement);

  // Reads an image from the webcam and associates it with a specific class
  // index.
  const addExample = async classId => {
    // Capture an image from the web camera.
    const img = await webcam.capture();

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
      const result = await classifier.predictClass(activation);
      const classes = ['Negativo', 'Neutro', 'Positivo'];
      console.log(result.label, result.label === classes[0])
      
      if (predictions.length === MAX_SEQUENCE) {
        predictions.shift()
      }
      predictions.push(result.label)

      if (predictions.length === MAX_SEQUENCE && allEqual(predictions)) {
        if (classes[result.label] === classes[0]) {
          imageElement.classList.add('left')
          aniContainer.classList.add('fa-thumbs-down', 'active')
          setNewImageSlider()
        } else if (classes[result.label] === classes[2]) {
          imageElement.classList.add('right')
          aniContainer.classList.add('fa-thumbs-up', 'active')
          setNewImageSlider()
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