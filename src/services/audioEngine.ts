// Audio Engine Service - Web Audio API processing chain
// Provides EQ, compression, stereo widening, and VU metering

import type { VUData, EQPresets } from '../types';

interface StereoWidener {
  input: ChannelSplitterNode;
  output: ChannelMergerNode;
}

class AudioEngine {
  private audioContext: AudioContext | null = null;
  private sourceNode: MediaElementAudioSourceNode | null = null;
  private gainNode: GainNode | null = null;
  private analyserNode: AnalyserNode | null = null;
  private eqBands: BiquadFilterNode[] = [];
  private compressor: DynamicsCompressorNode | null = null;
  private stereoWidener: StereoWidener | null = null;
  private isInitialized: boolean = false;
  private autoEnhanceEnabled: boolean = true;

  private frequencies: number[] = [60, 230, 910, 4000, 14000];
  private eqValues: number[] = [0, 0, 0, 0, 0];

  private presets: EQPresets = {
    flat: [0, 0, 0, 0, 0],
    bass: [6, 4, 0, 0, 0],
    treble: [0, 0, 0, 3, 6],
    rock: [4, 2, -1, 2, 4],
    jazz: [3, 1, 0, 2, 3],
    electronic: [5, 3, 0, 1, 4],
    classical: [0, 0, 0, 2, 3],
    pop: [1, 3, 4, 2, 0],
    vocal: [-2, 0, 3, 2, 0],
    loudness: [4, 2, 0, 1, 3]
  };

  private currentPreset: string = 'flat';
  private vuCallback: ((data: VUData) => void) | null = null;
  private animationFrameId: number | null = null;

  async init(): Promise<void> {
    if (this.isInitialized) return;

    try {
      this.audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();

      this.gainNode = this.audioContext.createGain();
      this.gainNode.gain.value = 1.0;

      this.analyserNode = this.audioContext.createAnalyser();
      this.analyserNode.fftSize = 256;
      this.analyserNode.smoothingTimeConstant = 0.8;

      this.eqBands = this.frequencies.map((freq, index) => {
        const filter = this.audioContext!.createBiquadFilter();

        if (index === 0) {
          filter.type = 'lowshelf';
        } else if (index === this.frequencies.length - 1) {
          filter.type = 'highshelf';
        } else {
          filter.type = 'peaking';
          filter.Q.value = 1.0;
        }

        filter.frequency.value = freq;
        filter.gain.value = this.eqValues[index];

        return filter;
      });

      this.compressor = this.audioContext.createDynamicsCompressor();
      this.compressor.threshold.value = -24;
      this.compressor.knee.value = 30;
      this.compressor.ratio.value = 4;
      this.compressor.attack.value = 0.003;
      this.compressor.release.value = 0.25;

      this.stereoWidener = this.createStereoWidener();

      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize audio engine:', error);
      throw error;
    }
  }

  private createStereoWidener(): StereoWidener {
    const splitter = this.audioContext!.createChannelSplitter(2);
    const merger = this.audioContext!.createChannelMerger(2);

    const leftDelay = this.audioContext!.createDelay();
    const rightDelay = this.audioContext!.createDelay();

    leftDelay.delayTime.value = 0.003;
    rightDelay.delayTime.value = 0.003;

    const leftGain = this.audioContext!.createGain();
    const rightGain = this.audioContext!.createGain();

    leftGain.gain.value = 0.15;
    rightGain.gain.value = 0.15;

    splitter.connect(leftDelay, 0);
    splitter.connect(rightDelay, 1);

    leftDelay.connect(leftGain);
    rightDelay.connect(rightGain);

    splitter.connect(merger, 0, 0);
    splitter.connect(merger, 1, 1);

    leftGain.connect(merger, 0, 1);
    rightGain.connect(merger, 0, 0);

    return { input: splitter, output: merger };
  }

  connectSource(audioElement: HTMLAudioElement): void {
    if (!this.isInitialized) {
      console.warn('Audio engine not initialized');
      return;
    }

    if (this.audioContext!.state === 'suspended') {
      this.audioContext!.resume();
    }

    if (this.sourceNode) {
      try {
        this.sourceNode.disconnect();
      } catch {
        // Ignore disconnect errors
      }
    }

    try {
      this.sourceNode = this.audioContext!.createMediaElementSource(audioElement);
    } catch {
      console.warn('Audio element already connected to context');
      return;
    }

    this.buildProcessingChain();
  }

  private buildProcessingChain(): void {
    if (!this.sourceNode) return;

    let currentNode: AudioNode = this.sourceNode;

    this.eqBands.forEach(band => {
      currentNode.connect(band);
      currentNode = band;
    });

    if (this.autoEnhanceEnabled && this.compressor && this.stereoWidener) {
      currentNode.connect(this.compressor);
      currentNode = this.compressor;

      currentNode.connect(this.stereoWidener.input);
      currentNode = this.stereoWidener.output;
    }

    currentNode.connect(this.gainNode!);
    this.gainNode!.connect(this.analyserNode!);
    this.analyserNode!.connect(this.audioContext!.destination);
  }

  setVolume(value: number): void {
    if (this.gainNode && this.audioContext) {
      this.gainNode.gain.setValueAtTime(value, this.audioContext.currentTime);
    }
  }

  setEQBand(index: number, gain: number): void {
    if (index >= 0 && index < this.eqBands.length && this.audioContext) {
      this.eqValues[index] = gain;
      this.eqBands[index].gain.setValueAtTime(gain, this.audioContext.currentTime);
    }
  }

  setPreset(presetName: string): void {
    const preset = this.presets[presetName];
    if (preset) {
      this.currentPreset = presetName;
      preset.forEach((gain, index) => {
        this.setEQBand(index, gain);
      });
    }
  }

  toggleAutoEnhance(enabled: boolean): void {
    this.autoEnhanceEnabled = enabled;
    if (this.sourceNode) {
      this.sourceNode.disconnect();
      this.eqBands.forEach(band => band.disconnect());
      if (this.compressor) this.compressor.disconnect();
      if (this.stereoWidener) this.stereoWidener.output.disconnect();
      this.gainNode?.disconnect();
      this.analyserNode?.disconnect();

      this.buildProcessingChain();
    }
  }

  getVUData(): VUData {
    if (!this.analyserNode) return { left: 0, right: 0, average: 0 };

    const bufferLength = this.analyserNode.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    this.analyserNode.getByteFrequencyData(dataArray);

    let sum = 0;
    for (let i = 0; i < bufferLength; i++) {
      sum += dataArray[i];
    }
    const average = sum / bufferLength / 255;

    let lowSum = 0;
    let highSum = 0;
    const midPoint = Math.floor(bufferLength / 2);

    for (let i = 0; i < midPoint; i++) {
      lowSum += dataArray[i];
    }
    for (let i = midPoint; i < bufferLength; i++) {
      highSum += dataArray[i];
    }

    const left = lowSum / midPoint / 255;
    const right = highSum / (bufferLength - midPoint) / 255;

    return { left, right, average, raw: dataArray };
  }

  startVUMeter(callback: (data: VUData) => void): void {
    this.vuCallback = callback;

    const updateVU = (): void => {
      if (this.vuCallback) {
        const vuData = this.getVUData();
        this.vuCallback(vuData);
      }
      this.animationFrameId = requestAnimationFrame(updateVU);
    };

    updateVU();
  }

  stopVUMeter(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    this.vuCallback = null;
  }

  getFrequencyData(): Uint8Array | null {
    if (!this.analyserNode) return null;

    const bufferLength = this.analyserNode.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    this.analyserNode.getByteFrequencyData(dataArray);

    return dataArray;
  }

  getEQValues(): number[] {
    return [...this.eqValues];
  }

  getPresets(): string[] {
    return Object.keys(this.presets);
  }

  getCurrentPreset(): string {
    return this.currentPreset;
  }

  destroy(): void {
    this.stopVUMeter();

    if (this.sourceNode) {
      try {
        this.sourceNode.disconnect();
      } catch { /* ignore */ }
    }

    if (this.audioContext) {
      this.audioContext.close();
    }

    this.isInitialized = false;
  }
}

const audioEngine = new AudioEngine();
export default audioEngine;
