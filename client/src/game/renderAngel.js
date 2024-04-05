import { images } from '../main.js';

export default function renderAngel(angel, context) {
	const image = images.angels[angel.species][angel.type];
	context.drawImage(image, angel.posX, angel.posY);
}

export function renderAngels(angels, context) {
	angels.forEach(entity => renderAngel(entity, context));
}
