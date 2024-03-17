import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import Player from '../game/player.js';

const playerProperties = {
	health: 5,
	speed: 10,
	damage: 10,
	sprite: 'sprite',
	width: 30,
	height: 30,
	missileType: 'card',
	fireRate: 25,
};

describe('Player', () => {
	const player = new Player(20, 20, playerProperties);

	it('should has all properties', () => {
		assert.strictEqual(player.posX, 20);
		assert.strictEqual(player.posY, 20);
		assert.strictEqual(player.health, 5);
		assert.strictEqual(player.maxHealth, 5);
		assert.strictEqual(player.speed, 10);
		assert.strictEqual(player.damage, 10);
		assert.strictEqual(player.sprite, 'sprite');
		assert.strictEqual(player.width, 30);
		assert.strictEqual(player.height, 30);
		assert.strictEqual(player.missileType, 'card');
		assert.strictEqual(player.fireRate, 25);
	});

	it('should detect key press', () => {
		player.onKeyDown('ArrowUp');
		assert.strictEqual(player.direction.up, true);
		player.onKeyDown('ArrowDown');
		assert.strictEqual(player.direction.down, true);
		player.onKeyDown('ArrowLeft');
		assert.strictEqual(player.direction.left, true);
		player.onKeyDown('ArrowRight');
		assert.strictEqual(player.direction.right, true);
	});

	it('should detect key release', () => {
		player.onKeyUp('ArrowUp');
		assert.strictEqual(player.direction.up, false);
		player.onKeyUp('ArrowDown');
		assert.strictEqual(player.direction.down, false);
		player.onKeyUp('ArrowLeft');
		assert.strictEqual(player.direction.left, false);
		player.onKeyUp('ArrowRight');
		assert.strictEqual(player.direction.right, false);
	});

	it('is properly updated', () => {
		player.update(100, 100);
		assert.strictEqual(player.posX, 20);
		assert.strictEqual(player.posY, 20);
		player.direction.up = true;
		player.update(100, 100);
		assert.strictEqual(player.posX, 20);
		assert.strictEqual(player.posY, 19);
		player.update(100, 100);
		assert.strictEqual(player.posX, 20);
		assert.strictEqual(player.posY, 17);
		player.direction.right = true;
		player.direction.up = false;
		player.update(100, 100);
		assert.strictEqual(player.posX, 21);
		assert.strictEqual(player.posY, 16);
		player.update(100, 100);
		assert.strictEqual(player.posX, 23);
		assert.strictEqual(player.posY, 16);
	});
});
