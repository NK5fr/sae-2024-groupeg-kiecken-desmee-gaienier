import { socket } from '../main.js';
import { renderAngels } from './renderAngel.js';
import { renderAllBonus } from './renderBonus.js';
import { renderMissiles } from './renderMissiles.js';
import { renderHealthBar, renderPlayers } from './renderPlayer.js';
import {
	renderStageBackground,
	renderStageProgressionBar,
	renderStageTransition,
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
let prevStage = null;

export default function startGameRenderer() {
	gameRenderer = requestAnimationFrame(renderGame);
}

export function startTransition(stage) {
	prevStage = stage;
	transitionRenderer = requestAnimationFrame(renderTransition);
}

function renderGame() {
	context.clearRect(0, 0, game.width, game.height);

	const players = game.players;
	const stage = game.stage;

	renderStageBackground(stage.name, context);

	renderPlayers(players, context);

	renderAngels(stage.angels, context);

	renderMissiles(stage.strandedMissiles, context);

	renderAllBonus(stage.bonus, context);

	renderStageProgressionBar(stage, context, canvas);

	for (let position = 0; position < game.players.length; position++) {
		const player = game.players[position];
		renderHealthBar(player, position, context);
	}

	/*if (game.debug) {
		renderPlayerHitbox(game.mainPlayer, context);
		renderPlayerStats(game.mainPlayer, context, canvas);
		game.otherPlayers.forEach(player => {
			renderPlayerHitbox(player, context);
		});
		renderMissilesHitbox(game.mainPlayer.missiles, context);
		game.otherPlayers.forEach(player => {
			renderMissilesHitbox(player.missiles, context);
		});
	}*/
	gameRenderer = requestAnimationFrame(renderGame);
}

function renderTransition() {
	context.clearRect(0, 0, game.width, game.height);
	renderStageTransition(prevStage.name, game.stage.name, context);
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

export function getGame() {
	return game;
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
