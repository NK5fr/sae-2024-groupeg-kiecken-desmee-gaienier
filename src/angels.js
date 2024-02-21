import Entity from './entity.js';
import Missile from './missiles.js';
import { angels, missiles } from './imgLoader.js';

export default class Angel extends Entity {
	constructor(x, y, speed, health) {
		super(x, y, speed, health, angels.puissance);
		this.missiles = [];
	}

	update(canvas) {
		let spriteWidth = this.renderSettings.sprite.width;

		if (this.position.x <= 0) {
			this.position.x = canvas.width - spriteWidth;
		}
		this.position.x -= this.stats.speed;
	}
}
