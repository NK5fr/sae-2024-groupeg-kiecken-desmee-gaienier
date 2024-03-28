const angelSkinPath = 'assets/angel';
const angelImage = new Image();

export default function renderAngel(angel, context) {
	angelImage.src = `${angelSkinPath}/${angel.species}/${angel.type}.png`;
	context.drawImage(angelImage, angel.posX, angel.posY);
}

export function renderAngels(angels, context) {
	angels.forEach(entity => renderAngel(entity, context));
}
