export default class Entity {
	constructor(posX, posY, speed, health, sprite) {
		this.posX = posX;
		this.posY = posY;
		this.speed = speed;
		this.health = health;
		this.maxHealth = health;
		this.sprite = sprite;
	}

	render(context) {
		context.drawImage(this.sprite, this.posX, this.posY);
	}

	update() {
		console.log('Updating entity');
	}
}
