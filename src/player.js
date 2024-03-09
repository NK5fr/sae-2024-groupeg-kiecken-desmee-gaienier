import Entity from './entity.js';
import Missile from './missiles.js';

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
		if (this.direction.up) this.accelerateUpOrLeft('Y');
		else this.decelerateUpOrLeft('Y');
		if (this.direction.down) this.accelerateDownOrRight('Y');
		else this.decelerateDownOrRight('Y');
		if (this.direction.left) this.accelerateUpOrLeft('X');
		else this.decelerateUpOrLeft('X');
		if (this.direction.right) this.accelerateDownOrRight('X');
		else this.decelerateDownOrRight('X');

		if (this.canMoveOnAxis('X', width)) this.posX += this.speedX;
		if (this.canMoveOnAxis('Y', height)) this.posY += this.speedY;

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

	/**
	 * Méthode qui gère les collisions entre le joueur et les bordures du canvas
	 * @param {*} axis L'axe sur lequel on veut vérifier la collision
	 * @param {*} bound La limite du canvas au niveau de l'axe sur lequel on veut vérifier la collision
	 * @returns true si le joueur peut se déplacer sur l'axe donné, false sinon
	 */
	canMoveOnAxis(axis, bound) {
		let position = this[`pos${axis}`];
		let speed = this[`speed${axis}`];
		let widthOrHeight = this[axis === 'X' ? 'width' : 'height'];
		return position + speed > 0 && position + speed + widthOrHeight < bound;
	}

	/**
	 * Méthode qui gère l'accélération du joueur vers le haut ou la gauche
	 * @param {*} axis L'axe sur lequel on veut accélérer le joueur
	 */
	accelerateUpOrLeft(axis) {
		if (this[`speed${axis}`] > -this.speed) this[`speed${axis}`]--;
	}

	/**
	 * Méthode qui gère l'accélération du joueur vers le bas ou la droite
	 * @param {*} axis L'axe sur lequel on veut accélérer le joueur
	 */
	accelerateDownOrRight(axis) {
		if (this[`speed${axis}`] < this.speed) this[`speed${axis}`]++;
	}

	/**
	 * Méthode qui gère la décélération du joueur vers le haut ou la gauche
	 * @param {*} axis L'axe sur lequel on veut décélérer le joueur
	 */
	decelerateUpOrLeft(axis) {
		if (this[`speed${axis}`] < 0) this[`speed${axis}`]++;
	}

	/**
	 * Méthode qui gère la décélération du joueur vers le bas ou la droite
	 * @param {*} axis L'axe sur lequel on veut décélérer le joueur
	 */
	decelerateDownOrRight(axis) {
		if (this[`speed${axis}`] > 0) this[`speed${axis}`]--;
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
		this.fireAngle = Math.atan2(
			event.clientY - this.posY - this.height / 2,
			event.clientX - this.posX - this.width / 2
		);
	}

	/**
	 * Méthode qui gère l'événement de relâchement du bouton de la souris
	 */
	onMouseUp() {
		this.fireIsOn = false;
	}
}
