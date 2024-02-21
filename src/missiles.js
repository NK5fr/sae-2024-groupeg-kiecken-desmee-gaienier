import Entity from './entity';

export default class Missile extends Entity {
	constructor(x, y, speed, width, height) {
		super(x, y, speed, 1, null, width, height);
	}

	render(context) {
		context.beginPath();
		context.rect(
			this.position.x,
			this.position.y,
			this.renderSettings.width,
			this.renderSettings.height
		);
		context.fillStyle = 'blue';
		context.fill();
	}

	update(canvas) {
		this.position.x += this.stats.speed;
		if (this.position.x + this.renderSettings.width == canvas.width) {
			this.stats.health = 0;
		}
	}

	checkCollision(entity) {
		let missileX = this.position.x;
		let missileY = this.position.y;
		let missileWidth = this.renderSettings.width;
		let missileHeight = this.renderSettings.height;

		let entityX = entity.position.x;
		let entityY = entity.position.y;
		let entityWidth = entity.renderSettings.width;
		let entityHeight = entity.renderSettings.height;

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
