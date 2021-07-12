function startVideoStream() {
    // Get the video element
    const video = document.querySelector('#video')
    // Check if device has camera
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        // Use video without audio
        const constraints = { 
            video: { 
                facingMode: { exact: "environment" }
              },
            audio: false
        }
        
        // Start video stream
        navigator.mediaDevices.getUserMedia(constraints).then(stream => video.srcObject = stream);
    }
}

async function  detectCode() {
    // create new detector
    const barcodeDetector = new BarcodeDetector({formats: ['qr_code', 'codabar', 'ean_13']});

    const detectedCode = barcodeDetector.detect(video)
    for (const code of detectedCode) {
        console.log(code)
        alert(code)
    }
}

function run() {
    if ('BarcodeDetector' in window) {
        console.log('Barcode Detector supported!');
        startVideoStream()
        setInterval(detectCode, 100);
    } else {
        alert('Barcode Detector is not supported by this browser.');
        return
    }
    
}

// run()