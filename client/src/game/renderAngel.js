import { images } from '../main.js';
import { renderMissiles } from './renderMissiles.js';

export default function renderAngel(angel, context) {
	const image = images.angels[angel.species][angel.type];
	context.drawImage(image, angel.posX, angel.posY);

	if (angel.missiles) renderMissiles(angel.missiles, context);
}

export function renderAngels(angels, context) {
	angels.forEach(entity => renderAngel(entity, context));
}
