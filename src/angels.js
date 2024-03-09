import Entity from './entity.js';
import { angelsData } from './assetsLoader.js';

export class Wanderer extends Entity {
	constructor(x, y, species, name) {
		super(x, y, angelsData[species][name]);
	}

	update(canvas) {
		this.posX -= this.speed;
		if (this.posX <= 0) {
			this.posX = canvas.width - this.width;
			this.posY = Math.random() * (canvas.height - this.height);
		}
	}
}
