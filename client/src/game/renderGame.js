import { socket } from '../main.js';
import { renderAngels } from './renderAngel.js';
import { renderMissiles, renderMissilesHitbox } from './renderMissiles.js';
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

		renderPlayer(game.mainPlayer, context);
		game.otherPlayers.forEach(player => {
			renderPlayer(player, context);
		});

		renderAngels(game.stage.angels, context);
		game.stage.angels.forEach(angel => {
			if (angel.missiles) renderMissiles(angel.missiles, context);
		});

		renderStageProgressionBar(game.stage, context, canvas);
		renderHealthBar(game.mainPlayer, 0, context, canvas);
		game.otherPlayers.forEach((player, index) => {
			renderHealthBar(player, index + 1, context, canvas);
		});

		if (game.debug) {
			renderMissilesHitbox(game.mainPlayer.missiles, context);
			game.otherPlayers.forEach(player => {
				renderMissilesHitbox(player.missiles, context);
			});
		}
		socket.emit('gameRendered', game);
	}
	gameRenderer = requestAnimationFrame(renderGame);
}

export function setGame(gameInstance) {
	game = gameInstance;
}

export function stopGameRenderer() {
	cancelAnimationFrame(gameRenderer);
}
