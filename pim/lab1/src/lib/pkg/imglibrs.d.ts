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

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly process_image: (a: number, b: number, c: any, d: number, e: number, f: number, g: number) => void;
  readonly rotate90: (a: number, b: number, c: number, d: number) => [number, number];
  readonly apply_kernel: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number) => [number, number];
  readonly sharpen: (a: number, b: number, c: number, d: number) => [number, number];
  readonly motion_blur: (a: number, b: number, c: number, d: number) => [number, number];
  readonly emboss: (a: number, b: number, c: number, d: number) => [number, number];
  readonly apply_median: (a: number, b: number, c: number, d: number, e: number) => [number, number];
  readonly erosion: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number) => [number, number];
  readonly dilation: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number) => [number, number];
  readonly opening: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number) => [number, number];
  readonly closing: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number) => [number, number];
  readonly gradient: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number) => [number, number];
  readonly cylinder: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number) => [number, number];
  readonly blackhat: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number) => [number, number];
  readonly __wbindgen_export_0: WebAssembly.Table;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
  readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
*
* @returns {InitOutput}
*/
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
