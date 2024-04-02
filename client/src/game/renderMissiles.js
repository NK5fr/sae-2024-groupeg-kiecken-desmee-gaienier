const missileSkinPath = 'assets/missile';
const missileImage = new Image();

function renderMissile(missile, context) {
	missileImage.src = `${missileSkinPath}/${missile.type}.png`;
	context.save();
	context.translate(
		missile.posX + missile.hitboxWidth / 2,
		missile.posY + missile.hitboxHeight / 2
	);
	context.rotate(missile.fireAngle);
	context.drawImage(
		missileImage,
		-missile.hitboxWidth / 2,
		-missile.hitboxHeight / 2
	);
	context.restore();
}

export function renderMissiles(missiles, context) {
	missiles.forEach(missile => {
		renderMissile(missile, context);
	});
}

function renderMissileHitbox(missile, context) {
	context.beginPath();
	context.rect(missile.posX, missile.posY, missile.width, missile.height);
	context.strokeStyle = 'red';
	context.stroke();
	context.closePath();
}

export function renderMissilesHitbox(missiles, context) {
	missiles.forEach(missile => {
		renderMissileHitbox(missile, context);
	});
}
