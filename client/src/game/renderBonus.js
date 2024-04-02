const bonusSkinPath = 'assets/bonus';
const bonusImage = new Image();

export default function renderBonus(bonus, context) {
	bonusImage.src = `${bonusSkinPath}/${bonus.type}.png`;
	console.log(bonusImage.posX, bonusImage.posY);
	context.save();
	context.globalAlpha = bonus.opacity;
	context.drawImage(bonusImage, bonus.posX, bonus.posY);
	context.restore();
}

export function renderAllBonus(bonuses, context) {
	bonuses.forEach(bonus => {
		renderBonus(bonus, context);
	});
}
