import Entity from './entity';

export default class Missile extends Entity {
	constructor(x, y, speed, sprite) {
		super(x, y, speed, 1, sprite);
	}

	render(context) {
		context.drawImage(
			this.renderSettings.sprite,
			this.position.x,
			this.position.y
		);
	}

	update(canvas) {
		this.position.x += this.stats.speed;
		if (this.position.x + this.renderSettings.sprite.width == canvas.width) {
			this.stats.health = 0;
		}
	}

	checkCollision(entity) {
		let missileX = this.position.x;
		let missileY = this.position.y;
		let missileWidth = this.renderSettings.sprite.width;
		let missileHeight = this.renderSettings.sprite.height;

		let entityX = entity.position.x;
		let entityY = entity.position.y;
		let entityWidth = entity.renderSettings.sprite.width;
		let entityHeight = entity.renderSettings.sprite.height;

		if (
			missileX < entityX + entityWidth &&
			missileX + missileWidth > entityX &&
			missileY < entityY + entityHeight &&
			missileY + missileHeight > entityY
		) {
			this.stats.health--;
			entity.stats.health--;
		}
	}
}
