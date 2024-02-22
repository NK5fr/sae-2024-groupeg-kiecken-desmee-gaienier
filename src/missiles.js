import Entity from './entity.js';

export default class Missile extends Entity {
	constructor(x, y, speed, sprite) {
		super(x, y, speed, 1, sprite);
		this.damage = 1;
	}

	render(context) {
		context.drawImage(this.sprite, this.posX, this.posY);
	}

	update(canvas) {
		this.posX += this.speed;
		if (this.posX == 0 || this.posX + this.width == canvas.width) {
			this.health = 0;
		}
	}
}
