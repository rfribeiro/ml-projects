const imgContainer = document.querySelector('.container_img')
let imageElement = getNewImage()
let nextImageElement = getNewImage(true)
const btnMic = document.querySelector('.mic-button')
const contentText = document.querySelector('.content-text')

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
const recognition = new SpeechRecognition()
recognition.lang = 'pt-BR'

function getNewImage(next = false) {
    const img = document.createElement("img")
    img.src = "https://picsum.photos/1000?" + Math.random()
    if (next) {
        img.classList.add("next")
    }
        
    imgContainer.append(img)
    return img
}

recognition.onstart = () => {
    console.log('voice is activated, you can talk to microphonee')
}

function setNewImageSlider() {
    setTimeout(() => {
        imageElement.remove()
        nextImageElement.classList.remove('next')
        imageElement = nextImageElement
        nextImageElement = getNewImage(true)
    }, 300)
}

recognition.onresult = (event) => {
    const currentIndex = event.resultIndex
    const transcriptedText = event.results[currentIndex][0].transcript

    console.log(transcriptedText)
    if (transcriptedText.includes('não gostei') || transcriptedText.includes('unlike')) {
        imageElement.classList.add('left')
        contentText.textContent = transcriptedText
        setNewImageSlider()
    } else if (transcriptedText.includes('gostei') || transcriptedText.includes('like')) {
        imageElement.classList.add('right')
        contentText.textContent = transcriptedText
        setNewImageSlider()
    }
    btnMic.classList.remove("active");
    contentText.classList.remove("active");
    
}

recognition.onerror = () => {
    contentText.textContent = 'Desculpe mas não te entendi!'
    btnMic.classList.remove("active");
    contentText.classList.remove("active");
}

btnMic.addEventListener('click', () => {
    recognition.start()
    btnMic.classList.add("active");
    contentText.classList.add("active");
    contentText.textContent = 'Escutando...'
})