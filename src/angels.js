import Entity from './entity.js';
import Missile from './missiles.js';
import { angelsSprites, angelsData } from './assetsLoader.js';

export class Wanderer extends Entity {
	constructor(x, y, species, type) {
		super(
			x,
			y,
			angelsData[species][type].speed,
			angelsData[species][type].health,
			angelsSprites[species][type]
		);
		this.damage = angelsData[species][type].damage;
	}

	update(canvas) {
		this.posX -= this.speed;
		if (this.posX <= 0) {
			this.posX = canvas.width - this.width;
			this.posY = Math.random() * (canvas.height - this.height);
		}
	}
}
