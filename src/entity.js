export default class Entity {
	constructor(x, y, speed, health, sprite) {
		this.posX = x;
		this.posY = y;
		this.speed = speed;
		this.health = health;
		this.maxHealth = health;
		this.sprite = sprite;
		this.width = sprite.width;
		this.height = sprite.height;
	}

	render(context) {
		context.drawImage(this.sprite, this.posX, this.posY);
	}

	drawHitbox(context) {
		context.beginPath();
		context.rect(this.posX, this.posY, this.width, this.height);
		context.strokeStyle = 'red';
		context.stroke();
	}

	checkCollision(entity) {
		if (
			this.posX < entity.posX + entity.width &&
			this.posX + this.width > entity.posX &&
			this.posY < entity.posY + entity.height &&
			this.posY + this.height > entity.posY
		) {
			this.health -= entity.damage;
			entity.health -= this.damage;
		}
	}

	checkCollisions(entities) {
		entities.forEach(entity => {
			this.checkCollision(entity);
		});
	}
}
