const background = new Image();
let backgroundX = 0;

export default function renderStage(stage, context) {
	background.src = stage.background;
	backgroundX -= 1;
	if (backgroundX <= -background.width) {
		backgroundX = -1;
	}
	context.drawImage(background, backgroundX, 0);
	context.drawImage(background, backgroundX + background.width, 0);
	//stage.angels.forEach(angel => angel.render(context));
}

export function renderStageProgressionBar(stage, context, canvas) {
	context.beginPath();
	context.rect((canvas.width / 4) * 3.5 - 150, 10, 300, 20);
	context.strokeStyle = 'black';
	context.lineWidth = 2;
	context.stroke();
	context.fillStyle = calculateCurrentColorBasedOnProgression(stage);
	context.fillRect(
		(canvas.width / 4) * 3 - 150,
		10,
		(stage.numberOfAngelsKilled / stage.numberOfAngels) * 300,
		20
	);
}

function calculateCurrentColorBasedOnProgression(stage) {
	let green = (stage.numberOfAngelsKilled / stage.numberOfAngels) * 240;
	let red = 240 - green;
	return `rgb(${red}, ${green}, 0)`;
}
