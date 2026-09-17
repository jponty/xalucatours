/* PCM16 capture only: never play back microphone input. */
class XalucaVoiceRecorder extends AudioWorkletProcessor {
  constructor() {
    super();
    this.buffer = new Int16Array(2048);
    this.offset = 0;
    this.frames = 0;
    this.finished = false;
    this.port.onmessage = ({ data }) => {
      if (data === "stop") this.finish("stopped");
    };
  }

  flush() {
    if (!this.offset) return;
    const chunk = this.buffer.slice(0, this.offset);
    this.port.postMessage({ type: "samples", buffer: chunk.buffer }, [chunk.buffer]);
    this.offset = 0;
  }

  finish(type) {
    if (this.finished) return;
    this.finished = true;
    this.flush();
    this.port.postMessage({ type });
  }

  process(inputs) {
    if (this.finished) return false;
    const input = inputs[0]?.[0];
    if (!input) return true;
    for (const value of input) {
      const sample = Math.max(-1, Math.min(1, value));
      this.buffer[this.offset++] = Math.round(sample * (sample < 0 ? 32768 : 32767));
      this.frames += 1;
      if (this.offset === this.buffer.length) this.flush();
      if (this.frames >= sampleRate * 120) {
        this.finish("limit");
        return false;
      }
    }
    return true;
  }
}

registerProcessor("xaluca-voice-recorder", XalucaVoiceRecorder);
