import Entity from './entity.js';
import Missile from './missiles.js';
import { players, missiles } from './imgLoader.js';

export default class Player extends Entity {
	constructor(name, x, y, speed, health) {
		super(x, y, speed, health, players);
		this.name = name;
		this.movement = {
			speedX: 0,
			speedY: 0,
			direction: {
				up: false,
				down: false,
				left: false,
				right: false,
			},
		};
		this.currentSprite = this.renderSettings.sprite.neutral;
		this.missiles = [];
	}

	render(context) {
		if (this.movement.speedX == 0) {
			this.currentSprite = this.renderSettings.sprite.neutral;
		} else if (this.movement.speedX > 0) {
			this.currentSprite = this.renderSettings.sprite.right;
		} else if (this.movement.speedX < 0) {
			this.currentSprite = this.renderSettings.sprite.left;
		}

		context.drawImage(this.currentSprite, this.position.x, this.position.y);
	}

	update(canvas) {
		let nextPosX = this.position.x + this.movement.speedX;
		let nextPosY = this.position.y + this.movement.speedY;
		let spriteWidth = this.currentSprite.width;
		let spriteHeight = this.currentSprite.height;

		if (nextPosX > 0 && nextPosX + spriteWidth < canvas.width) {
			this.position.x = nextPosX;
		}
		if (nextPosY > 0 && nextPosY + spriteHeight < canvas.height) {
			this.position.y = nextPosY;
		}

		this.movement.direction.up ? this.accelerateUp() : this.decelerateUp();
		this.movement.direction.down
			? this.accelerateDown()
			: this.decelerateDown();
		this.movement.direction.left
			? this.accelerateLeft()
			: this.decelerateLeft();
		this.movement.direction.right
			? this.accelerateRight()
			: this.decelerateRight();

		this.missiles = this.missiles.filter(missile => missile.stats.health > 0);
	}

	accelerateUp() {
		if (this.movement.speedY > -this.stats.speed) {
			this.movement.speedY--;
		}
	}

	accelerateDown() {
		if (this.movement.speedY < this.stats.speed) {
			this.movement.speedY++;
		}
	}

	accelerateLeft() {
		if (this.movement.speedX > -this.stats.speed) {
			this.movement.speedX--;
		}
	}

	accelerateRight() {
		if (this.movement.speedX < this.stats.speed) {
			this.movement.speedX++;
		}
	}

	decelerateUp() {
		if (this.movement.speedY < 0) {
			this.movement.speedY++;
		}
	}

	decelerateDown() {
		if (this.movement.speedY > 0) {
			this.movement.speedY--;
		}
	}

	decelerateLeft() {
		if (this.movement.speedX < 0) {
			this.movement.speedX++;
		}
	}

	decelerateRight() {
		if (this.movement.speedX > 0) {
			this.movement.speedX--;
		}
	}

	fire() {
		let missileX = this.position.x + this.currentSprite.width;
		let missileY = this.position.y + this.currentSprite.height / 2;
		let speed = 10;

		this.missiles.push(new Missile(missileX, missileY, speed, missiles.card));
	}

	onKeyDown(event) {
		switch (event.key) {
			case 'ArrowUp':
			case 'z':
				this.movement.direction.up = true;
				break;
			case 'ArrowDown':
			case 's':
				this.movement.direction.down = true;
				break;
			case 'ArrowLeft':
			case 'q':
				this.movement.direction.left = true;
				break;
			case 'ArrowRight':
			case 'd':
				this.movement.direction.right = true;
				break;
		}
	}

	onKeyUp(event) {
		switch (event.key) {
			case 'ArrowUp':
			case 'z':
				this.movement.direction.up = false;
				break;
			case 'ArrowDown':
			case 's':
				this.movement.direction.down = false;
				break;
			case 'ArrowLeft':
			case 'q':
				this.movement.direction.left = false;
				break;
			case 'ArrowRight':
			case 'd':
				this.movement.direction.right = false;
				break;
		}
	}

	onMouseDown(event) {
		this.fire(event.clientX, event.clientY);
	}

	checkCollision(entity) {
		let playerX = this.position.x;
		let playerY = this.position.y;
		let playerWidth = this.currentSprite.width;
		let playerHeight = this.currentSprite.height;

		let entityX = entity.position.x;
		let entityY = entity.position.y;
		let entityWidth = entity.renderSettings.sprite.width;
		let entityHeight = entity.renderSettings.sprite.height;

		if (
			playerX < entityX + entityWidth &&
			playerX + playerWidth > entityX &&
			playerY < entityY + entityHeight &&
			playerY + playerHeight > entityY
		) {
			this.stats.health--;
			entity.stats.health--;
		}
	}
}
