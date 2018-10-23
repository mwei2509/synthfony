import React, { Component } from 'react';
import RouteHandler from './RouteHandler';
import './App.css';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faSave, faPlay, faPause, faPlayCircle, 
	faPauseCircle, faPlus, faArrowCircleDown, 
	faArrowCircleUp, faTrash, faMusic, faTimes,
	faArrowRight, faBars } from '@fortawesome/free-solid-svg-icons'
import { AudioVis } from './utils/variables'
import Tone from 'tone'

AudioVis.meter = new Tone.Meter();
AudioVis.fft = new Tone.FFT(32);
AudioVis.waveform = new Tone.Waveform(1024);
library.add(faSave, faPlay, faPause, faPlayCircle, faPauseCircle, 
	faPlus, faArrowCircleDown, faArrowCircleUp, faTrash, faMusic, faTimes,
	faArrowRight, faBars)

class App extends Component {
  render() {
    return (
      <div className="App">
	  	<RouteHandler location={this.props.location} />
      </div>
    );
  }
}

export default App;
