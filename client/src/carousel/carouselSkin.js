import $, { event } from 'jquery';

export default class CarouselSkin {
	constructor(element, skins, ownedSkins, actualSkin, isProj) {
		this.element = element;
		this.skins = skins;
		this.ownedSkins = ownedSkins;
		this.actualSkin = actualSkin;
		this.actualIndex = 0;
		this.nbElement = 0;
		this.isProj = isProj;

		this.setCarousel();

		$('.carousel-control-prev', this.element).on('click', event => {
			event.preventDefault();
			this.actualIndex = this.modulo(this.actualIndex - 1, this.nbElement);
			$('.carousel-inner > .active', this.element).removeClass('active');
			$(
				`.carousel-inner > div:nth-child(${this.actualIndex + 1})`,
				this.element
			).addClass('active');
		});

		$('.carousel-control-next', this.element).on('click', event => {
			event.preventDefault();
			this.actualIndex = this.modulo(this.actualIndex + 1, this.nbElement);
			$('.carousel-inner > .active', this.element).removeClass('active');
			$(
				`.carousel-inner > div:nth-child(${this.actualIndex + 1})`,
				this.element
			).addClass('active');
		});
	}

	setCarousel() {
		let html = ``;
		let n = 0;
		this.skins.forEach(skin => {
			if (this.actualSkin === skin)
				html += `<div class="carousel-item active">`;
			else html += `<div class="carousel-item">`;

			if (this.isProj)
				html += `<img src="assets/missile/${skin}.png" name="${skin}">`;
			else html += `<img src="assets/player/${skin}/idle.png" name="${skin}">`;

			if (this.ownedSkins.includes(skin)) html += `<p>Cliquez pour équiper</p>`;
			else if (this.actualSkin === skin) html += `<p>Equipé</p>`;
			else html += `<p>Cliquez pour débloquer à 100 pièces</p>`;

			html += `</div>`;
			n++;
		});

		this.nbElement = n;
		$('.carousel-inner', this.element).html(html);
		this.setImageActions();
	}

	setImageActions() {
		$('.carousel-inner img', this.element).on('click', event => {
			event.preventDefault();
			const skin = $(event.currentTarget).attr('name');
			if (this.actualSkin === skin) {
				console.log(`Déjà équipé`);
			} else if (this.ownedSkins.includes(skin)) {
				console.log(`Equipé`);
				this.actualSkin = skin;
			} else {
				console.log(`Acheté`);
				this.ownedSkins.push(skin);
				this.actualSkin = skin;
			}
			this.setCarousel();
		});
	}

	modulo(n, m) {
		if (n >= 0) {
			return n % m;
		} else {
			return this.nbElement - 1;
		}
	}
}
