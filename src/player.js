import Entity from './entity.js';

export default class Player extends Entity {
	constructor(name, posX, posY, speed, health, sprite) {
		super(posX, posY, speed, health, sprite);
		this.name = name;
		this.speedX = 0;
		this.speedY = 0;
		this.missiles = [];
		this.up = false;
		this.down = false;
		this.left = false;
		this.right = false;
	}

	update(canvas) {
		let nextPosX = this.posX + this.speedX;
		let nextPosY = this.posY + this.speedY;
		if (nextPosX > 0 && nextPosX + this.sprite.width < canvas.width) {
			this.posX = nextPosX;
		}
		if (nextPosY > 0 && nextPosY + this.sprite.height < canvas.height) {
			this.posY += this.speedY;
		}
		this.accelerate();
		this.decelerate();
	}

	accelerate() {
		if (this.up && this.speedY > -this.speed) {
			this.speedY = this.speedY - 2;
		}
		if (this.down && this.speedY < this.speed) {
			this.speedY = this.speedY + 2;
		}
		if (this.left && this.speedX > -this.speed) {
			this.speedX = this.speedX - 2;
		}
		if (this.right && this.speedX < this.speed) {
			this.speedX = this.speedX + 2;
		}
	}

	decelerate() {
		if (!this.up && this.speedY < 0) {
			this.speedY++;
		}
		if (!this.down && this.speedY > 0) {
			this.speedY--;
		}
		if (!this.left && this.speedX < 0) {
			this.speedX++;
		}
		if (!this.right && this.speedX > 0) {
			this.speedX--;
		}
	}

	fire(x, y) {
		console.log('Firing to ' + x + ', ' + y);
	}

	onKeyDown(event) {
		switch (event.key) {
			case 'ArrowUp':
			case 'z':
				this.up = true;
				break;
			case 'ArrowDown':
			case 's':
				this.down = true;
				break;
			case 'ArrowLeft':
			case 'q':
				this.left = true;
				break;
			case 'ArrowRight':
			case 'd':
				this.right = true;
				break;
		}
	}

	onKeyUp(event) {
		switch (event.key) {
			case 'ArrowUp':
			case 'z':
				this.up = false;
				break;
			case 'ArrowDown':
			case 's':
				this.down = false;
				break;
			case 'ArrowLeft':
			case 'q':
				this.left = false;
				break;
			case 'ArrowRight':
			case 'd':
				this.right = false;
				break;
		}
	}

	onMouseDown(event) {
		this.fire(event.clientX, event.clientY);
	}
}
