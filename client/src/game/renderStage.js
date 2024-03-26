const background = new Image();
const nameImage = new Image();
let backgroundX = 0;

export default function renderStage(stage, context) {
	background.src = stage.background;
	backgroundX -= 1;
	if (backgroundX <= -background.width) {
		backgroundX = -1;
	}
	context.drawImage(background, backgroundX, 0);
	context.drawImage(background, backgroundX + background.width, 0);
	if (stage.nameImage) {
		nameImage.src = stage.nameImage;
		context.save();
		context.globalAlpha = stage.nameOpacity;
		context.drawImage(nameImage, 10, 10);
		context.restore();
		stage.nameOpacity -= 0.01;
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
