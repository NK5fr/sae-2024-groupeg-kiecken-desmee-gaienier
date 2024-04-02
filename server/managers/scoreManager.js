import { readFileSync, writeFileSync } from 'fs';

export function addScore(username, score) {
	const scoreData = readScoreData();
	scoreData.push({ user: username, score: score });
	writeScoreData(scoreData);
}

function readScoreData() {
	return JSON.parse(readFileSync('server/data/scoreData.json', 'utf8'));
}

function writeScoreData(data) {
	writeFileSync('server/data/scoreData.json', JSON.stringify(data));
}

export function scoreManager(socket, scoreData) {
	socket.on('score', data => {
		addScore(data.user, data.time);
		socket.emit('setScore', {
			scores: scoreData,
		});
	});

	socket.on('setScore', () => {
		socket.emit('setScore', {
			scores: scoreData,
		});
	});
}
