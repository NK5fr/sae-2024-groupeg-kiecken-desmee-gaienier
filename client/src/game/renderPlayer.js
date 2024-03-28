import { renderMissiles } from './renderMissiles.js';

const playerSkinPath = 'assets/player';
const playerImage = new Image();

export default function renderPlayer(player, context) {
	if (player.health <= 0) return;

	if (player.speedX > 0)
		playerImage.src = `${playerSkinPath}/${player.currentSkin}/right.png`;
	else if (player.speedX < 0)
		playerImage.src = `${playerSkinPath}/${player.currentSkin}/left.png`;
	else playerImage.src = `${playerSkinPath}/${player.currentSkin}/idle.png`;

	context.drawImage(playerImage, player.posX, player.posY);

	renderMissiles(player.missiles, context);
}

export function renderHealthBar(player, position, context, canvas) {
	const startX = 10 + position * 110;
	const startY = canvas.height - (position === 0 ? 20 : 15);

	const healthBarWidth = (player.health / player.maxHealth) * 100;
	const healthBarHeight = position === 0 ? 15 : 10;

	context.fillStyle = calculateCurrentColorBasedOnHealth(player);
	context.fillRect(startX, startY, healthBarWidth, healthBarHeight);

	context.rect(startX, startY, 100, healthBarHeight);
	context.strokeStyle = 'black';
	context.lineWidth = 2;
	context.stroke();
}

function calculateCurrentColorBasedOnHealth(player) {
	let green = Math.floor((player.health / player.maxHealth) * 255);
	let red = 255 - green;
	return `rgb(${red}, ${green}, 0)`;
}
