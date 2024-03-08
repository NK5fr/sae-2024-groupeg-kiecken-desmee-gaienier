import Entity from './entity.js';
import Missile from './missiles.js';

export default class Player extends Entity {
	constructor(name, x, y, properties) {
		super(x, y, properties);
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
		this.missileType = properties.missileType;

		this.fireIsOn = false;
		this.fireRate = properties.fireRate;
		this.fireNextShotIn = 0;
	}

	// The following methods are used to handle the player's rendering and update
	render(context) {
		const img = new Image();
		if (this.speedX == 0) {
			img.src = this.sprite.idle;
		} else if (this.speedX > 0) {
			img.src = this.sprite.right;
		} else if (this.speedX < 0) {
			img.src = this.sprite.left;
		}
		context.drawImage(img, this.posX, this.posY);
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
		let green = Math.floor((this.health / this.maxHealth) * 255);
		let red = 255 - green;
		return `rgb(${red}, ${green}, 0)`;
	}

	update(width, height) {
		if (this.canMoveOnAxis(width, 'X')) this.posX += this.speedX;
		if (this.canMoveOnAxis(height, 'Y')) this.posY += this.speedY;

		if (this.direction.up) this.accelerateUpOrLeft('Y');
		else this.decelerateUpOrLeft('Y');
		if (this.direction.down) this.accelerateDownOrRight('Y');
		else this.decelerateDownOrRight('Y');
		if (this.direction.left) this.accelerateUpOrLeft('X');
		else this.decelerateUpOrLeft('X');
		if (this.direction.right) this.accelerateDownOrRight('X');
		else this.decelerateDownOrRight('X');

		this.missiles = this.missiles.filter(missile => missile.health > 0);
		this.missiles.forEach(missile => missile.update(width, height));

		if (this.fireIsOn) {
			if (this.fireNextShotIn <= 0) {
				this.fire();
				this.fireNextShotIn = this.fireRate;
			}
		}
		this.fireNextShotIn--;
	}

	// This method is used to handle the player's shooting
	fire() {
		let missileX = this.posX + this.width;
		let missileY = this.posY + this.height / 2 - missileType.height / 2;

		this.missiles.push(
			Missile.createMissile(missileX, missileY, this.missileType)
		);
	}

	// The following methods are used to handle the player's movement
	// pos${axis} is the current position of the player on the axis X or Y
	// speed${axis} is the current speed with which the player is moving on the axis X or Y
	// width or height is the width or height of the player depending of the axis
	// bound is the maximum value of the axis X or Y
	canMoveOnAxis(bound, axis) {
		let position = this[`pos${axis}`];
		let speed = this[`speed${axis}`];
		let widthOrHeight = this[axis === 'X' ? 'width' : 'height'];
		return position + speed > 0 && position + speed + widthOrHeight < bound;
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
		this.fireIsOn = true;
	}
	onMouseUp(event) {
		this.fireIsOn = false;
	}
}
