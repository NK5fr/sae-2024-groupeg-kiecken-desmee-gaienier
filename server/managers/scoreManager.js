import { readFileSync, writeFileSync } from 'fs';
import { io } from '../index.js';

export function scoreManager(socket) {
	socket.on('client send score', ({ userName, formatedTime }) => {
		addScore(userName, formatedTime);
	});

	socket.on('client need scores', () => {
		const scoresData = readScoresData();
		io.emit('server send scores', scoresData);
	});
}

function addScore(userName, score) {
	const scoresData = readScoresData();
	scoresData.push({ userName, score });
	writeScoresData(scoresData);
}

function readScoresData() {
	return JSON.parse(readFileSync('server/data/scoresData.json', 'utf8'));
}

function writeScoresData(scoresData) {
	writeFileSync('server/data/scoresData.json', JSON.stringify(scoresData));
}
