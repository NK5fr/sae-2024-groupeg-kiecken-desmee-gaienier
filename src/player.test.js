import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import Player from './player.js';

const playerProperties = {
	health: 5,
	speed: 10,
	damage: 10,
	sprite: 'sprite',
	width: 48,
	height: 96,
	missileType: 'card',
	fireRate: 25,
};

describe('Player', () => {
	it('should has all properties', () => {
		const player = new Player(0, 0, playerProperties);
		assert.equal(player.posX, 0);
		assert.equal(player.posY, 0);
		assert.equal(player.health, 5);
		assert.equal(player.maxHealth, 5);
		assert.equal(player.speed, 10);
		assert.equal(player.damage, 10);
		assert.equal(player.sprite, 'sprite');
		assert.equal(player.width, 48);
		assert.equal(player.height, 96);
		assert.equal(player.missileType, 'card');
		assert.equal(player.fireRate, 25);
	});

	it('player can move on X axis', () => {
		const player = new Player(10, 10, playerProperties);
		assert.equal(player.canMoveOnAxis('X', 200), true);
	});

	it('player can move on Y axis', () => {
		const player = new Player(10, 10, playerProperties);
		assert.equal(player.canMoveOnAxis('Y', 200), true);
	});

	it('player can not move on X axis', () => {
		const player = new Player(160, 100, playerProperties);
		assert.equal(player.canMoveOnAxis('X', 200), false);
	});

	it('player can not move on Y axis', () => {
		const player = new Player(100, 120, playerProperties);
		assert.equal(player.canMoveOnAxis('Y', 200), false);
	});

	it('player accelerate Up Or Left', () => {
		const player = new Player(10, 10, playerProperties);
		player.accelerateUpOrLeft('X');
		assert.equal(player.speedX, -1);
		for (let i = 0; i < 10; i++) {
			player.accelerateUpOrLeft('X');
		}
		assert.equal(player.speedX, -10);

		player.accelerateUpOrLeft('Y');
		assert.equal(player.speedY, -1);
		for (let i = 0; i < 10; i++) {
			player.accelerateUpOrLeft('Y');
		}
		assert.equal(player.speedY, -10);
	});

	it('player accelerate Down Or Right', () => {
		const player = new Player(10, 10, playerProperties);
		player.accelerateDownOrRight('X', 200);
		assert.equal(player.speedX, 1);
		for (let i = 0; i < 10; i++) {
			player.accelerateDownOrRight('X', 200);
		}
		assert.equal(player.speedX, 10);

		player.accelerateDownOrRight('Y', 200);
		assert.equal(player.speedY, 1);
		for (let i = 0; i < 10; i++) {
			player.accelerateDownOrRight('Y', 200);
		}
		assert.equal(player.speedY, 10);
	});

	it('player decelerate Up Or Left', () => {
		const player = new Player(10, 10, playerProperties);
		for (let i = 0; i < 10; i++) {
			player.accelerateUpOrLeft('X');
		}
		for (let i = 0; i < 5; i++) {
			player.decelerateUpOrLeft('X');
		}
		assert.equal(player.speedX, -5);

		for (let i = 0; i < 10; i++) {
			player.accelerateUpOrLeft('Y');
		}
		for (let i = 0; i < 5; i++) {
			player.decelerateUpOrLeft('Y');
		}
		assert.equal(player.speedY, -5);
	});

	it('player decelerate Down Or Right', () => {
		const player = new Player(10, 10, playerProperties);
		for (let i = 0; i < 10; i++) {
			player.accelerateDownOrRight('X', 200);
		}
		for (let i = 0; i < 5; i++) {
			player.decelerateDownOrRight('X');
		}
		assert.equal(player.speedX, 5);

		for (let i = 0; i < 10; i++) {
			player.accelerateDownOrRight('Y', 200);
		}
		for (let i = 0; i < 5; i++) {
			player.decelerateDownOrRight('Y');
		}
		assert.equal(player.speedY, 5);
	});

	it('player detect key down', () => {
		const player = new Player(10, 10, playerProperties);
		player.onKeyDown('ArrowUp');
		assert.equal(player.direction.up, true);
		player.onKeyDown('ArrowDown');
		assert.equal(player.direction.down, true);
		player.onKeyDown('ArrowLeft');
		assert.equal(player.direction.left, true);
		player.onKeyDown('ArrowRight');
		assert.equal(player.direction.right, true);
	});

	it('player detect key up', () => {
		const player = new Player(10, 10, playerProperties);
		player.onKeyUp('ArrowUp');
		assert.equal(player.direction.up, false);
		player.onKeyUp('ArrowDown');
		assert.equal(player.direction.down, false);
		player.onKeyUp('ArrowLeft');
		assert.equal(player.direction.left, false);
		player.onKeyUp('ArrowRight');
		assert.equal(player.direction.right, false);
	});

	it('player update position', () => {
		const player = new Player(10, 10, playerProperties);
		player.direction.up = true;
		player.update(200, 200);
		assert.equal(player.posY, 9);
		player.update(200, 200);
		assert.equal(player.posY, 7);
		player.direction.up = false;
		player.direction.right = true;
		player.update(200, 200);
		assert.equal(player.posX, 11);
		player.update(200, 200);
		assert.equal(player.posX, 13);
		player.direction.right = false;
	});
});
