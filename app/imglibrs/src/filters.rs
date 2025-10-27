use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn process_image(
    data: &mut [u8],
    brightness: f32,
    contrast: f32,
    saturation: f32,
    grayscale: bool,
) {
    for i in (0..data.len()).step_by(4) {
        let mut r = data[i] as f32;
        let mut g = data[i + 1] as f32;
        let mut b = data[i + 2] as f32;

        if grayscale {
            let avg = (r + g + b) / 3.0;
            r = avg;
            g = avg;
            b = avg;
        }

        r *= brightness / 100.0;
        g *= brightness / 100.0;
        b *= brightness / 100.0;

        r = (r - 128.0) * (contrast / 100.0) + 128.0;
        g = (g - 128.0) * (contrast / 100.0) + 128.0;
        b = (b - 128.0) * (contrast / 100.0) + 128.0;

        let avg = (r + g + b) / 3.0;
        r = avg + (r - avg) * (saturation / 100.0);
        g = avg + (g - avg) * (saturation / 100.0);
        b = avg + (b - avg) * (saturation / 100.0);

        data[i] = r.max(0.0).min(255.0) as u8;
        data[i + 1] = g.max(0.0).min(255.0) as u8;
        data[i + 2] = b.max(0.0).min(255.0) as u8;
    }
}
