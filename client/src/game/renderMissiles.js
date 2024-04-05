import { images } from '../main.js';

function renderMissile(missile, context) {
	const image = images.missiles[missile.type];
	context.save();
	context.translate(
		missile.posX + missile.hitboxWidth / 2,
		missile.posY + missile.hitboxHeight / 2
	);
	context.rotate(missile.fireAngle);
	context.drawImage(image, -missile.hitboxWidth / 2, -missile.hitboxHeight / 2);
	context.restore();
}

export function renderMissiles(missiles, context) {
	missiles.forEach(missile => {
		renderMissile(missile, context);
	});
}

function renderMissileHitbox(missile, context) {
	context.beginPath();
	context.rect(
		missile.posX,
		missile.posY,
		missile.hitboxWidth,
		missile.hitboxHeight
	);
	context.strokeStyle = 'red';
	context.stroke();
	context.closePath();
}

export function renderMissilesHitbox(missiles, context) {
	missiles.forEach(missile => {
		renderMissileHitbox(missile, context);
	});
}
