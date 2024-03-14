import { Wanderer } from './angel.js';
import { stageData, angelData } from './index.js';

export class Stage {
	constructor(name, width, height) {
		this.angelsSpecies = stageData[name].angelsSpecies;
		this.archangel = stageData[name].archangel;
		this.angels = [];

		this.background = stageData[name].background;
		this.backgroundX = 0;

		this.width = width;
		this.height = height;

		this.numberOfAngels = stageData[name].numberOfAngels;
		this.numberOfAngelsSpawned = 0;
		this.numberOfAngelsKilled = 0;
	}

	renderAngels(context) {
		this.angels.forEach(angel => angel.render(context));
	}

	update(canvas) {
		this.angels = this.angels.filter(angel => angel.health > 0);
		this.numberOfAngelsKilled = this.numberOfAngelsSpawned - this.angels.length;
		this.angels.forEach(angel => angel.update(canvas));
	}

	spawnAngels(width, height, gameNotFocused) {
		let x = width;
		let y = Math.floor(Math.random() * height);

		if (gameNotFocused) return;
		if (this.numberOfAngelsSpawned < this.numberOfAngels) {
			this.angels.push(
				new Wanderer(x, y, angelData[this.angelsSpecies]['one'])
			);
			this.numberOfAngelsSpawned++;
		}
	}

	stageIsClear() {
		return (
			this.numberOfAngelsSpawned === this.numberOfAngels &&
			this.angels.length === 0
		);
	}
}
