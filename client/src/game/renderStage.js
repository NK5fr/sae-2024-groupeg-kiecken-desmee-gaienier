import { images } from '../main.js';
import { stageChangeEnd } from './renderGame.js';

let backgroundX = 0;

let prevBackgroundY = 0;
let backgroundY = 0;
let transitionBackgroundY = 0;

export function renderStageBackground(stageName, context) {
	const background = images.stages[stageName];
	backgroundX -= 1;
	if (backgroundX <= -background.width) {
		backgroundX = -1;
	}
	context.drawImage(background, backgroundX, 0);
	context.drawImage(background, backgroundX + background.width, 0);
}

export function renderStageTransition(prevStageName, newStageName, context) {
	const previousBackground = images.stages[prevStageName];
	const background = images.stages[newStageName];
	const transitionBackground = images.stages['transition'];

	prevBackgroundY += 8;
	transitionBackgroundY = prevBackgroundY - transitionBackground.height;
	backgroundY = transitionBackgroundY - previousBackground.height;

	context.drawImage(previousBackground, backgroundX, prevBackgroundY);
	context.drawImage(
		previousBackground,
		backgroundX + previousBackground.width,
		prevBackgroundY
	);
	context.drawImage(transitionBackground, backgroundX, transitionBackgroundY);
	context.drawImage(
		transitionBackground,
		backgroundX + transitionBackground.width,
		transitionBackgroundY
	);
	context.drawImage(background, backgroundX, backgroundY);
	context.drawImage(background, backgroundX + background.width, backgroundY);

	if (backgroundY >= 0) {
		prevBackgroundY = 0;
		stageChangeEnd();
	}
}

export function renderStageProgressionBar(stage, context, canvas) {
	const startX = 10;
	const startY = (canvas.width / 4) * 3.5 - 150;

	const progressionFrameWidth = 300;
	const progressionBarWidth =
		(stage.numberOfAngelsKilled / stage.numberOfAngels) * progressionFrameWidth;
	const progressionBarHeight = 20;

	context.fillStyle = calculateCurrentColorBasedOnProgression(stage);
	context.fillRect(startY, startX, progressionBarWidth, progressionBarHeight);

	context.beginPath();
	context.rect(startY, startX, progressionFrameWidth, progressionBarHeight);
	context.strokeStyle = 'black';
	context.lineWidth = 3;
	context.stroke();
	context.closePath();

	context.font = '20px Arial';
	context.fillStyle = 'black';
	context.fillText(
		`${stage.numberOfAngelsKilled}/${stage.numberOfAngels}`,
		startY + 10,
		startX + progressionBarHeight - 2.5
	);
}

function calculateCurrentColorBasedOnProgression(stage) {
	let green = (stage.numberOfAngelsKilled / stage.numberOfAngels) * 240;
	let red = 240 - green;
	return `rgb(${red}, ${green}, 0)`;
}
