export default class Draw {
	constructor(x, y, lineWidth, strokeStyle) {
		this.origin = { x, y };
		this.coords = [];
		this.renderParameter = { lineWidth, strokeStyle };
	}

	append(x, y) {
		this.coords.push({ x, y });
	}

	render(context) {
		this.renderSetUp(context);
		context.beginPath();
		context.moveTo(this.origin.x, this.origin.y);
		this.coords.forEach(({ x, y }) => context.lineTo(x, y));
		context.stroke();
	}

	renderSetUp(context) {
		context.lineWidth = this.renderParameter.lineWidth;
		context.strokeStyle = this.renderParameter.strokeStyle;
	}
}
