import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import Entity from './entity.js';

const entityProperties = {
	health: 1,
	speed: 1,
	damage: 1,
	sprite: 'sprite',
	width: 32,
	height: 32,
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
		assert.equal(entity.sprite, 'sprite');
		assert.equal(entity.width, 32);
		assert.equal(entity.height, 32);
	});

	it('should destroy on collision', () => {
		const entity = new Entity(0, 0, entityProperties);
		const entity2 = new Entity(30, 0, entityProperties);
		entity.checkCollision(entity2);
		assert.equal(entity.health, 0);
		assert.equal(entity2.health, 0);
	});

	it('should not destroy on collision', () => {
		const entity = new Entity(0, 0, entityProperties);
		const entity2 = new Entity(33, 0, entityProperties);
		entity.checkCollision(entity2);
		assert.equal(entity.health, 1);
		assert.equal(entity2.health, 1);
	});

	it('should destroy with all entities colliding', () => {
		const entity = new Entity(0, 0, entityProperties);
		const entity2 = new Entity(10, 0, entityProperties);
		const entity3 = new Entity(20, 0, entityProperties);
		entity.checkCollisions([entity2, entity3]);
		assert.equal(entity.health, 0);
		assert.equal(entity2.health, 0);
		assert.equal(entity3.health, 0);
	});
});
