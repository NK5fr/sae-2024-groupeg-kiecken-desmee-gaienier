const angelSkinPath = 'assets/angel';
const angelImage = [];

export default function renderAngel(angel, context) {
	let angelImage = angelImage.find(
		image => image.src === `${angelSkinPath}/${angel.species}/${angel.type}.png`
	);
	if (!angelImage) {
		angelImage = new Image();
		angelImage.src = `${angelSkinPath}/${angel.species}/${angel.type}.png`;
		angelImage.push(angelImage);
	}
	angelImage.src = `${angelSkinPath}/${angel.species}/${angel.type}.png`;
	context.drawImage(angelImage, angel.posX, angel.posY);
}

export function renderAngels(angels, context) {
	angels.forEach(entity => renderAngel(entity, context));
}
