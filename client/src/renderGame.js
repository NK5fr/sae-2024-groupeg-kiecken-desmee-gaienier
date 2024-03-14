import { socket } from './main.js';
import { renderEntities } from './renderEntity.js';
import { renderMissilesHitbox } from './renderMissiles.js';
import renderPlayer, { renderHealthBar } from './renderPlayer.js';
import renderStage, { renderStageProgressionBar } from './renderStage.js';

export const canvas = document.querySelector('.gameCanvas'),
	context = canvas.getContext('2d'),
	canvasResizeObserver = new ResizeObserver(() => {
		resampleCanvas();
	});

let gameRenderer = null;
let game = null;

canvasResizeObserver.observe(canvas);

function resampleCanvas() {
	canvas.width = canvas.clientWidth;
	canvas.height = canvas.clientHeight;
	socket.emit('canvasResampled', {
		width: canvas.width,
		height: canvas.height,
	});
}

export default function startGameRenderer() {
	gameRenderer = requestAnimationFrame(renderGame);
}

function renderGame() {
	if (!game.gameNotFocused) {
		context.clearRect(0, 0, game.width, game.height);
		renderStage(game.stage, context, canvas);

		//gameInstance.stage.renderAngels(context);
		renderPlayer(game.mainPlayer, context);
		game.otherPlayers.forEach(player => {
			renderPlayer(player, context);
		});

		renderStageProgressionBar(game.stage, context, canvas);
		renderHealthBar(game.mainPlayer, context, canvas);
		socket.emit('gameRendered', game);
		if (game.debug) {
			renderMissilesHitbox(game.mainPlayer.missiles, context);
			game.otherPlayers.forEach(player => {
				renderMissilesHitbox(player.missiles, context);
			});
		}
	}
	gameRenderer = requestAnimationFrame(renderGame);
}

export function setGame(gameInstance) {
	game = gameInstance;
}

export function stopGameRenderer() {
	cancelAnimationFrame(gameRenderer);
}
