window.saveDataAcrossSessions = true

const imgContainer = document.querySelector('.container_img')
let imageElement = getNewImage()
let nextImageElement = getNewImage(true)

let startLookTime = Number.POSITIVE_INFINITY
let lookDirection = null
const LOOK_DELAY = 1000
const LEFT_CUTOFF = window.innerWidth / 4
const RIGHT_CUTOFF = window.innerWidth - window.innerWidth / 4

webgazer
    .setGazeListener((data, timestamp) => {
        if (data == null || lookDirection === 'STOP') return

        if (data.x < LEFT_CUTOFF && lookDirection !== 'LEFT' && lookDirection != 'RESET') {
            startLookTime = timestamp
            lookDirection = 'LEFT'
        } else if (data.x > RIGHT_CUTOFF && lookDirection !== 'RIGHT' && lookDirection != 'RESET') {
            startLookTime = timestamp
            lookDirection = 'RIGHT'
        } else if (data.x >= LEFT_CUTOFF && data.x <= RIGHT_CUTOFF) {
            startLookTime = Number.POSITIVE_INFINITY
            lookDirection = null
            console.log('reset')
        }

        if (startLookTime + LOOK_DELAY < timestamp) {
            console.log('here')
            if (lookDirection === 'LEFT') {
                imageElement.classList.add('left')
            } else {
                imageElement.classList.add('right')
            }
            startLookTime = Number.POSITIVE_INFINITY
            lookDirection = 'STOP'
            setTimeout(() => {
                imageElement.remove()
                nextImageElement.classList.remove('next')
                imageElement = nextImageElement
                nextImageElement = getNewImage(true)
                lookDirection = 'RESET'
            }, 300)
        }
    })
    .begin()

webgazer.showVideoPreview(false).showPredictionPoints(true)

function getNewImage(next = false) {
    const img = document.createElement("img")
    img.src = "https://picsum.photos/1000?" + Math.random()
    if (next) {
        img.classList.add("next")
    }
        
    imgContainer.append(img)
    return img
}
