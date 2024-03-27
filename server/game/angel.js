import Entity from './entity.js';

export class Wanderer extends Entity {
	constructor(x, y, species, type, properties) {
		super(x, y, properties);
		this.species = species;
		this.type = type;
	}

	update(width, height) {
		this.posX -= this.speed;
		if (this.posX <= 0) {
			this.posX = width - this.hitboxWidth;
			this.posY = Math.random() * (height - this.hitboxHeight);
		}
	}
}

export class DiagWanderer extends Wanderer {
	constructor(x, y, species, type, properties) {
		super(x, y, species, type, properties);
		const random = Math.random();
		this.speedX = -this.speed;
		this.speedY = this.speed;
		if (random < 0.25) {
			this.speedY = this.speed * 1.2;
		} else if (random < 0.5) {
			this.speedY = this.speed * 0.8;
		}
	}

	update(width, height) {
		this.posX += this.speedX;
		this.posY += this.speedY;
		if (this.posX >= width - this.hitboxWidth) {
			this.speedX = -this.speed;
		} else if (this.posX <= 0) {
			this.speedX = this.speed;
		}
		if (this.posY >= height - this.hitboxHeight) {
			this.speedY = -this.speed;
		} else if (this.posY <= 0) {
			this.speedY = this.speed;
		}
	}
}
