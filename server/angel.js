import Entity from './entity.js';

export class Wanderer extends Entity {
	constructor(x, y, properties) {
		super(x, y, properties);
	}

	update(width, height) {
		this.posX -= this.speed;
		if (this.posX <= 0) {
			this.posX = width - this.width;
			this.posY = Math.random() * (height - this.height);
		}
	}
}
