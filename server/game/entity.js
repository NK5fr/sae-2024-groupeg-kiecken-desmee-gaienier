export default class Entity {
	constructor(x, y, properties) {
		this.posX = x;
		this.posY = y;

		this.health = this.maxHealth = properties.health;
		this.damage = properties.damage;
		this.speed = properties.speed;

		this.hitboxWidth = properties.hitboxWidth;
		this.hitboxHeight = properties.hitboxHeight;
	}

	checkCollision(entity) {
		return (
			this.posX < entity.posX + entity.hitboxWidth &&
			this.posX + this.hitboxWidth > entity.posX &&
			this.posY < entity.posY + entity.hitboxHeight &&
			this.posY + this.hitboxHeight > entity.posY
		);
	}
}
