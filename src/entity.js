export default class Entity {
	constructor(x, y, speed, health, sprite, width, height) {
		this.position = {
			x: x,
			y: y,
		};
		this.stats = {
			speed: speed,
			health: health,
			maxHealth: health,
		};
		this.renderSettings = {
			sprite: sprite,
		};
		this.hitbox = {
			width: width,
			height: height,
		};
	}

	render(context) {
		context.drawImage(
			this.renderSettings.sprite,
			this.position.x,
			this.position.y
		);
	}
}
