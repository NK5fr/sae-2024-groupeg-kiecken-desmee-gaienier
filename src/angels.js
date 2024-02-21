import Entity from './entity';

export default class Angel extends Entity {
	constructor(x, y, speed, health, width, height) {
		super(x, y, speed, health, null, width, height);
		this.missiles = [];
	}

	render(context) {
		context.beginPath();
		context.rect(
			this.position.x,
			this.position.y,
			this.renderSettings.width,
			this.renderSettings.height
		);
		context.fillStyle = 'red';
		context.fill();
	}

	update(canvas) {
		console.log(this.position.x);
		let spriteWidth = this.renderSettings.width;

		if (this.position.x <= 0) {
			this.position.x = canvas.width - spriteWidth;
		}
		this.position.x -= this.stats.speed;
	}
}
