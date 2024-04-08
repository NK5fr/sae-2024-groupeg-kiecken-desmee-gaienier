import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import Entity from '../game/entity.js';

const entityProperties = {
	health: 1,
	speed: 1,
	damage: 1,
	hitboxWidth: 30,
	hitboxHeight: 30,
};

describe('Entity', () => {
	it('should has all properties', () => {
		const entity = new Entity(0, 0, entityProperties);
		assert.equal(entity.posX, 0);
		assert.equal(entity.posY, 0);
		assert.equal(entity.health, 1);
		assert.equal(entity.maxHealth, 1);
		assert.equal(entity.speed, 1);
		assert.equal(entity.damage, 1);
		assert.equal(entity.hitboxWidth, 30);
		assert.equal(entity.hitboxHeight, 30);
	});

	it('should detect collision', () => {
		const entity = new Entity(0, 0, entityProperties);
		const otherEntity = new Entity(0, 0, entityProperties);
		assert.equal(entity.checkCollision(otherEntity), true);
	});

	it('should not detect collision', () => {
		const entity = new Entity(0, 0, entityProperties);
		const otherEntity = new Entity(100, 100, entityProperties);
		assert.equal(entity.checkCollision(otherEntity), false);
	});
});
