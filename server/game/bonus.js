import Entity from './entity.js';
import { bonusData } from '../index.js';

export default class Bonus extends Entity {
	constructor(x, y, type, propeties) {
		super(x, y, propeties);
		this.health = 1;
		this.percent = propeties.percent;
		this.type = type;
		this.opacity = 1;
		setInterval(() => this.fade(), 500);
	}

	fade() {
		this.opacity -= 0.1;
		if (this.opacity <= 0) {
			this.health = 0;
		}
	}

	static createBonus(posX, posY, type) {
		return new Bonus(posX, posY, type, bonusData[type]);
	}
}
