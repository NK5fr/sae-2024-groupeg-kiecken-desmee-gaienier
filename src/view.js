export default class View {

	element;

	constructor(element) {
		this.element = element;
	}

	show() {
		this.element.classList.add('active');
	}

	hide() {
		this.element.classList.remove('active');
	}
}
