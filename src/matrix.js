const process = require("process");
const zmq = require("zeromq-ng");

class Matrix {
  constructor({ width, height, endpoint, targetFps = 500 }) {
    this.width = width;
    this.height = height;
    this.endpoint = endpoint;
    this.targetFps = targetFps;

    this._buffer = new Uint8Array(width * height * 4);
  }

  async start(updateFunc) {
    const updateStart = process.hrtime.bigint();

    await updateFunc(this);
    await this.sync();

    const updateTimeMs =
      parseFloat(process.hrtime.bigint() - updateStart) / 1000000;
    const timeoutMs = Math.max(0, 1000 / this.targetFps - updateTimeMs);

    setTimeout(() => {
      this.start(updateFunc);
    }, timeoutMs);
  }

  async connect() {
    this.sock = new zmq.Request();
    return this.sock.connect(this.endpoint);
  }

  async sync() {
    await this.sock.send(this._buffer);
    return this.sock.receive();
  }

  setPixel(x, y, r, g, b) {
    const i = (x + y * this.width) * 4;
    this._buffer[i + 0] = Math.min(1, Math.max(0, b)) * 255;
    this._buffer[i + 1] = Math.min(1, Math.max(0, g)) * 255;
    this._buffer[i + 2] = Math.min(1, Math.max(0, r)) * 255;
  }
}

module.exports = Matrix;
