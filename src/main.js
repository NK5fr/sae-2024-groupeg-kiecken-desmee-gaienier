import Player from './player.js';

const canvas = document.querySelector('.gameCanvas'),
	context = canvas.getContext('2d'),
	canvasResizeObserver = new ResizeObserver(() => resampleCanvas());

const image = new Image();
image.src = '/images/nathan.png';

const player = new Player('Player', 0, 0, 10, 100, image);
console.log(player);

canvasResizeObserver.observe(canvas);

function resampleCanvas() {
	canvas.width = canvas.clientWidth;
	canvas.height = canvas.clientHeight;
}

requestAnimationFrame(render);

function render() {
	context.clearRect(0, 0, canvas.width, canvas.height);
	player.render(context);
	requestAnimationFrame(render);
}

function updateGame() {
	player.update(canvas);
}

document.addEventListener('keydown', event => player.onKeyDown(event));

document.addEventListener('keyup', event => player.onKeyUp(event));

document.addEventListener('mousedown', event => player.onMouseDown(event));

setInterval(updateGame, 1000 / 60);
