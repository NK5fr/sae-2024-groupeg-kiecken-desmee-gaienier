import Player from './player.js';
import Angel from './angels.js';

const canvas = document.querySelector('.gameCanvas'),
	context = canvas.getContext('2d'),
	canvasResizeObserver = new ResizeObserver(() => resampleCanvas());

const playerImages = {
	left: new Image(),
	neutral: new Image(),
	right: new Image(),
};
playerImages.left.src = '/images/player/left.png';
playerImages.neutral.src = '/images/player/neutral.png';
playerImages.right.src = '/images/player/right.png';

const angelImages = {
	puissance: new Image(),
};
angelImages.puissance.src = '/images/angels/puissance.png';

export const missileImages = {
	card: new Image(),
};
missileImages.card.src = '/images/missiles/card.png';

const player = new Player(
	'Player',
	canvas.width / 2,
	canvas.height / 2,
	10,
	3,
	playerImages,
	playerImages.neutral.width,
	playerImages.neutral.height
);

console.log(player);

canvasResizeObserver.observe(canvas);

function resampleCanvas() {
	canvas.width = canvas.clientWidth;
	canvas.height = canvas.clientHeight;
}

let angels = [];

function render() {
	context.clearRect(0, 0, canvas.width, canvas.height);
	player.render(context);
	angels.forEach(angel => angel.render(context));
	player.missiles.forEach(missile => missile.render(context));
	requestAnimationFrame(render);
}

function updateGame() {
	player.update(canvas);
	angels.forEach(angel => {
		angel.update(canvas);
		player.checkCollision(angel);
		player.missiles.forEach(missile => {
			missile.checkCollision(angel);
		});
	});
	player.missiles.forEach(missile => missile.update(canvas));
	angels = angels.filter(angel => angel.stats.health > 0);
	player.missiles = player.missiles.filter(missile => missile.stats.health > 0);
}

function spawnAngel() {
	let width = 50;
	let height = 50;
	let x = canvas.width;
	let y = Math.floor(Math.random() * (canvas.height - height));
	let speed = 5;
	let health = 1;

	angels.push(
		new Angel(x, y, speed, health, angelImages.puissance, width, height)
	);
}

document.addEventListener('keydown', event => player.onKeyDown(event));

document.addEventListener('keyup', event => player.onKeyUp(event));

document.addEventListener('mousedown', event => player.onMouseDown(event));

requestAnimationFrame(render);
setInterval(updateGame, 1000 / 60);
setInterval(spawnAngel, 1000);
