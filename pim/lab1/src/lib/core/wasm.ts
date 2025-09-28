
// const wasm = await import('$lib/imglibrs/pkg/imglibrs.js')

let wasm: any = null

export async function initWasm() {
    if (!wasm) {
        const wasmUrl = '/pkg/imglibrs.js'
        wasm = await import(/* @vite-ignore */ wasmUrl)
    }

    return wasm
}


export async function applyFiltersWasm(
    imageData: ImageData,
    brightness: number,
    contrast: number,
    saturation: number,
    grayscale: boolean
): Promise<ImageData> {
    if (!wasm) await initWasm()

    const data = new Uint8Array(imageData.data)
    
    wasm.process_image(data, brightness, contrast, saturation, grayscale)
    return new ImageData(new Uint8ClampedArray(data), imageData.width, imageData.height)
}

export function rotate90Wasm(imageData: ImageData): ImageData {
    const rotated = wasm.rotate90(new Uint8Array(imageData.data), imageData.width, imageData.height)

    return new ImageData(
        new Uint8ClampedArray(rotated),
        imageData.height,
        imageData.width
    )
}

export function applyKernelWasm(
    imageData: ImageData,
    kernel: Float32Array,
    kW: number,
    kH: number
): ImageData {
    const out = wasm.apply_kernel(new Uint8Array(imageData.data), imageData.width, imageData.height, kernel, kW, kH)
    return new ImageData(new Uint8ClampedArray(out), imageData.width, imageData.height)
}

export function applyMedianWasm(
    imageData: ImageData,
    kSize: number
): ImageData {
    const out = wasm.apply_median(new Uint8Array(imageData.data), imageData.width, imageData.height, kSize)
    return new ImageData(new Uint8ClampedArray(out), imageData.width, imageData.height)
}   

export function sharpenWasm(imageData: ImageData): ImageData {
    const out = wasm.sharpen(new Uint8Array(imageData.data), imageData.width, imageData.height)
    return new ImageData(new Uint8ClampedArray(out), imageData.width, imageData.height)
}

export function motionBlurWasm(imageData: ImageData): ImageData {
    const out = wasm.motion_blur(new Uint8Array(imageData.data), imageData.width, imageData.height)
    return new ImageData(new Uint8ClampedArray(out), imageData.width, imageData.height)
}

export function embossWasm(imageData: ImageData): ImageData {
    const out = wasm.emboss(new Uint8Array(imageData.data), imageData.width, imageData.height)
    return new ImageData(new Uint8ClampedArray(out), imageData.width, imageData.height)
}

export function erosionWasm(
    imageData: ImageData,
    se: Int32Array,
    seW: number,
    seH: number
): ImageData {
    const out = wasm.erosion(new Uint8Array(imageData.data), imageData.width, imageData.height, se, seW, seH)
    return new ImageData(new Uint8ClampedArray(out), imageData.width, imageData.height)
}

export function dilationWasm(
    imageData: ImageData,
    se: Int32Array,
    seW: number,
    seH: number
): ImageData {
    const out = wasm.dilation(new Uint8Array(imageData.data), imageData.width, imageData.height, se, seW, seH)
    return new ImageData(new Uint8ClampedArray(out), imageData.width, imageData.height)
}

export function openingWasm(
    imageData: ImageData,
    se: Int32Array,
    seW: number,
    seH: number
): ImageData {
    const out = wasm.opening(new Uint8Array(imageData.data), imageData.width, imageData.height, se, seW, seH)
    return new ImageData(new Uint8ClampedArray(out), imageData.width, imageData.height)
}

export function closingWasm(
    imageData: ImageData,
    se: Int32Array,
    seW: number,
    seH: number
): ImageData {
    const out = wasm.closing(new Uint8Array(imageData.data), imageData.width, imageData.height, se, seW, seH)
    return new ImageData(new Uint8ClampedArray(out), imageData.width, imageData.height)
}

export function gradientWasm(
    imageData: ImageData,
    se: Int32Array,
    seW: number,
    seH: number
): ImageData {
    const out = wasm.gradient(new Uint8Array(imageData.data), imageData.width, imageData.height, se, seW, seH)
    return new ImageData(new Uint8ClampedArray(out), imageData.width, imageData.height)
}

export function cylinderWasm(
    imageData: ImageData,
    se: Int32Array,
    seW: number,
    seH: number
): ImageData {
    const out = wasm.cylinder(new Uint8Array(imageData.data), imageData.width, imageData.height, se, seW, seH)
    return new ImageData(new Uint8ClampedArray(out), imageData.width, imageData.height)
}

export function blackhatWasm(
    imageData: ImageData,
    se: Int32Array,
    seW: number,
    seH: number
): ImageData {
    const out = wasm.blackhat(new Uint8Array(imageData.data), imageData.width, imageData.height, se, seW, seH)
    return new ImageData(new Uint8ClampedArray(out), imageData.width, imageData.height)
}



