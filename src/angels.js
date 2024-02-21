import Entity from './entity.js';
import Missile from './missiles.js';
import { angels, missiles } from './imgLoader.js';

export default class Angel extends Entity {
	constructor(x, y, speed, health, sprite) {
		super(x, y, speed, health, sprite);
		this.missiles = [];
	}

	update(canvas) {
		let spriteWidth = this.renderSettings.sprite.width;
		let spriteHeight = this.renderSettings.sprite.height;

		if (this.position.x <= 0) {
			this.position.x = canvas.width - spriteWidth;
			this.position.y = Math.floor(
				Math.random() * (canvas.height - spriteHeight)
			);
		}
		this.position.x -= this.stats.speed;
	}
}

export class Puissance extends Angel {
	constructor(x, y, speed, health) {
		super(x, y, speed, health, angels.puissance);
	}

	shoot() {
		let x = this.position.x;
		let y = this.position.y;
		let speed = -5;
		let health = 1;

		this.missiles.push(new Missile(x, y, speed, health, missiles.card));
	}
}
