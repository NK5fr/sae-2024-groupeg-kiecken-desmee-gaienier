import $ from 'jquery';
import { socket, userName } from '../main.js';

export default class CarouselStat {
	constructor(element, actualLevel, statName) {
		this.element = element;
		this.actualLevel = actualLevel;
		this.statName = statName;

		$('.carousel-control-next', this.element).on('click', event => {
			event.preventDefault();
			this.actualLevel++;
			if (this.actualLevel > 10) this.actualLevel = 10;
			socket.emit('stat', {
				statName: this.statName,
				value: this.actualLevel,
				userName: userName,
			});
			this.setCarousel();
		});
		this.setCarousel();
	}

	setCarousel() {
		let html = `<div class="carousel-item active"><h1>${this.actualLevel}</h1><p>Passer au niveau suivant vous demandera 100 pièces</p></div>`;
		$('.carousel-inner', this.element).html(html);
	}
}
