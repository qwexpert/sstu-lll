use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn rotate90(data: &[u8], width: usize, height: usize) -> Vec<u8> {
    let mut out = vec![0u8; data.len()];
    for y in 0..height {
        for x in 0..width {
            let src = (y * width + x) * 4;
            let dst = (x * height + (height - y - 1)) * 4;
            out[dst..dst + 4].copy_from_slice(&data[src..src + 4]);
        }
    }
    out
}
