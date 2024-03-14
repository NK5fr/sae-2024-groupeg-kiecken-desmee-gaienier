import { socket } from './main.js';

const canvas = document.querySelector('.gameCanvas'),
	context = canvas.getContext('2d'),
	canvasResizeObserver = new ResizeObserver(() => {
		socket.emit('canvasResize', {
			width: canvas.width,
			height: canvas.height,
		});
		resampleCanvas();
	});

canvasResizeObserver.observe(canvas);

function resampleCanvas() {
	console.log('Resampling canvas');
	canvas.width = canvas.clientWidth;
	canvas.height = canvas.clientHeight;
}

export default function renderGame(gameInstance) {
	if (!gameInstance.gameNotFocused) {
		console.log('Rendering game');
		context.clearRect(
			0,
			0,
			gameInstance.canvas.width,
			gameInstance.canvas.height
		);
		gameInstance.stage.renderBackground(context);
		gameInstance.stage.renderProgressionBar(
			gameInstance.context,
			gameInstance.canvas
		);
		gameInstance.player.forEach(player =>
			player.renderHealthBar(context, canvas.height)
		);
		gameInstance.stage.renderAngels(context);
		gameInstance.player.forEach(player => {
			if (player.health > 0) {
				player.render(context);
				player.missiles.forEach(missile => missile.render(context));
			}
		});
		if (gameInstance.debug) gameInstance.drawAllHitboxes();
	}
	gameInstance.gameRenderer = requestAnimationFrame(() => {
		renderGame(gameInstance);
	});
}
