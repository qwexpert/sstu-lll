/* tslint:disable */
/* eslint-disable */
export function process_image(data: Uint8Array, brightness: number, contrast: number, saturation: number, grayscale: boolean): void;
export function rotate90(data: Uint8Array, width: number, height: number): Uint8Array;
export function apply_kernel(data: Uint8Array, width: number, height: number, kernel: Float32Array, k_w: number, k_h: number): Uint8Array;
export function sharpen(data: Uint8Array, width: number, height: number): Uint8Array;
export function motion_blur(data: Uint8Array, width: number, height: number): Uint8Array;
export function emboss(data: Uint8Array, width: number, height: number): Uint8Array;
export function apply_median(data: Uint8Array, width: number, height: number, k_size: number): Uint8Array;
export function erosion(data: Uint8Array, width: number, height: number, se: Int32Array, se_w: number, se_h: number): Uint8Array;
export function dilation(data: Uint8Array, width: number, height: number, se: Int32Array, se_w: number, se_h: number): Uint8Array;
export function opening(data: Uint8Array, width: number, height: number, se: Int32Array, se_w: number, se_h: number): Uint8Array;
export function closing(data: Uint8Array, width: number, height: number, se: Int32Array, se_w: number, se_h: number): Uint8Array;
export function gradient(data: Uint8Array, width: number, height: number, se: Int32Array, se_w: number, se_h: number): Uint8Array;
export function cylinder(data: Uint8Array, width: number, height: number, se: Int32Array, se_w: number, se_h: number): Uint8Array;
export function blackhat(data: Uint8Array, width: number, height: number, se: Int32Array, se_w: number, se_h: number): Uint8Array;
