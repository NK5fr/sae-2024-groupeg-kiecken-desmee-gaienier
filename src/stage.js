import { Puissance } from './angels.js';
import { backgrounds } from './imgLoader.js';

export default class Stage {
	constructor(backgroundImages) {
		this.angels = [];
		this.backgroundX = 0;
		this.backgroundImages = backgroundImages;
	}

	drawBackground(context) {
		if (this.backgroundX <= -this.backgroundImages.width) {
			this.backgroundX = -1;
		}
		context.drawImage(this.backgroundImages, this.backgroundX, 0);
		context.drawImage(
			this.backgroundImages,
			this.backgroundX + this.backgroundImages.width,
			0
		);
		this.backgroundX -= 1.5;
	}

	renderAngels(context) {
		this.angels.forEach(angel => {
			angel.render(context);
			angel.missiles.forEach(missile => missile.render(context));
		});
	}
}

export class Mars extends Stage {
	constructor() {
		super(backgrounds.stageOne);
		this.numberOfAngels = 10;
		this.numberOfAngelsSpawned = 0;
		this.numberOfAngelsKilled = 0;
	}

	spawnAngels(canvas, gameNotFocused) {
		let x = canvas.width;
		let y = Math.floor(Math.random() * canvas.height);
		let speed = 5;
		let health = 1;

		if (gameNotFocused) return;
		if (this.numberOfAngelsSpawned < this.numberOfAngels) {
			this.angels.push(new Puissance(x, y, speed, health));
			this.numberOfAngelsSpawned++;
		}
	}

	stageIsClear() {
		return (
			this.numberOfAngelsSpawned === this.numberOfAngels &&
			this.angels.length === 0
		);
	}
}
