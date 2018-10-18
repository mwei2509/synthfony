const allIds = [];
export const generateIdWithPrefix = (prefix) => {
	var timestamp = new Date().getTime();
	var rand = getRandomInt(1,9999);
	var uniqueId = prefix.toString() + timestamp.toString() + rand.toString();
	if (idNotUnique(uniqueId)) {
		// try again
		return generateIdWithPrefix(prefix);
	}
	allIds.push(uniqueId);
	return uniqueId;
}

function idNotUnique(id) {
	return allIds.includes(id);
}

export const getRandomInt = (min, max) => {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

export const updateArrayAt = (array, index, updatedVal) => {
	return [...array.slice(0, index), updatedVal, ...array.slice(index+1)]
}

export const getTimeInMs = () => {
	return Number(new Date());
}

export const getTimeSinceMs = (origTime) => {
	var newTime = getTimeInMs();
	return getTimeDiffMs(origTime, newTime);
}

export const getTimeDiffMs = (origTime, newTime) => {
	return newTime - origTime;
}

export const isObject = (obj) => {
	return obj !== null && typeof obj === 'object' && !Array.isArray(obj);
}