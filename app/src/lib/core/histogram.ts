export function drawHistogram(
    imageData: ImageData,
    histCtx: CanvasRenderingContext2D,
    histCanvas: HTMLCanvasElement
) {
    if (!histCtx || !histCanvas) return

    histCtx.clearRect(0, 0, histCanvas.width, histCanvas.height)

    const binsR = new Array(256).fill(0)
    const binsG = new Array(256).fill(0)
    const binsB = new Array(256).fill(0)

    const data = imageData.data
    for (let i = 0; i < data.length; i += 4) {
        binsR[data[i]]++
        binsG[data[i + 1]]++
        binsB[data[i + 2]]++
    }

    const maxVal = Math.max(
        Math.max(...binsR),
        Math.max(...binsG),
        Math.max(...binsB)
    )

    const w = histCanvas.width
    const h = histCanvas.height
    const scale = h / maxVal

    for (let i = 0; i < 256; i++) {
        const x = (i / 256) * w

        histCtx.fillStyle = "red"
        histCtx.fillRect(x, h, w / 256, -binsR[i] * scale)

        histCtx.fillStyle = "green"
        histCtx.fillRect(x, h, w / 256, -binsG[i] * scale)
        
        histCtx.fillStyle = "blue"
        histCtx.fillRect(x, h, w / 256, -binsB[i] * scale)
    }
}
