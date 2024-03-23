import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import Missile from '../game/missile.js';

const missileProperties = {
	health: 1,
	speed: 1,
	damage: 1,
	sprite: 'sprite',
	width: 30,
	height: 30,
};

describe('Missile', () => {
	const missile = new Missile(0, 0, missileProperties, 0);

	it('should has all properties', () => {
		assert.equal(missile.posX, 0);
		assert.equal(missile.posY, 0);
		assert.equal(missile.health, 1);
		assert.equal(missile.maxHealth, 1);
		assert.equal(missile.speed, 1);
		assert.equal(missile.damage, 1);
		assert.equal(missile.sprite, 'sprite');
		assert.equal(missile.width, 30);
		assert.equal(missile.height, 30);
		assert.equal(missile.fireAngle, 0);
	});

	it('is out of canvas', () => {
		missile.posX = -100;
		missile.posY = -100;
		assert.equal(missile.isOutOfCanvas(200, 200), true);
	});

	it('is not out of canvas', () => {
		missile.posX = 100;
		missile.posY = 100;
		assert.equal(missile.isOutOfCanvas(200, 200), false);
	});

	it('is properly updated', () => {
		missile.posX = 0;
		missile.posY = 0;

		missile.update(1, 1);
		assert.equal(missile.posX, 1);
		assert.equal(missile.posY, 0);

		missile.fireAngle = Math.PI / 2;
		missile.update(1, 1);
		assert.equal(missile.posX, 1);
		assert.equal(missile.posY, 1);

		missile.fireAngle = Math.PI;
		missile.update(1, 1);
		assert.equal(missile.posX, 0);
		assert.equal(missile.posY, 1);

		missile.fireAngle = (3 * Math.PI) / 2;
		missile.update(1, 1);
		assert.equal(missile.posX, 0);
		assert.equal(missile.posY, 0);
	});
});
