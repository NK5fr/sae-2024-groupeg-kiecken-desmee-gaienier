import { readFileSync, writeFileSync } from 'fs';

export function addScore(userName, score) {
	const scoresData = readScoresData();
	scoresData.push({ userName, score });
	writeScoresData(scoresData);
}

function readScoresData() {
	return JSON.parse(readFileSync('server/data/scoresData.json', 'utf8'));
}

function writeScoresData(data) {
	writeFileSync('server/data/scoresData.json', JSON.stringify(data));
}

export function scoreManager(socket) {
	socket.on('score', data => {
		addScore(data.user, data.time);
	});

	socket.on('setScore', () => {
		const scoresData = readScoresData();
		socket.emit('setScore', {
			scores: scoresData,
		});
	});
}
