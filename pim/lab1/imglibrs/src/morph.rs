use wasm_bindgen::prelude::*;

fn apply_struct_elem(data: &[u8], width: usize, height: usize, se: &[i32], se_w: usize, se_h: usize, op: fn(Vec<u8>) -> u8) -> Vec<u8> {
    let mut out = vec![0u8; data.len()];
    let offset_x = se_w as isize / 2;
    let offset_y = se_h as isize / 2;

    for y in 0..height {
        for x in 0..width {
            let mut neighborhood = Vec::new();

            for j in 0..se_h {
                for i in 0..se_w {
                    if se[j * se_w + i] == 1 {
                        let nx = x as isize + i as isize - offset_x;
                        let ny = y as isize + j as isize - offset_y;
                        if nx >= 0 && nx < width as isize && ny >= 0 && ny < height as isize {
                            let idx = (ny as usize * width + nx as usize) * 4;
                            neighborhood.push(data[idx]);
                        }
                    }
                }
            }

            let val = if neighborhood.is_empty() { data[(y * width + x) * 4] } else { op(neighborhood) };
            let idx = (y * width + x) * 4;
            out[idx] = val;
            out[idx + 1] = val;
            out[idx + 2] = val;
            out[idx + 3] = 255;
        }
    }
    out
}

#[wasm_bindgen]
pub fn erosion(data: &[u8],width: usize, height: usize, se: &[i32], se_w: usize, se_h: usize) -> Vec<u8> {
    apply_struct_elem(data, width, height, se, se_w, se_h, |v| *v.iter().min().unwrap())
}

#[wasm_bindgen]
pub fn dilation(data: &[u8], width: usize, height: usize, se: &[i32], se_w: usize, se_h: usize) -> Vec<u8> {
    apply_struct_elem(data, width, height, se, se_w, se_h, |v| *v.iter().max().unwrap())
}

#[wasm_bindgen]
pub fn opening(data: &[u8], width: usize, height: usize, se: &[i32], se_w: usize, se_h: usize) -> Vec<u8> {
    let eroded = erosion(data, width, height, se, se_w, se_h);
    dilation(&eroded, width, height, se, se_w, se_h)
}

#[wasm_bindgen]
pub fn closing(data: &[u8], width: usize, height: usize, se: &[i32], se_w: usize, se_h: usize) -> Vec<u8> {
    let dilated = dilation(data, width, height, se, se_w, se_h);
    erosion(&dilated, width, height, se, se_w, se_h)
}

#[wasm_bindgen]
pub fn gradient(data: &[u8], width: usize, height: usize, se: &[i32], se_w: usize, se_h: usize) -> Vec<u8> {
    let dil = dilation(data, width, height, se, se_w, se_h);
    let ero = erosion(data, width, height, se, se_w, se_h);
    dil.iter().zip(ero.iter()).map(|(d, e)| d.saturating_sub(*e)).collect()
}

#[wasm_bindgen]
pub fn cylinder(data: &[u8], width: usize, height: usize, se: &[i32], se_w: usize, se_h: usize) -> Vec<u8> {
    let opened = opening(data, width, height, se, se_w, se_h);
    data.iter().zip(opened.iter()).map(|(o, op)| o.saturating_sub(*op)).collect()
}

#[wasm_bindgen]
pub fn blackhat(data: &[u8], width: usize, height: usize, se: &[i32], se_w: usize, se_h: usize) -> Vec<u8> {
    let closed = closing(data, width, height, se, se_w, se_h);
    closed.iter().zip(data.iter()).map(|(c, o)| c.saturating_sub(*o)).collect()
}

