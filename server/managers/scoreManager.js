import fs from 'fs';
import { scoreData } from '../index.js';

export function addScore(username, score) {
	scoreData.push({"user":username, "score":score});
	fs.writeFileSync('server/data/scoreData.json', JSON.stringify(scoreData));
}

export function scoreManager(socket, scoreData){

    socket.on('score', data => {
        addScore(data.user, data.time);
        socket.emit('setScore', {
			"scores": scoreData
		});
	});

    socket.on('setScore', () => {
		socket.emit('setScore', {
			"scores": scoreData
		});
	});
}