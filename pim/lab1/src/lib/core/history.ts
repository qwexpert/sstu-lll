interface HistoryItem {
    imageData: ImageData
    width: number
    height: number
}

let history: HistoryItem[] = []
let historyIndex = -1

export function pushHistory(imageData: ImageData, width: number, height: number) {
    history = history.slice(0, historyIndex + 1)
    history.push({ imageData, width, height })
    historyIndex++
}

export function undo(): HistoryItem | null {
    if (historyIndex <= 0) return null

    historyIndex--

    return history[historyIndex]
}

export function resetHistory(imageData: ImageData, width: number, height: number) {
    history = [{ imageData, width, height }]

    historyIndex = 0
}

export function getCurrent(): HistoryItem | null {
    if (historyIndex < 0 || historyIndex >= history.length) return null
    
    return history[historyIndex]
}
