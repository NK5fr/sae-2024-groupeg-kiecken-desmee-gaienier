import Entity from './entity';

export default class Angel extends Entity {
	constructor(x, y, speed, health, sprite) {
		super(x, y, speed, health, sprite);
		this.missiles = [];
	}

	update(canvas) {
		let spriteWidth = this.renderSettings.sprite.width;

		if (this.position.x <= 0) {
			this.position.x = canvas.width - spriteWidth;
		}
		this.position.x -= this.stats.speed;
	}
}
