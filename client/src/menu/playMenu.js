import $ from 'jquery';

export default class PlayMenu {
	static showed = false;
	static element;

	static setMenu(element) {
		this.element = element;
		$('.jouer', this.element).on('click', event => this.handleMenu(event));
		$('.diff button', this.element).on('click', event => {
			event.preventDefault();
			$('.diff .active', this.element).removeClass('active');
			$(event.currentTarget).addClass('active');
		});
		$('.diff .normal').addClass('active');
	}

	static handleMenu(event) {
		event.preventDefault();
		if (this.showed) $('.menu', this.element).hide();
		else $('.menu', this.element).show();
		this.showed = !this.showed;
	}
}
