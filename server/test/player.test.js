import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import Player from '../game/player.js';

const playerProperties = {
	health: 2,
	damage: 4,
	speed: 6,
	fireSpeed: 8,
	hitboxWidth: 30,
	hitboxHeight: 30,
	currentSkin: 'sprite',
	currentWeapon: 'card',
	skinsPool: ['sprite'],
	weaponsPool: ['card'],
	souls: 0,
};

describe('Player', () => {
	const player = new Player(20, 20, playerProperties, 'socket');

	it('should has all properties', () => {
		assert.strictEqual(player.posX, 20);
		assert.strictEqual(player.posY, 20);
		assert.strictEqual(player.health, 15);
		assert.strictEqual(player.maxHealth, 15);
		assert.strictEqual(player.speed, 15);
		assert.strictEqual(player.damage, 9);
		assert.strictEqual(player.fireSpeed, 72);
		assert.strictEqual(player.hitboxWidth, 30);
		assert.strictEqual(player.hitboxHeight, 30);
		assert.strictEqual(player.currentSkin, 'sprite');
		assert.strictEqual(player.currentWeapon, 'card');
		assert.deepStrictEqual(player.skinsPool, ['sprite']);
		assert.deepStrictEqual(player.weaponsPool, ['card']);
		assert.strictEqual(player.souls, 0);
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
