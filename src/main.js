import Player from './player.js';
import Angel from './angels.js';

const canvas = document.querySelector('.gameCanvas'),
	context = canvas.getContext('2d'),
	canvasResizeObserver = new ResizeObserver(() => resampleCanvas());

const player = new Player('Player', canvas.width / 2, canvas.height / 2, 10, 3);

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

	angels.push(new Angel(x, y, speed, health));
}

document.addEventListener('keydown', event => player.onKeyDown(event));

document.addEventListener('keyup', event => player.onKeyUp(event));

document.addEventListener('mousedown', event => player.onMouseDown(event));

requestAnimationFrame(render);
setInterval(updateGame, 1000 / 60);
setInterval(spawnAngel, 1000);
