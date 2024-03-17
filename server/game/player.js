import Entity from './entity.js';
import Missile from './missile.js';

export default class Player extends Entity {
	constructor(socketId, x, y, properties) {
		console.log('Player', properties);
		super(x, y, properties);

		this.socketId = socketId;

		this.sprites = properties.sprite;
		this.sprite = this.sprites.idle;

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
		this.fireX = 0;
		this.fireY = 0;
		this.fireRate = properties.fireRate;
		this.fireNextShotIn = 0;
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

		if (this.speedX > 0) this.sprite = this.sprites.right;
		else if (this.speedX < 0) this.sprite = this.sprites.left;
		else this.sprite = this.sprites.idle;

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
		const fireAngle = Math.atan2(
			this.fireY - this.posY - this.height / 2,
			this.fireX - this.posX - this.width / 2
		);
		const posX = this.posX + this.width / 2;
		const posY = this.posY + this.height / 2;
		this.missiles.push(
			Missile.createMissile(posX, posY, this.missileType, fireAngle)
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
	onMouseDown(mouseX, mouseY) {
		this.fireIsOn = true;
		this.fireX = mouseX;
		this.fireY = mouseY;
	}

	/**
	 * Méthode qui gère l'événement de relâchement du bouton de la souris
	 */
	onMouseUp() {
		this.fireIsOn = false;
	}

	onMouseMove(mouseX, mouseY) {
		this.fireX = mouseX;
		this.fireY = mouseY;
	}
}
