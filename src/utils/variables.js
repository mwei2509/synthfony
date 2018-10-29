import Tone from 'tone';
export const AudioVis = {
	meter: null,
	fft: null,
	waveform: null
};

export const SynthFony = {
	Recipes: {},
	Tracks: {}, // by id
	Effects: {},
	Visuals: {
		meter: new Tone.Meter(),
		fft: new Tone.FFT(32),
		waveform: new Tone.Waveform(1024),
	}
};

export const API_URL = (window.location.hostname.indexOf('localhost') > -1) ? process.env.REACT_APP_API_URL : process.env.REACT_APP_API_URL_PROD;
export const BASE_URL = (window.location.hostname.indexOf('localhost') > -1) ? process.env.REACT_APP_BASE_URL : process.env.REACT_APP_BASE_URL_PROD;
