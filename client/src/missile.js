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
