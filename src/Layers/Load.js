import { SynthFony } from '../utils/variables'
import { generateIdWithPrefix } from '../utils/functions'
import { Player } from './Player';

/* 
	overrides: {
		settings: {}
	}
*/
export const getPlayer = (type, callback, override) => {
	debugger;
	let player = new Player(type, callback, override);
	debugger;
	return SynthFony.Players[generateIdWithPrefix('p')];
}