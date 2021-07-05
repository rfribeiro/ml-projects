const btnTalk = document.querySelector('.talk')
const content = document.querySelector('.content')

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
const recognition = new SpeechRecognition()
recognition.lang = 'pt-BR'

recognition.onstart = () => {
    console.log('voice is activated, you ca to microphonee')
}

recognition.onresult = (event) => {
    const currentIndex = event.resultIndex
    const transcriptedText = event.results[currentIndex][0].transcript
    content.textContent = transcriptedText
}

recognition.onerror = () => {
    content.textContent = 'Desculpe mas não te entendi!'
}

btnTalk.addEventListener('click', () => {
    recognition.start()
})