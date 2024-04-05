import { stageChangeEnd } from './renderGame.js';

const stageImages = {};
const transitionBackground = new Image();
transitionBackground.src = 'assets/stage/background/0.png';

let backgroundX = 0;
let previousBackgroundY = 0;
let backgroundY = 0;
let transitionBackgroundY = 0;

export default function renderStage(stage, context) {
	if (!stageImages[stage.name]) {
		stageImages[stage.name] = new Image();
		stageImages[stage.name].src = stage.background;
	}
	const background = stageImages[stage.name];
	backgroundX -= 1;
	if (backgroundX <= -background.width) {
		backgroundX = -1;
	}
	context.drawImage(background, backgroundX, 0);
	context.drawImage(background, backgroundX + background.width, 0);
}

export function renderStageChangement(stage, newStage, context, canvas) {
	const previousBackground = stageImages[stage.name];
	if (!stageImages[newStage.name]) {
		stageImages[newStage.name] = new Image();
		stageImages[newStage.name].src = newStage.background;
	}
	const background = stageImages[newStage.name];
	previousBackgroundY += 8;
	transitionBackgroundY = previousBackgroundY - transitionBackground.height;
	backgroundY = transitionBackgroundY - previousBackground.height;
	context.drawImage(previousBackground, backgroundX, previousBackgroundY);
	context.drawImage(
		previousBackground,
		backgroundX + previousBackground.width,
		previousBackgroundY
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
		previousBackgroundY = 0;
		stageChangeEnd();
	}
}

export function renderStageProgressionBar(stage, context, canvas) {
	const startX = 10;
	const startY = (canvas.width / 4) * 3.5 - 150;

	context.fillStyle = calculateCurrentColorBasedOnProgression(stage);
	context.fillRect(
		startY,
		startX,
		(stage.numberOfAngelsKilled / stage.numberOfAngels) * 300,
		20
	);

	context.beginPath();
	context.rect((canvas.width / 4) * 3.5 - 150, 10, 300, 20);
	context.strokeStyle = 'black';
	context.lineWidth = 3;
	context.stroke();
	context.closePath();

	context.font = '20px Arial';
	context.fillStyle = 'black';
	context.fillText(
		`${stage.numberOfAngelsKilled}/${stage.numberOfAngels}`,
		(canvas.width / 4) * 3.5 - 20,
		27
	);
}

function calculateCurrentColorBasedOnProgression(stage) {
	let green = (stage.numberOfAngelsKilled / stage.numberOfAngels) * 240;
	let red = 240 - green;
	return `rgb(${red}, ${green}, 0)`;
}
