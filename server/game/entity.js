export default class Entity {
	constructor(x, y, properties) {
		this.posX = x;
		this.posY = y;

		this.health = this.maxHealth = properties.health;
		this.speed = properties.speed;
		this.damage = properties.damage;

		this.sprite = properties.sprite;

		this.width = properties.width;
		this.height = properties.height;
	}

	checkCollision(entity) {
		return (
			this.posX < entity.posX + entity.width &&
			this.posX + this.width > entity.posX &&
			this.posY < entity.posY + entity.height &&
			this.posY + this.height > entity.posY
		);
	}
}
