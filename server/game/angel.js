import Entity from './entity.js';
import Missile from './missile.js';

export class Wanderer extends Entity {
	constructor(x, y, species, type, properties) {
		super(x, y, properties);
		this.species = species;
		this.type = type;
	}

	update(player, width, height) {
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

	update(player, width, height) {
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

export class Shooter extends Wanderer {
	constructor(x, y, species, type, properties) {
		super(x, y, species, type, properties);
		this.missiles = [];
		this.fireRate = 85;
		this.nextShotIn = 0;
	}

	update(player, width, height) {
		super.update(player, width, height);

		this.missiles = this.missiles.filter(missile => missile.health > 0);
		this.missiles.forEach(missile => missile.update(width, height));

		if (this.nextShotIn <= 0) {
			this.fire(player.posX, player.posY);
			this.nextShotIn = this.fireRate;
		}
		this.nextShotIn--;
	}

	fire(playerPosX, playerPosY) {
		const fireAngle = Math.atan2(
			playerPosY - this.posY - this.hitboxHeight / 2,
			playerPosX - this.posX - this.hitboxWidth / 2
		);

		const posX = this.posX + this.hitboxWidth / 2;
		const posY = this.posY + this.hitboxHeight / 2;
		this.missiles.push(
			Missile.createMissile(posX, posY, fireAngle, this.damage, 'aureole')
		);
	}
}
