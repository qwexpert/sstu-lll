

//@ts-ignore
import init, { process_image, rotate90, apply_kernel, apply_median, sharpen, motion_blur, emboss, erosion, dilation, opening, closing, gradient, cylinder, blackhat } from '$lib/pkg/imglibrs.js'

export function initWasm() {
    return init()
}

export function applyFiltersWasm(
    imageData: ImageData,
    brightness: number,
    contrast: number,
    saturation: number,
    grayscale: boolean
): ImageData {

    const data = new Uint8Array(imageData.data)
    
    process_image(data, brightness, contrast, saturation, grayscale)
    return new ImageData(new Uint8ClampedArray(data), imageData.width, imageData.height)
}

export function rotate90Wasm(imageData: ImageData): ImageData {
    const rotated = rotate90(new Uint8Array(imageData.data), imageData.width, imageData.height)

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
    const out = apply_kernel(new Uint8Array(imageData.data), imageData.width, imageData.height, kernel, kW, kH)
    return new ImageData(new Uint8ClampedArray(out), imageData.width, imageData.height)
}

export function applyMedianWasm(
    imageData: ImageData,
    kSize: number
): ImageData {
    const out = apply_median(new Uint8Array(imageData.data), imageData.width, imageData.height, kSize)
    return new ImageData(new Uint8ClampedArray(out), imageData.width, imageData.height)
}   

export function sharpenWasm(imageData: ImageData): ImageData {
    const out = sharpen(new Uint8Array(imageData.data), imageData.width, imageData.height)
    return new ImageData(new Uint8ClampedArray(out), imageData.width, imageData.height)
}

export function motionBlurWasm(imageData: ImageData): ImageData {
    const out = motion_blur(new Uint8Array(imageData.data), imageData.width, imageData.height)
    return new ImageData(new Uint8ClampedArray(out), imageData.width, imageData.height)
}

export function embossWasm(imageData: ImageData): ImageData {
    const out = emboss(new Uint8Array(imageData.data), imageData.width, imageData.height)
    return new ImageData(new Uint8ClampedArray(out), imageData.width, imageData.height)
}

export function erosionWasm(
    imageData: ImageData,
    se: Int32Array,
    seW: number,
    seH: number
): ImageData {
    const out = erosion(new Uint8Array(imageData.data), imageData.width, imageData.height, se, seW, seH)
    return new ImageData(new Uint8ClampedArray(out), imageData.width, imageData.height)
}

export function dilationWasm(
    imageData: ImageData,
    se: Int32Array,
    seW: number,
    seH: number
): ImageData {
    const out = dilation(new Uint8Array(imageData.data), imageData.width, imageData.height, se, seW, seH)
    return new ImageData(new Uint8ClampedArray(out), imageData.width, imageData.height)
}

export function openingWasm(
    imageData: ImageData,
    se: Int32Array,
    seW: number,
    seH: number
): ImageData {
    const out = opening(new Uint8Array(imageData.data), imageData.width, imageData.height, se, seW, seH)
    return new ImageData(new Uint8ClampedArray(out), imageData.width, imageData.height)
}

export function closingWasm(
    imageData: ImageData,
    se: Int32Array,
    seW: number,
    seH: number
): ImageData {
    const out = closing(new Uint8Array(imageData.data), imageData.width, imageData.height, se, seW, seH)
    return new ImageData(new Uint8ClampedArray(out), imageData.width, imageData.height)
}

export function gradientWasm(
    imageData: ImageData,
    se: Int32Array,
    seW: number,
    seH: number
): ImageData {
    const out = gradient(new Uint8Array(imageData.data), imageData.width, imageData.height, se, seW, seH)
    return new ImageData(new Uint8ClampedArray(out), imageData.width, imageData.height)
}

export function cylinderWasm(
    imageData: ImageData,
    se: Int32Array,
    seW: number,
    seH: number
): ImageData {
    const out = cylinder(new Uint8Array(imageData.data), imageData.width, imageData.height, se, seW, seH)
    return new ImageData(new Uint8ClampedArray(out), imageData.width, imageData.height)
}

export function blackhatWasm(
    imageData: ImageData,
    se: Int32Array,
    seW: number,
    seH: number
): ImageData {
    const out = blackhat(new Uint8Array(imageData.data), imageData.width, imageData.height, se, seW, seH)
    return new ImageData(new Uint8ClampedArray(out), imageData.width, imageData.height)
}



