import Draw from './draw.js';

const canvas = document.querySelector('.gameCanvas'),
	context = canvas.getContext('2d'),
	canvasResizeObserver = new ResizeObserver(() => resampleCanvas()),
	lineWidthSelector = document.querySelector('input[type="range"]'),
	colorSelector = document.querySelector('input[type="color"]');

canvasResizeObserver.observe(canvas);

lineWidthSelector.value = context.lineWidth;
colorSelector.value = context.strokeStyle;

function resampleCanvas() {
	canvas.width = canvas.clientWidth;
	canvas.height = canvas.clientHeight;
}

let drawList = [];

canvas.addEventListener('mousedown', event => {
	drawList.push(
		new Draw(
			event.offsetX,
			event.offsetY,
			lineWidthSelector.value,
			colorSelector.value
		)
	);
	canvas.addEventListener('mousemove', onMouseMove);
});

canvas.addEventListener('mouseup', event =>
	canvas.removeEventListener('mousemove', onMouseMove)
);

function onMouseMove(event) {
	drawList[drawList.length - 1].append(event.offsetX, event.offsetY);
}

requestAnimationFrame(render);

/*const image = new Image();
image.src = '/images/monster.png';
image.addEventListener('load', event => {
	requestAnimationFrame(render);
});*/

let x = 0,
	y = 0,
	xSpeed = 0,
	ySpeed = 0;

let speed = 10;

function render() {
	context.clearRect(0, 0, canvas.width, canvas.height);
	drawList.forEach(draw => draw.render(context));
	//context.drawImage(image, x, y);
	requestAnimationFrame(render);
}

/*function moveMonster() {
	y += ySpeed;
	if (y < 0) {
		y = 0;
	} else if (y + image.height > canvas.height) {
		y = canvas.height - image.height;
	}

	x += xSpeed;
	if (x < 0) {
		x = 0;
	} else if (x + image.width > canvas.width) {
		x = canvas.width - image.width;
	}
}*/

document.addEventListener('keydown', event => {
	switch (event.key) {
		case 'ArrowRight':
			xSpeed = speed;
			break;
		case 'ArrowLeft':
			xSpeed = -speed;
			break;
		case 'ArrowUp':
			ySpeed = -speed;
			break;
		case 'ArrowDown':
			ySpeed = speed;
			break;
	}
});

document.addEventListener('keyup', event => {
	switch (event.key) {
		case 'ArrowRight':
		case 'ArrowLeft':
			xSpeed = 0;
			break;
		case 'ArrowUp':
		case 'ArrowDown':
			ySpeed = 0;
			break;
	}
});

//setInterval(moveMonster, 1000 / 60);
