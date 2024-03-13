import Entity from './entity.js';
import { missilesData } from './assetsLoader.js';

export default class Missile extends Entity {
	constructor(x, y, properties, fireAngle) {
		super(x, y, properties);
		this.fireAngle = fireAngle;
	}

	render(context) {
		const img = new Image();
		img.src = this.sprite;
		context.drawImage(img, this.posX, this.posY);
	}

	update(width, height) {
		this.posX += this.speed * Math.cos(this.fireAngle);
		this.posY += this.speed * Math.sin(this.fireAngle);
		if (this.posX == 0 || this.posX + this.width == width) {
			this.health = 0;
		}
		if (this.posY == 0 || this.posY + this.height == height) {
			this.health = 0;
		}
	}

	static createMissile(
		playerX,
		playerY,
		playerWidth,
		playerHeight,
		missileType,
		fireAngle
	) {
		const posX = playerX + playerWidth / 2;
		const posY = playerY + playerHeight / 2;
		return new Missile(posX, posY, missilesData[missileType], fireAngle);
	}
}
