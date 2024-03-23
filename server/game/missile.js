import Entity from './entity.js';
import { missileData } from '../index.js';

export default class Missile extends Entity {
	constructor(x, y, properties, fireAngle) {
		super(x, y, properties);
		this.fireAngle = fireAngle;
	}

	update(width, height) {
		this.posX += Math.round(this.speed * Math.cos(this.fireAngle));
		this.posY += Math.round(this.speed * Math.sin(this.fireAngle));
		if (this.isOutOfCanvas(width, height)) {
			this.health = 0;
		}
	}

	isOutOfCanvas(width, height) {
		return (
			this.posX + this.width < 0 ||
			this.posX > width ||
			this.posY + this.height < 0 ||
			this.posY > height
		);
	}

	static createMissile(posX, posY, missileType, fireAngle) {
		return new Missile(posX, posY, missileData[missileType], fireAngle);
	}
}
