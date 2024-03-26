const missileImage = new Image();

function renderMissile(missile, context) {
	missileImage.src = missile.sprite;
	context.save();
	context.translate(
		missile.posX + missile.width / 2,
		missile.posY + missile.height / 2
	);
	context.rotate(missile.fireAngle);
	context.drawImage(missileImage, -missile.width / 2, -missile.height / 2);
	context.restore();
}

export function renderMissiles(missiles, context) {
	missiles.forEach(missile => {
		renderMissile(missile, context);
	});
}

function renderMissileHitbox(missile, context) {
	context.save();
	context.beginPath();
	context.rect(missile.posX, missile.posY, missile.width, missile.height);
	context.strokeStyle = 'red';
	context.stroke();
	context.closePath();
	context.restore();
}

export function renderMissilesHitbox(missiles, context) {
	missiles.forEach(missile => {
		renderMissileHitbox(missile, context);
	});
}
