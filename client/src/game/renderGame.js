import { socket } from '../main.js';
import { renderAngels } from './renderAngel.js';
import { renderAllBonus } from './renderBonus.js';
import { renderMissiles, renderMissilesHitbox } from './renderMissiles.js';
import renderPlayer, {
	renderHealthBar,
	renderPlayerHitbox,
	renderPlayerStats,
	renderPlayers,
} from './renderPlayer.js';
import renderStage, {
	renderStageProgressionBar,
	renderStageChangement,
} from './renderStage.js';

export const canvas = document.querySelector('.gameCanvas'),
	context = canvas.getContext('2d'),
	canvasResizeObserver = new ResizeObserver(() => {
		canvas.width = canvas.clientWidth;
		canvas.height = canvas.clientHeight;
		socket.emit('canvas was resized', {
			width: canvas.width,
			height: canvas.height,
		});
	});

canvasResizeObserver.observe(canvas);

let stageTransitionEnd = false;
let gameRenderer = null;
let transitionRenderer = null;
let game = null;
let previousStage = null;

export default function startGameRenderer() {
	gameRenderer = requestAnimationFrame(renderGame);
}

export function startTransition(stage) {
	previousStage = stage;
	transitionRenderer = requestAnimationFrame(renderTransition);
}

function renderGame() {
	context.clearRect(0, 0, game.width, game.height);

	renderStage(game.stage, context, canvas);

	renderPlayers(game.players, context);

	renderAngels(game.stage.angels, context);
	game.stage.angels.forEach(angel => {
		if (angel.missiles) renderMissiles(angel.missiles, context);
	});

	renderMissiles(game.stage.strandedMissiles, context);

	renderAllBonus(game.stage.bonus, context);

	renderStageProgressionBar(game.stage, context, canvas);

	for (let i = 0; i < game.players.length; i++) {
		const player = game.players[i];
		renderHealthBar(player, i, context, canvas);
	}

	if (game.debug) {
		renderPlayerHitbox(game.mainPlayer, context);
		renderPlayerStats(game.mainPlayer, context, canvas);
		game.otherPlayers.forEach(player => {
			renderPlayerHitbox(player, context);
		});
		renderMissilesHitbox(game.mainPlayer.missiles, context);
		game.otherPlayers.forEach(player => {
			renderMissilesHitbox(player.missiles, context);
		});
	}
	gameRenderer = requestAnimationFrame(renderGame);
}

function renderTransition() {
	context.clearRect(0, 0, game.width, game.height);
	renderStageChangement(previousStage, game.stage, context, canvas);
	renderPlayers(game.players, context);
	if (stageTransitionEnd) {
		stopGameRenderer();
		socket.emit('stage end his transition');
		stageTransitionEnd = false;
		startGameRenderer();
	} else {
		transitionRenderer = requestAnimationFrame(renderTransition);
	}
}

export function setGame(gameInstance) {
	game = gameInstance;
}

export function stageChangeEnd() {
	stageTransitionEnd = true;
}

export function stopGameRenderer() {
	cancelAnimationFrame(gameRenderer);
}

export function stopTransitionRenderer() {
	cancelAnimationFrame(transitionRenderer);
}
