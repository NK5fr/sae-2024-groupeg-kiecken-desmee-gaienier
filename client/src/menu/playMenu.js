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
			const target = $(event.currentTarget)
			window.sessionStorage.setItem('diff', target.attr('class'));
			target.addClass('active');
		});
		const diff = window.sessionStorage.getItem('diff');
		if(diff) {
			$(`.diff .${diff}`).addClass('active');
		} else {
			$(`.diff .normal`).addClass('active');
			window.sessionStorage.setItem('diff', 'normal');
		} 
	}

	static handleMenu(event) {
		event.preventDefault();
		if (this.showed) $('.menu', this.element).hide();
		else $('.menu', this.element).show();
		this.showed = !this.showed;
	}
}
