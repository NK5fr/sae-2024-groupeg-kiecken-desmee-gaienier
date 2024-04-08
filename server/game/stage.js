import { DiagWanderer, Shooter, Wanderer, Chaser, Boss } from './angel.js';
import { stagesProperties, angelsProperties } from '../index.js';
import Bonus from './bonus.js';

export class Stage {
	constructor(name) {
		this.name = name;

		this.angelsSpecies = stagesProperties[name].angelsSpecies;
		this.archangelName = stagesProperties[name].archangel;

		this.angels = [];
		this.archangel = undefined;

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

	update() {
		this.angels.forEach(angel => {
			if (angel.health <= 0) {
				this.onAngelDeath(angel);
			}
		});
		this.angels = this.angels.filter(angel => angel.health > 0);
		this.bonus = this.bonus.filter(bonus => bonus.health > 0);
		this.numberOfAngelsKilled = this.numberOfAngelsSpawned - this.angels.length;
	}

	bonusWillSpawn() {
		return Math.random() < 0.1;
	}

	chooseBonusType() {
		const random = Math.random();
		if (random < 0.25) return 'health';
		else if (random < 0.5) return 'damage';
		else if (random < 0.75) return 'fireSpeed';
		else return 'speed';
	}

	onAngelDeath(angel) {
		if (angel.missiles) {
			this.strandedMissiles = this.strandedMissiles.concat(angel.missiles);
		}
		if (this.bonusWillSpawn()) {
			this.bonus.push(
				Bonus.createBonus(angel.posX, angel.posY, this.chooseBonusType())
			);
		}
	}

	applyDifficulty(difficulty, properties) {
		const currentAngelData = { ...properties };
		if (difficulty == 1) {
			currentAngelData.health *= 0.5;
			currentAngelData.damage *= 0.5;
			currentAngelData.speed *= 0.5;
			return currentAngelData;
		} else if (difficulty == 2) return currentAngelData;
		else if (difficulty == 3) {
			currentAngelData.health *= 1.5;
			currentAngelData.damage *= 1.5;
			currentAngelData.speed *= 1.5;
			return currentAngelData;
		}
	}

	spawnAngels(width, height, difficulty) {
		let x = width;
		let y = Math.floor(Math.random() * height);
		y = Math.min(y, height - 96);
		if (this.numberOfAngelsSpawned < this.numberOfAngels) {
			const angelType = this.chooseAngelType();
			const currentAngelData = this.applyDifficulty(
				difficulty,
				angelsProperties[this.angelsSpecies][angelType]
			);

			let angel;
			switch (angelType) {
				case 'one':
					if (Math.random() < 0.5) {
						angel = new Wanderer(
							x,
							y,
							this.angelsSpecies,
							angelType,
							currentAngelData
						);
					} else {
						angel = new Chaser(
							x,
							y,
							this.angelsSpecies,
							angelType,
							currentAngelData
						);
					}
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

	launchBossFight(width, height, difficulty) {
		let x = width - 200;
		let y = height / 2 - 150;
		const currentAngelData = this.applyDifficulty(
			difficulty,
			angelsProperties['archange'][this.archangelName]
		);
		this.archangel = new Boss(
			x,
			y,
			'archange',
			this.archangelName,
			currentAngelData,
			this.angels
		);
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

	bossIsDead() {
		if (!this.archangel) return false;
		return this.archangel.health <= 0;
	}
}
