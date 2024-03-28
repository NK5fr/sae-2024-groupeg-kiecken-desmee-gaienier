import Entity from './entity.js';

const missileProperties = {
	health: 1,
	damage: 1,
	speed: 5,
	fireSpeed: 0,
	hitboxWidth: 24,
	hitboxHeight: 24,
};

export default class Missile extends Entity {
	constructor(x, y, fireAngle, type, properties) {
		super(x, y, properties);
		this.fireAngle = fireAngle;
		this.type = type;
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
			this.posX + this.hitboxWidth < 0 ||
			this.posX > width ||
			this.posY + this.hitboxHeight < 0 ||
			this.posY > height
		);
	}

	static createMissile(posX, posY, fireAngle, damage, type) {
		missileProperties.damage = damage;
		return new Missile(posX, posY, fireAngle, type, missileProperties);
	}
}
