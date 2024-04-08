import { readFileSync, writeFileSync } from 'fs';

export function scoreManager(socket) {
	socket.on('client send score', ({ userName, time }) => {
		addScore(userName, time);
	});

	socket.on('client need scores', () => {
		const scoresData = readScoresData();
		socket.emit('server send scores', scoresData);
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
