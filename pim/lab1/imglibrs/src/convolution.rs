use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn apply_kernel(data: &[u8], width: usize, height: usize, kernel: &[f32], k_w: usize, k_h: usize) -> Vec<u8> {
    let mut out = vec![0u8; data.len()];
    let offset_x = k_w as isize / 2;
    let offset_y = k_h as isize / 2;

    for y in 0..height {
        for x in 0..width {
            let mut r = 0.0;
            let mut g = 0.0;
            let mut b = 0.0;

            for j in 0..k_h {
                for i in 0..k_w {
                    let nx = x as isize + i as isize - offset_x;
                    let ny = y as isize + j as isize - offset_y;
                    if nx >= 0 && nx < width as isize && ny >= 0 && ny < height as isize {
                        let idx = (ny as usize * width + nx as usize) * 4;
                        let k = kernel[j * k_w + i];
                        r += data[idx] as f32 * k;
                        g += data[idx + 1] as f32 * k;
                        b += data[idx + 2] as f32 * k;
                    }
                }
            }

            let idx = (y * width + x) * 4;
            out[idx] = r.max(0.0).min(255.0) as u8;
            out[idx + 1] = g.max(0.0).min(255.0) as u8;
            out[idx + 2] = b.max(0.0).min(255.0) as u8;
            out[idx + 3] = 255;
        }
    }
    out
}

#[wasm_bindgen]
pub fn sharpen(data: &[u8], width: usize, height: usize) -> Vec<u8> {
    let kernel: [f32; 9] = [0.0, -1.0, 0.0, -1.0, 5.0, -1.0, 0.0, -1.0, 0.0];

    apply_kernel(data, width, height, &kernel, 3, 3)
}

#[wasm_bindgen]
pub fn motion_blur(data: &[u8], width: usize, height: usize) -> Vec<u8> {
    let kernel: [f32; 9] = [1.0/9.0, 0.0, 0.0, 0.0, 1.0/9.0, 0.0, 0.0, 0.0, 1.0/9.0];

    apply_kernel(data, width, height, &kernel, 3, 3)
}

#[wasm_bindgen]
pub fn emboss(data: &[u8], width: usize, height: usize) -> Vec<u8> {
    let kernel: [f32; 9] = [-2.0, -1.0, 0.0, -1.0, 1.0, 1.0, 0.0, 1.0, 2.0];

    apply_kernel(data, width, height, &kernel, 3, 3)
}

#[wasm_bindgen]
pub fn apply_median(data: &[u8], width: usize, height: usize, k_size: usize) -> Vec<u8> {
    let mut out = vec![0u8; data.len()];
    let offset = (k_size / 2) as isize;

    for y in 0..height {
        for x in 0..width {
            let mut r_vals = Vec::new();
            let mut g_vals = Vec::new();
            let mut b_vals = Vec::new();

            for j in -(offset)..=(offset) {
                for i in -(offset)..=(offset) {
                    let nx = x as isize + i;
                    let ny = y as isize + j;
                    if nx >= 0 && nx < width as isize && ny >= 0 && ny < height as isize {
                        let idx = (ny as usize * width + nx as usize) * 4;
                        r_vals.push(data[idx]);
                        g_vals.push(data[idx + 1]);
                        b_vals.push(data[idx + 2]);
                    }
                }
            }

            r_vals.sort();
            g_vals.sort();
            b_vals.sort();
            let mid = r_vals.len() / 2;

            let idx = (y * width + x) * 4;
            out[idx] = r_vals[mid];
            out[idx + 1] = g_vals[mid];
            out[idx + 2] = b_vals[mid];
            out[idx + 3] = 255;
        }
    }
    out
}

