const ctx = document.querySelector('canvas').getContext('2d')

// ctx.fillRect(110, 110, 50, 50)
// ctx.arc(10, 10, 9, 0, Math.PI * 2)
// ctx.fillStyle = 'red'
// ctx.arc(10, 30, 9, 0, Math.PI * 2)
// ctx.fillStyle = 'green'
// ctx.fill()
// ctx.fillStyle = 'red'
// ctx.fillStyle = 'red'
// ctx.strokeStyle = 'green'
// ctx.stroke()
// var grd = ctx.createLinearGradient(0, 0, 170, 0);
// grd.addColorStop(0, 'red');
// grd.addColorStop(1, 'orange');

// const amps = new Array(35).fill(0).map(() => Math.random() * 15)
// drawGrid(31, 9, 25, 120, 8, 2)

// ctx.shadowOffsetX = 3;
// ctx.shadowOffsetY = 2;

let audioContext

const getSourceNode = (audioContext, buffer) => {
    const source = audioContext.createBufferSource()
  
    source.buffer = buffer
    source.looping = true
  
    return source
}

function start() {
    audioContext = new AudioContext()

    document.querySelector('body').removeEventListener('click', start)

    loadSound('./alive-2007.mp3', audioContext)
        .then((buffer) => {
            sourceNode = getSourceNode(audioContext, buffer)
            
            play(audioContext, sourceNode)
        })
}

document.querySelector('body').addEventListener('click', start)

const play = (audioContext, sourceNode) => {
    analyser = new Analyser(audioContext, ctx, { fftSize: 256 })
    analyser.start()
  
    sourceNode.connect(analyser.node)
    console.log(sourceNode)
    analyser.node.connect(audioContext.destination)

    sourceNode.start(audioContext.currentTime, 280)
}

function loadSound(path) {
    // const { audioContext } = this
    const request = new XMLHttpRequest()
    request.open('GET', path, true)
    request.responseType = 'arraybuffer'

    const promise = new Promise((resolve, reject) => {
      request.onload = () => {
        audioContext.decodeAudioData(
          request.response,
          (buffer) => resolve(buffer),
          (error) => console.error(error)
        )
      }

      request.onerror = (error) => reject(error)
    })

    request.send()

    return promise
}

function buildMatrix(h, v) {
    const matrix = []

    for (let i = 0; i < v; i++) {
        matrix.push([])

        for (let k = 0; k < h; k++) {
            matrix[i].push(0)
        }
    }

    return matrix
}

// function drawGrid(h, v, startX, startY, radius, gap) {
//     for (let i = 0; i < h; i++) {
//         for (let k = 0; k < v; k++) {
//             const x = i * (radius + radius + gap) + startX
//             // const y = k * (radius + radius + gap) + startY
//             const y = k * (radius + radius + gap) + (-(52 / 81796) * x * x + (29744 / 81796) * x) + startY

//             const a = amps[i] < k ? 1 : 0
//             ctx.beginPath()
//             ctx.arc(x, y, radius, 0, Math.PI * 2)
            
//             ctx.fillStyle = `rgba(255, 0, 0, ${a})`
            
//             ctx.shadowColor = 'rgba(255, 0, 0, 1)'
//             ctx.shadowBlur = 10

//             ctx.closePath()
//             ctx.fill()
//         }
//     }
// }

