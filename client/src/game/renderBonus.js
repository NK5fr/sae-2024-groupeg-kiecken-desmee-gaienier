import { images } from '../main.js';

export default function renderBonus(bonus, context) {
	const image = images.bonus[bonus.type];
	context.save();
	context.globalAlpha = bonus.opacity;
	context.drawImage(image, bonus.posX, bonus.posY);
	context.restore();
}

export function renderAllBonus(bonuses, context) {
	bonuses.forEach(bonus => {
		renderBonus(bonus, context);
	});
}
