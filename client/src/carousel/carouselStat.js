import $ from 'jquery';
import { socket, userName } from '../main.js';

const healthPrice = 250;
const damagePrice = 300;
const fireSpeedPrice = 400;
const speedPrice = 150;

export default class CarouselStat {
	constructor(element, actualLevel, statName) {
		this.element = element;
		this.actualLevel = actualLevel;
		this.statName = statName;
		if (this.statName === 'health') this.price = healthPrice;
		else if (this.statName === 'damage') this.price = damagePrice;
		else if (this.statName === 'fireSpeed') this.price = fireSpeedPrice;
		else this.price = speedPrice;

		for (let i = 1; i < this.actualLevel; i++) {
			this.price = Math.round(this.price * 1.5);
		}

		this.setCarousel();

		$('.carousel-control-next', this.element).on('click', event => {
			event.preventDefault();
			if (this.actualLevel === 10) return;
			this.actualLevel++;
			socket.emit('stat purchase tentative', {
				userName: userName,
				statName: this.statName,
				value: this.actualLevel,
				price: this.price,
			});
			socket.on('stat purchase validation', ({ validate, statName }) => {
				if (statName !== this.statName) return;
				if (!validate) {
					if (this.actualLevel === 1) return;
					this.actualLevel--;
					return;
				}
				this.price = Math.round(this.price * 1.5);
				this.setCarousel();
			});
		});
	}

	setCarousel() {
		let html =
			`<div class="carousel-item active"><h1>${this.actualLevel}</h1>` +
			`<p>Passer au niveau suivant vous demandera ${this.price} pièces</p></div>`;
		$('.carousel-inner', this.element).html(html);
	}
}
