let max = 100

function drawGrid(h, v, startX, startY, radius, gap, amps) {
  max = 100

  for (let i = 0; i < h; i++) {
    for (let k = 0; k < v; k++) {
      const x = i * (radius + radius + gap) + startX
      // const y = k * (radius + radius + gap) + startY
      // v - k * (radius * 2 + gap)
      let y = k * (radius * 2 + gap) + ((52 / 81796) * x * x - (29744 / 81796) * x) + startY
      y = v + 365 - y

      const a = amps[Math.floor(i * h * 2 / amps.length)] < (max * Math.pow(2, k / v) / 1.8) ? 0 : 1
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, Math.PI * 2)
      
      ctx.fillStyle = `rgba(255, 0, 0, ${a})`
      
      ctx.shadowColor = 'rgba(255, 0, 0, 1)'
      ctx.shadowBlur = 10

      ctx.closePath()
      ctx.fill()
    }

    if (amps[i] > max) {
      max = amps[i]
    }
  }
}

class AnalyserDefaultSkin {
  set ({ fBufferLength, tBufferLength, canvasCtx, barWidth = 3 }) {
    this.fBufferLength = fBufferLength
    this.tBufferLength = tBufferLength
    this.canvasCtx = canvasCtx
    this.barWidth = barWidth

    this.width = canvasCtx.canvas.width
    this.height = canvasCtx.canvas.height
  }

  drawTime (dataArray) {

  }

  drawFrequency (bars) {
    // let x = 0
    this.canvasCtx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    drawGrid(60, 15, 20, 110, 4, 2, bars)
    // drawGrid()
  }
}

const defaultSkin = new AnalyserDefaultSkin()

class Analyser {
  constructor (audioContext, canvasCtx, { skin = defaultSkin, fftSize = 2048 } = {}) {
    this.audioContext = audioContext
    this.canvasCtx = canvasCtx

    this.width = canvasCtx.canvas.width
    this.height = canvasCtx.canvas.height

    this.node = audioContext.createAnalyser()
    // console.log(this.node.fftSize)
    // this.node.smoothingTimeConstant = 0.9
    this.node.fftSize = fftSize

    this.setTimeConfig()
    this.setFrequencyConfig()

    this.drawTime()
    this.drawFrequency()

    this.skin = skin
    this.skin.set({
      fBufferLength: this.node.frequencyBinCount,
      tBufferLength: this.node.fftSize,
      canvasCtx
    })

    this.isDrawing = false
  }

  setTimeConfig () {
    const bufferLength = this.node.fftSize

    this.t = {
      bufferLength
    }
  }

  setFrequencyConfig () {
    const bufferLength = this.node.frequencyBinCount

    this.f = {
      bufferLength: bufferLength,
      barWidth: (this.width / bufferLength) * 5
    }
  }

  drawTime () {
    window.requestAnimationFrame(() => this.drawTime())

    if (!this.isDrawing) {
      return
    }

    const analyser = this.node
    const bufferLength = this.t.bufferLength
    const dataArray = new Uint8Array(bufferLength)

    analyser.getByteTimeDomainData(dataArray)

    this.skin.drawTime(dataArray)
  }

  drawFrequency () {
    window.requestAnimationFrame(() => this.drawFrequency())

    if (!this.isDrawing) {
      return
    }

    const analyser = this.node
    const dataArray = new Uint8Array(this.f.bufferLength)

    analyser.getByteFrequencyData(dataArray)
    this.skin.drawFrequency(dataArray)
  }

  start () {
    this.isDrawing = true
  }

  stop () {
    this.isDrawing = false
  }
}
  