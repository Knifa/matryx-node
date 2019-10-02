const Matrix = require('./matrix.js');

let t = 0;
let j = 0;

async function plasma(matrix) {
  t += 0.01;
  j += 0.1;

  for (let y = 0; y < matrix.height; y++) {
    for (let x = 0; x < matrix.width; x++) {
      const px = x - matrix.width / 2;
      const py = y - matrix.height / 2;

      let pixel = 1;

      pixel = pixel * Math.sin(0.1 * (px * Math.sin(t / 7)) * 0.5 + t);

      pixel =
        pixel *
        Math.cos(
          0.1 * (px * Math.sin(t / 12) + py * Math.cos(t / 5)) * 0.5 + t
        );

      pixel =
        pixel *
        Math.sin(
          0.05 *
            Math.sqrt(
              (px + 4 * Math.sin(t / 5)) ** 2 +
                (py + 4 * Math.cos(t / 9)) ** 2 +
                1
            ) +
            t
        );

      //pixel = Math.abs(pixel);

      const pixelR = Math.abs((Math.sin(pixel + t) * 0.5 + 0.5) * pixel);
      const pixelG = Math.abs(Math.tan(pixel) * pixel);
      const pixelB = Math.abs(Math.sin(pixel * 2) * pixel);

      matrix.setPixel(x, y, pixelR, pixelG, pixelB);
    }
  }
}

async function run() {
  const matrix = new Matrix({
    width: 128,
    height: 128,
    endpoint: "tcp://10.0.10.47:8182"
  });

  await matrix.connect();
  matrix.start(plasma);
}

run();
