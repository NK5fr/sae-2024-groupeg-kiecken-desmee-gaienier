import Entity from './entity.js';
import Missile from './missile.js';

export default class Player extends Entity {
	constructor(x, y, properties) {
		super(x, y, properties);

		this.speedX = 0;
		this.speedY = 0;
		this.direction = {
			up: false,
			down: false,
			left: false,
			right: false,
		};

		this.missiles = [];
		this.missileType = properties.missileType;

		this.fireIsOn = false;
		this.fireAngle = 0;
		this.fireRate = properties.fireRate;
		this.fireNextShotIn = 0;
	}

	/**
	 * Méthode qui affiche le joueur sur le canvas
	 * @param {*} context Le contexte du canvas
	 */
	render(context) {
		const img = new Image();
		if (this.speedX == 0) {
			img.src = this.sprite.idle;
		} else if (this.speedX > 0) {
			img.src = this.sprite.right;
		} else if (this.speedX < 0) {
			img.src = this.sprite.left;
		}
		context.drawImage(img, this.posX, this.posY);
		this.missiles.forEach(missile => missile.render(context));
	}

	/**
	 * Méthode qui affiche la barre de vie du joueur sur le canvas
	 * @param {*} context Le contexte du canvas
	 * @param {*} height La hauteur du canvas
	 */
	renderHealthBar(context, height) {
		let healthBarWidth = (this.health / this.maxHealth) * 100;
		context.beginPath();
		context.rect(10, height - 20, 100, 10);
		context.strokeStyle = 'black';
		context.lineWidth = 2;
		context.stroke();
		context.fillStyle = this.calculateCurrentColorBasedOnHealth();
		context.fillRect(10, height - 20, healthBarWidth, 10);
	}

	/**
	 * Méthode qui calcule la couleur actuelle de la barre de vie du joueur
	 * @returns La couleur actuelle de la barre de vie du joueur représentée en rgb
	 */
	calculateCurrentColorBasedOnHealth() {
		let green = Math.floor((this.health / this.maxHealth) * 255);
		let red = 255 - green;
		return `rgb(${red}, ${green}, 0)`;
	}

	/**
	 * Méthode qui met à jour la position du joueur sur le canvas et celle de ses missiles
	 * @param {*} width La largeur du canvas
	 * @param {*} height La hauteur du canvas
	 */
	update(width, height) {
		if (this.direction.up) this.accelerateUp();
		else this.decelerateUp();
		if (this.direction.down) this.accelerateDown();
		else this.decelerateDown();
		if (this.direction.left) this.accelerateLeft();
		else this.decelerateLeft();
		if (this.direction.right) this.accelerateRight();
		else this.decelerateRight();

		if (this.canMoveOnX(width)) this.posX += this.speedX;
		if (this.canMoveOnY(height)) this.posY += this.speedY;

		this.missiles = this.missiles.filter(missile => missile.health > 0);
		this.missiles.forEach(missile => missile.update(width, height));

		if (this.fireIsOn) {
			if (this.fireNextShotIn <= 0) {
				this.fire();
				this.fireNextShotIn = this.fireRate;
			}
		}
		this.fireNextShotIn--;
	}

	/**
	 * Méthode qui gère le tir du joueur
	 */
	fire() {
		this.missiles.push(
			Missile.createMissile(
				this.posX,
				this.posY,
				this.width,
				this.height,
				this.missileType,
				this.fireAngle
			)
		);
	}

	canMoveOnX(width) {
		return (
			this.posX + this.speedX > 0 &&
			this.posX + this.speedX + this.width < width
		);
	}

	canMoveOnY(height) {
		return (
			this.posY + this.speedY > 0 &&
			this.posY + this.speedY + this.height < height
		);
	}

	accelerateUp() {
		if (this.speedY > -this.speed) this.speedY--;
	}
	accelerateDown() {
		if (this.speedY < this.speed) this.speedY++;
	}
	accelerateLeft() {
		if (this.speedX > -this.speed) this.speedX--;
	}
	accelerateRight() {
		if (this.speedX < this.speed) this.speedX++;
	}

	decelerateUp() {
		if (this.speedY < 0) this.speedY++;
	}
	decelerateDown() {
		if (this.speedY > 0) this.speedY--;
	}
	decelerateLeft() {
		if (this.speedX < 0) this.speedX++;
	}
	decelerateRight() {
		if (this.speedX > 0) this.speedX--;
	}

	/**
	 * Méthode qui gère l'événement de pression d'une touche du clavier
	 * @param {*} key La touche du clavier qui a été pressée
	 */
	onKeyDown(key) {
		if (key === 'ArrowUp' || key === 'z') this.direction.up = true;
		if (key === 'ArrowDown' || key === 's') this.direction.down = true;
		if (key === 'ArrowLeft' || key === 'q') this.direction.left = true;
		if (key === 'ArrowRight' || key === 'd') this.direction.right = true;
	}

	/**
	 * Méthode qui gère l'événement de relâchement d'une touche du clavier
	 * @param {*} key La touche du clavier qui a été relâchée
	 */
	onKeyUp(key) {
		if (key === 'ArrowUp' || key === 'z') this.direction.up = false;
		if (key === 'ArrowDown' || key === 's') this.direction.down = false;
		if (key === 'ArrowLeft' || key === 'q') this.direction.left = false;
		if (key === 'ArrowRight' || key === 'd') this.direction.right = false;
	}

	/**
	 * Méthode qui gère l'événement de pression du bouton de la souris
	 * @param {*} event L'événement de pression du bouton de la souris
	 */
	onMouseDown(event) {
		this.fireIsOn = true;
	}

	/**
	 * Méthode qui gère l'événement de relâchement du bouton de la souris
	 */
	onMouseUp() {
		this.fireIsOn = false;
	}

	onMouseMove(event) {
		this.fireAngle = Math.atan2(
			event.clientY - this.posY - this.height / 2,
			event.clientX - this.posX - this.width / 2
		);
	}
}
