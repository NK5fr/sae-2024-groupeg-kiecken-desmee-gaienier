const entityImage = new Image();

export default function renderEntity(entity, context) {
	entityImage.src = entity.sprite;
	context.drawImage(entityImage, entity.posX, entity.posY);
}

export function renderEntities(entities, context) {
	entities.forEach(entity => renderEntity(entity, context));
}
