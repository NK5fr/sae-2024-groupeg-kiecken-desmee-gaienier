import Entity from './entity.js';
import Missile from './missiles.js';
import { angels, missiles } from './imgLoader.js';

export default class Angel extends Entity {
	constructor(x, y, speed, health, sprite) {
		super(x, y, speed, health, sprite);
		this.missiles = [];
		this.fireSettings = {
			on: false,
			rate: 10,
			nextShotIn: 0,
		};
	}

	update(maxWidth, maxHeight) {
		if (this.position.x <= 0) {
			this.position.x = maxWidth - this.hitbox.width;
			this.position.y = Math.floor(
				Math.random() * (maxHeight - this.hitbox.height)
			);
		}

		if (this.fireSettings.on) {
			if (this.fireSettings.nextShotIn <= 0) {
				this.shoot();
				this.fireSettings.nextShotIn = this.fireSettings.rate;
			} else {
				this.fireSettings.nextShotIn--;
			}
		}

		this.position.x -= this.stats.speed;
	}
}

export class Puissance extends Angel {
	constructor(x, y) {
		super(x, y, 5, 5, angels.puissance);
		this.fireSettings.rate = 100;
		this.fireSettings.on = false;
	}

	shoot() {
		let x = this.position.x;
		let y = this.position.y;
		let speed = -6;
		this.missiles.push(new Missile(x, y, speed, missiles.card));
		console.log(this.missiles);
	}
}
