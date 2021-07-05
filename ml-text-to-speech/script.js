const playButton = document.getElementById("play-button")
const pauseButton = document.getElementById("pause-button")
const stopButton = document.getElementById("stop-button")
const textInput = document.getElementById("text")
const speedInput = document.getElementById("speed")
let currentChar

playButton.addEventListener('click', () => {
    playText(textInput.value)
})
pauseButton.addEventListener('click', pauseText())
stopButton.addEventListener('click', stopText())
speedInput.addEventListener('input', () => {
    if (!speechSynthesis.speaking) return
    stopText()
    playText(utterance.text.substring(currentChar))
})


const utterance = new SpeechSynthesisUtterance()
utterance.addEventListener('end', () => {
    textInput.disable = false
})
utterance.addEventListener('boundary', e => {
    currentChar = e.charIndex
    console.log(currentChar)
})

function playText(text) {
    if (speechSynthesis.paused && speechSynthesis.speaking) {
        return speechSynthesis.resume()
    }
    if (speechSynthesis.speaking) return
    utterance.text = text
    utterance.rate = speedInput.value || 1
    textInput.disable = true
    speechSynthesis.speak(utterance)
}

function pauseText() {
    if (speechSynthesis.speaking) speechSynthesis.pause()
}

function stopText() {
    speechSynthesis.resume()
    speechSynthesis.cancel()
}