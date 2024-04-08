import Entity from './entity.js';
import Missile from './missile.js';

export class Wanderer extends Entity {
	constructor(x, y, species, type, properties) {
		super(x, y, properties);
		this.species = species;
		this.type = type;
		this.pattern = 'wanderer';
	}

	update(width, height) {
		this.posX += -this.speed;
		if (this.posX <= 0) {
			this.posX = width - this.hitboxWidth;
			this.posY = Math.random() * (height - this.hitboxHeight);
		}
	}
}

export class Chaser extends Wanderer {
	constructor(x, y, species, type, properties) {
		super(x, y, species, type, properties);
		this.pattern = 'chaser';
	}

	update(player, width, height) {
		if (!player) {
			super.update(width, height);
			return;
		}
		const angle = Math.atan2(
			player.posY - this.posY - this.hitboxHeight / 2,
			player.posX - this.posX - this.hitboxWidth / 2
		);
		this.posX += Math.cos(angle) * this.speed;
		this.posY += Math.sin(angle) * this.speed;
		if (this.posX <= 0) {
			this.posX = width - this.hitboxWidth;
			this.posY = Math.random() * height;
			this.posY = Math.min(this.posY, height - this.hitboxHeight);
		}
	}
}

export class DiagWanderer extends Wanderer {
	constructor(x, y, species, type, properties) {
		super(x, y, species, type, properties);
		const random = Math.random();
		this.speedX = -this.speed;
		if (random < 0.25) {
			this.speedY = -this.speed * 1.2;
		} else if (random < 0.5) {
			this.speedY = this.speed * 0.8;
		} else {
			this.speedY = -this.speed;
		}
		this.pattern = 'diagWanderer';
	}

	update(width, height) {
		this.posX += this.speedX;
		this.posY += this.speedY;
		if (this.posX > width - this.hitboxWidth) {
			this.speedX = -this.speed;
		} else if (this.posX < 0) {
			this.speedX = this.speed;
		}
		if (this.posY > height - this.hitboxHeight) {
			this.speedY = -this.speed;
		} else if (this.posY < 0) {
			this.speedY = this.speed;
		}
	}
}

export class Shooter extends Wanderer {
	constructor(x, y, species, type, properties) {
		super(x, y, species, type, properties);

		this.missiles = [];
		this.fireRate = 50;
		this.nextShotIn = 0;

		this.pattern = 'shooter';
	}

	update(player, width, height) {
		super.update(width, height);

		if (!player) return;
		this.missiles = this.missiles.filter(missile => missile.health > 0);
		this.missiles.forEach(missile => missile.update(width, height));

		if (this.nextShotIn <= 0) {
			this.fire(
				player.posX + player.hitboxWidth / 2,
				player.posY + player.hitboxHeight / 2
			);
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
			Missile.createFoeMissile(posX, posY, fireAngle, this.damage)
		);
	}
}

export class Boss extends Entity {
	constructor(x, y, species, type, properties) {
		super(x, y, properties);
		this.species = species;
		this.type = type;

		this.speedX = 0;
		this.speedY = Math.random() < 0.5 ? -this.speed : this.speed;

		this.pattern = 'boss';

		this.missiles = [];
		this.fireRate = 30;
		this.nextShotIn = 0;
	}

	update(player, width, height) {
		if (this.health <= this.maxHealth / 2) {
			if (this.posY >= height - this.hitboxHeight) {
				this.speedY = -this.speed;
			} else if (this.posY <= 0) {
				this.speedY = this.speed;
			}
			this.posY += this.speedY;
		}

		if (!player) return;
		this.missiles = this.missiles.filter(missile => missile.health > 0);
		this.missiles.forEach(missile => missile.update(width, height));

		if (this.nextShotIn <= 0) {
			this.fire(
				player.posX + player.hitboxWidth / 2,
				player.posY + player.hitboxHeight / 2
			);
			this.nextShotIn = this.fireRate;
		}
		this.nextShotIn--;
	}

	fire(playerPosX, playerPosY) {
		const fireAngle1 = Math.atan2(
			playerPosY - this.posY - this.hitboxHeight / 2,
			playerPosX - this.posX - this.hitboxWidth / 2
		);
		const fireAngle2 = fireAngle1 + Math.PI / 6;
		const fireAngle3 = fireAngle1 - Math.PI / 6;

		const posX = this.posX + this.hitboxWidth / 2;
		const posY = this.posY + this.hitboxHeight / 2;
		this.missiles.push(
			Missile.createFoeMissile(posX, posY, fireAngle1, this.damage)
		);
		this.missiles.push(
			Missile.createFoeMissile(posX, posY, fireAngle2, this.damage)
		);
		this.missiles.push(
			Missile.createFoeMissile(posX, posY, fireAngle3, this.damage)
		);
	}
}
