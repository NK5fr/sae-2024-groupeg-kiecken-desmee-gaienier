import { renderMissiles } from './renderMissiles.js';

const playerImage = new Image();

export default function renderPlayer(player, context) {
	if (player.health <= 0) return;
	playerImage.src = player.sprite;
	context.drawImage(playerImage, player.posX, player.posY);
	renderMissiles(player.missiles, context);
}

export function renderHealthBar(player, context, canvas) {
	let healthBarWidth = (player.health / player.maxHealth) * 100;
	context.beginPath();
	context.rect(10, canvas.height - 20, 100, 10);
	context.strokeStyle = 'black';
	context.lineWidth = 2;
	context.stroke();
	context.fillStyle = calculateCurrentColorBasedOnHealth(player);
	context.fillRect(10, canvas.height - 20, healthBarWidth, 10);
}

function calculateCurrentColorBasedOnHealth(player) {
	let green = Math.floor((player.health / player.maxHealth) * 255);
	let red = 255 - green;
	return `rgb(${red}, ${green}, 0)`;
}
