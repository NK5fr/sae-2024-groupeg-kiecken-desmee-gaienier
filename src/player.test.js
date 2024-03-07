import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import Player from './player.js';

const playerProperties = {
	health: 1,
	speed: 1,
	damage: 1,
	sprite: 'sprite',
	width: 32,
	height: 32,
	missileType: 'card',
	fireRate: 25,
};

describe('Player', () => {
	it('should has all properties', () => {
		const player = new Player(0, 0, playerProperties);
		assert.equal(player.posX, 0);
		assert.equal(player.posY, 0);
		assert.equal(player.health, 1);
		assert.equal(player.maxHealth, 1);
		assert.equal(player.speed, 1);
		assert.equal(player.damage, 1);
		assert.equal(player.sprite, 'sprite');
		assert.equal(player.width, 32);
		assert.equal(player.height, 32);
		assert.equal(player.missileType, 'card');
		assert.equal(player.fireRate, 25);
	});

	it('player can move on X axis', () => {
		const player = new Player(10, 10, playerProperties);
	});
});
