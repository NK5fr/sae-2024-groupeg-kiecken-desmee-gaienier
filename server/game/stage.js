import { DiagWanderer, Shooter, Wanderer } from './angel.js';
import { stagesProperties, angelsProperties } from '../index.js';
import Bonus from './bonus.js';

export class Stage {
	constructor(name) {
		this.name = name;

		this.angelsSpecies = stagesProperties[name].angelsSpecies;
		this.archangel = stagesProperties[name].archangel;
		this.angels = [];

		this.strandedMissiles = [];
		this.bonus = [];

		this.background = stagesProperties[name].background;
		this.backgroundX = 0;

		this.nameImage = stagesProperties[name].nameImage;
		this.nameOpacity = 1;

		this.numberOfAngels = stagesProperties[name].numberOfAngels;
		this.numberOfAngelsSpawned = 0;
		this.numberOfAngelsKilled = 0;
	}

	update(player) {
		this.angels.forEach(angel => {
			if (angel.health <= 0) {
				this.onAngelDeath(player, angel);
			}
		});
		this.angels = this.angels.filter(angel => angel.health > 0);
		this.bonus = this.bonus.filter(bonus => bonus.health > 0);
		this.numberOfAngelsKilled = this.numberOfAngelsSpawned - this.angels.length;
	}

	chooseBonusType() {
		const random = Math.random();
		if (random < 0.25) {
			return 'health';
		} else if (random < 0.5) {
			return 'damage';
		} else if (random < 0.75) {
			return 'fireSpeed';
		} else {
			return 'speed';
		}
	}

	bonusWillSpawn() {
		return Math.random() < 0.1;
	}

	onAngelDeath(player, angel) {
		this.giveSouls(player, angel);
		if (angel.missiles) {
			this.strandedMissiles = this.strandedMissiles.concat(angel.missiles);
		}
		if (this.bonusWillSpawn()) {
			this.bonus.push(
				Bonus.createBonus(angel.posX, angel.posY, this.chooseBonusType())
			);
		}
	}

	giveSouls(player, angel) {
		if (angel.species === this.archangel) {
			player.souls += 150;
		} else {
			player.souls +=
				angel.type == 'three' ? 40 : angel.type == 'two' ? 25 : 10;
		}
	}

	spawnAngels(width, height) {
		let x = width;
		let y = Math.floor(Math.random() * height);
		if (this.numberOfAngelsSpawned < this.numberOfAngels) {
			const angelType = this.chooseAngelType();
			const currentAngelData = angelsProperties[this.angelsSpecies][angelType];
			let angel;
			switch (angelType) {
				case 'one':
					angel = new Wanderer(
						x,
						y,
						this.angelsSpecies,
						angelType,
						currentAngelData
					);
					break;
				case 'two':
					angel = new DiagWanderer(
						x,
						y,
						this.angelsSpecies,
						angelType,
						currentAngelData
					);
					break;
				case 'three':
					angel = new Shooter(
						x,
						y,
						this.angelsSpecies,
						angelType,
						currentAngelData
					);
					break;
			}
			this.angels.push(angel);
			this.numberOfAngelsSpawned++;
		}
	}

	chooseAngelType() {
		const random = Math.random();
		if (random < 0.2) {
			return 'three';
		} else if (random < 0.5) {
			return 'two';
		} else {
			return 'one';
		}
	}

	stageIsClear() {
		return (
			this.numberOfAngelsSpawned === this.numberOfAngels &&
			this.angels.length === 0
		);
	}
}
