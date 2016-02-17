import { setupCanvas } from 'webgl-video-renderer';

export default class PlayerController {

  /**
   * Ctor
   *
   * @param {{}} wcjs
   * @param {DOMNode} canvas
   * @param {number} volume
   */
  constructor(wcjs, canvas, volume = 100) {
    this.canvas = canvas;
    this.renderContext = this._createRenderContext(canvas);

    this.video = wcjs.createPlayer();
    this.audio = wcjs.createPlayer();
    this.volume = volume;

    this.videoFrameSize = false;
    this.isExternalAudio = false;
    this.externalAudioOffset = 0;

    this._registerOnFrameHandler();
    this._registerOnFrameSetupHandler();
  }

  /**
   * Set external audio track time offset
   *
   * @param {number} offset
   */
  setExternalAudioOffset(offset) {
    this.externalAudioOffset = offset;

    if (this.isExternalAudio) {
      this.audio.time += offset;
    }
  }

  /**
   * Set media to play
   *
   * @param {string} videoPath
   * @param {string|boolean} audioPath
   * @param {[number, number]} videoFrameSize
   */
  setMedia({videoPath, audioPath = false, videoFrameSize = false}) {
    this.videoFrameSize = videoFrameSize;

    this.video.playlist.clear();
    this.audio.playlist.clear();

    this.video.playlist.add(videoPath);

    this.isExternalAudio = !!audioPath;
    this.isExternalAudio && this.audio.playlist.add(audioPath);

    this.setVolume(this.volume);
  }

  /**
   * Sets playback time
   *
   * @param {number} time in milliseconds
   */
  setTime(time) {
    this.video.time = time;

    if (this.isExternalAudio) {
      this.audio.time = this.video.time + this.externalAudioOffset;
    }
  }

  /**
   * Sets volume
   *
   * @param {number} volume between 0 and 100
   */
  setVolume(volume) {
    this.volume = volume;

    if (this.isExternalAudio) {
      this.audio.volume = this.volume;
      this.video.volume = 0;
    } else {
      this.video.volume = this.volume;
      this.audio.volume = 0;
    }
  }

  /**
   * Continue playback
   */
  play() {
    this.video.play();
    this.isExternalAudio && this.audio.play();
  }

  /**
   * Pause playback
   */
  pause() {
    this.video.pause();
    this.isExternalAudio && this.audio.pause();
  }

  /**
   * Stops playback
   */
  stop() {
    this.video.stop();
    this.isExternalAudio && this.audio.stop();
  }

  /**
   * Toggles pause/play of playback
   */
  togglePause() {
    this.video.togglePause();
    this.isExternalAudio && this.audio.togglePause();
  }

  /**
   * Draws black frame on the canvas
   */
  drawBlackFrame() {
    this.renderContext.fillBlack();
  }

  /**
   * Register callback to fire on video length change
   *
   * @param cb
   */
  registerOnLengthHandler(cb) {
    this.video.onLengthChanged = cb;
  }

  /**
   * Register callback to fire each time playback time change
   *
   * @callback cb
   */
  registerOnTimeChangeHandler(cb) {
    this.video.onTimeChanged = cb;
  }

  /**
   * Register callback to fire on video end
   *
   * @callback cb
   */
  registerOnEndReachedHandler(cb) {
    this.video.onEndReached = cb;
  }

  /**
   * Creates WebGL render context
   *
   * @param canvasElement
   * @returns {*}
   * @private
   */
  _createRenderContext(canvasElement) {
    return setupCanvas(canvasElement, {
      preserveDrawingBuffer: true
    });
  }

  /**
   * Handles frame setup event to define video frame dimensions
   *
   * @private
   */
  _registerOnFrameSetupHandler() {
    this.video.onFrameSetup = (frameWidth, frameHeight) => {
      if (this.videoFrameSize === false) {
        this.videoFrameSize = [frameWidth, frameHeight];
        this._resizeCanvas();
      }
    };
  }

  /**
   * Handles new frame came from video player
   *
   * @private
   */
  _registerOnFrameHandler() {
    const gl = this.renderContext.gl;

    this.video.onFrameReady = frame => {
      if (this.canvasWasResized) {
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

        this.canvasWasResized = false;
      }

      gl.y.fill(frame.width, frame.height, frame.subarray(0, frame.uOffset));
      gl.u.fill(frame.width >> 1, frame.height >> 1, frame.subarray(frame.uOffset, frame.vOffset));
      gl.v.fill(frame.width >> 1, frame.height >> 1, frame.subarray(frame.vOffset, frame.length));

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    window.addEventListener('resize', ::this._resizeCanvas);
  }

  /**
   * Properly resize canvas
   *
   * @private
   */
  _resizeCanvas() {
    const windowRatio = window.outerWidth / window.outerHeight;
    const frameRatio = this.videoFrameSize[0] / this.videoFrameSize[1];

    let canvasWidth = 0;
    let canvasHeight = 0;

    if (windowRatio > frameRatio) {
      canvasHeight = window.outerHeight;
      canvasWidth = Math.ceil(canvasHeight * frameRatio);
    } else {
      canvasWidth = window.outerWidth;
      canvasHeight = Math.ceil(canvasWidth / frameRatio);
    }

    this.canvas.width = canvasWidth;
    this.canvas.height = canvasHeight;

    this.canvasWasResized = true
  }
}