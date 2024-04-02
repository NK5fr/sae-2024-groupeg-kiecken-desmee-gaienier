import fs from 'fs';
import { scoreData } from '../index.js';

export function addScore(username, score) {
	scoreData.push({"user":username, "score":score});
	fs.writeFileSync('server/data/scoreData.json', JSON.stringify(scoreData));
}