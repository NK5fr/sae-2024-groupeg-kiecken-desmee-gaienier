import Entity from './entity.js';
import Missile from './missiles.js';
import { playersSprites, missilesSprites } from './assetsLoader.js';

export default class Player extends Entity {
	constructor(name, x, y, speed, health) {
		super(x, y, speed, health, playersSprites);
		this.name = name;
		this.speedX = 0;
		this.speedY = 0;
		this.direction = {
			up: false,
			down: false,
			left: false,
			right: false,
		};
		this.missiles = [];
		this.fireOn = false;
		this.fireRate = 25;
		this.fireNextShotIn = 0;
		this.width = this.sprite.neutral.width;
		this.height = this.sprite.neutral.height;
	}

	// The following methods are used to handle the player's rendering and update
	render(context) {
		if (this.speedX === 0) {
			context.drawImage(this.sprite.neutral, this.posX, this.posY);
		} else if (this.speedX > 0) {
			context.drawImage(this.sprite.right, this.posX, this.posY);
		} else if (this.speedX < 0) {
			context.drawImage(this.sprite.left, this.posX, this.posY);
		}
		this.missiles.forEach(missile => missile.render(context));
	}

	renderHealthBar(context, canvas) {
		let healthBarWidth = (this.health / this.maxHealth) * 100;
		context.beginPath();
		context.rect(10, 10, 100, 10);
		context.strokeStyle = 'black';
		context.lineWidth = 2;
		context.stroke();
		context.fillStyle = this.calculateCurrentColorBasedOnHealth();
		context.fillRect(10, 10, healthBarWidth, 10);
	}

	calculateCurrentColorBasedOnHealth() {
		let red = Math.floor((this.health / this.maxHealth) * 255);
		let green = 255 - red;
		return `rgb(${red}, ${green}, 0)`;
	}
	update(canvas) {
		if (this.canMoveOnAxis(canvas, 'X')) this.posX += this.speedX;
		if (this.canMoveOnAxis(canvas, 'Y')) this.posY += this.speedY;

		if (this.direction.up) this.accelerateUpOrLeft('Y');
		else this.decelerateUpOrLeft('Y');
		if (this.direction.down) this.accelerateDownOrRight('Y');
		else this.decelerateDownOrRight('Y');
		if (this.direction.left) this.accelerateUpOrLeft('X');
		else this.decelerateUpOrLeft('X');
		if (this.direction.right) this.accelerateDownOrRight('X');
		else this.decelerateDownOrRight('X');

		this.missiles = this.missiles.filter(missile => missile.health > 0);
		this.missiles.forEach(missile => missile.update(canvas));

		if (this.fireOn) {
			if (this.fireNextShotIn <= 0) {
				this.fire();
				this.fireNextShotIn = this.fireRate;
			}
		}
		this.fireNextShotIn--;
	}

	// This method is used to handle the player's shooting
	fire() {
		let missileType = missilesSprites.card;
		let missileX = this.posX + this.width;
		let missileY = this.posY + this.height / 2 - missileType.height / 2;
		let speed = 10;

		this.missiles.push(
			new Missile(missileX, missileY, speed, missilesSprites.card)
		);
	}

	// The following methods are used to handle the player's movement
	// pos${axis} is the current position of the player on the axis X or Y
	// speed${axis} is the current speed with which the player is moving on the axis X or Y
	// this[bound] is the width or height of the player
	// canvas[bound] is the width or height of the canvas
	canMoveOnAxis(canvas, axis) {
		let bound = axis === 'X' ? 'width' : 'height';
		return (
			this[`pos${axis}`] + this[`speed${axis}`] > 0 &&
			this[`pos${axis}`] + this[`speed${axis}`] + this[bound] < canvas[bound]
		);
	}
	accelerateUpOrLeft(axis) {
		if (this[`speed${axis}`] > -this.speed) this[`speed${axis}`]--;
	}
	accelerateDownOrRight(axis) {
		if (this[`speed${axis}`] < this.speed) this[`speed${axis}`]++;
	}
	decelerateUpOrLeft(axis) {
		if (this[`speed${axis}`] < 0) this[`speed${axis}`]++;
	}
	decelerateDownOrRight(axis) {
		if (this[`speed${axis}`] > 0) this[`speed${axis}`]--;
	}

	// The following methods are used to handle the player's input
	onKeyDown(key) {
		if (key === 'ArrowUp' || key === 'z') this.direction.up = true;
		if (key === 'ArrowDown' || key === 's') this.direction.down = true;
		if (key === 'ArrowLeft' || key === 'q') this.direction.left = true;
		if (key === 'ArrowRight' || key === 'd') this.direction.right = true;
	}
	onKeyUp(key) {
		if (key === 'ArrowUp' || key === 'z') this.direction.up = false;
		if (key === 'ArrowDown' || key === 's') this.direction.down = false;
		if (key === 'ArrowLeft' || key === 'q') this.direction.left = false;
		if (key === 'ArrowRight' || key === 'd') this.direction.right = false;
	}
	onMouseDown(event) {
		this.fireOn = true;
	}
	onMouseUp(event) {
		this.fireOn = false;
	}
}
