import React, { Component } from 'react';
import './style.css';
import { AudioVis, SynthFony } from '../utils/variables'
import Tone from 'tone'

export default class AudioVisualization extends Component {
	constructor(props) {
		super(props)
		this.canvas = React.createRef();
		this.loop = this.loop.bind(this);
		this.height = 20;
		this.width = 900;
	}
	getContext() {
		let canvas = this.canvas.current;
		if (canvas) {
			return canvas.getContext('2d');
		}
		return false;
	}
	componentDidMount() {
		this.loop();
	}
	drawFFT(values) {
		let canvas = this.canvas.current;
		if (canvas) {			
			let fftContext = canvas.getContext('2d');
			let canvasWidth = this.height0;
			let canvasHeight = 100;
			fftContext.clearRect(0, 0, canvasWidth, canvasHeight);
			var barWidth = canvasWidth / AudioVis.fft.size;
			for (var i = 0, len = values.length; i < len; i++){
				var x = canvasWidth * (i / len);
				var y = (values[i] + 140) * 2;
				fftContext.fillStyle = "rgba(0, 0, 0, " + i/len + ")";
				fftContext.fillRect(x, canvasHeight - y, barWidth, canvasHeight);
			}
		}
	}
	drawWaveForm(values) {
		let canvas = this.canvas.current;
		if (canvas) {			
			let waveContext = canvas.getContext('2d');
			let canvasWidth = this.width;
			let canvasHeight = this.height;
			let waveformGradient = waveContext.createLinearGradient(0, 0, canvasWidth, canvasHeight);
			waveformGradient.addColorStop(0, "#428589");
			waveformGradient.addColorStop(1, "#5698C2");
			waveContext.clearRect(0, 0, canvasWidth, canvasHeight);
			waveContext.beginPath();
			waveContext.lineJoin = "round";
			waveContext.lineWidth = 2;
			waveContext.strokeStyle = waveformGradient;
			waveContext.moveTo(0, (values[0] / 255) * canvasHeight);
			for (var i = 1, len = values.length; i < len; i++){
				var val = (values[i] + 1) / 2;
				var x = canvasWidth * (i / len);
				var y = val * canvasHeight;
				waveContext.lineTo(x, y);
			}
			waveContext.stroke();
		}
	}
	drawMeter() {
		if (this.context) {			
			let { player } = this.props.layer;
			let meter = player.meter;
			let level = meter.getLevel();
			level = Tone.dbToGain(level);
			this.context.clearRect(0,0,this.width,this.height);
			this.context.fillStyle = this.gradient;
			this.context.fillRect(0,0,this.width,this.height);
			this.context.fillStyle = "white";
			this.context.fillRect(this.width*level, 0, this.width, this.height);
		}
	}
	makeGradient() {
		this.context = this.getContext();
		if (this.context) {			
			this.gradient = this.context.createLinearGradient(0, 0, this.width, this.height);
			this.gradient.addColorStop(0, "#BFFF02");
			this.gradient.addColorStop(0.8, "#02FF24");
			this.gradient.addColorStop(1, "#FF0202");
		}
	}
	loop() {
		window.requestAnimationFrame(this.loop);
		// let fftValues = AudioVis.fft.getValue();
		// this.drawFFT(fftValues);
		// let waveformValues = AudioVis.waveform.getValue();
		// this.drawWaveForm(waveformValues);
		this.makeGradient();
		this.drawMeter();
	}
	render() {
		return <div className="AudioVisualization">
				<canvas width={this.width} height={this.height} ref={this.canvas}/>
			</div>
	}
}