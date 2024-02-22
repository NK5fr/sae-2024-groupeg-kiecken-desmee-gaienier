// Purpose: Load images, sprites and data for use in the game.

//Load angel sprites
const angelsSprites = {
	puissance: {
		one: new Image(),
		two: new Image(),
		three: new Image(),
	},
	archange: {
		camael: new Image(),
	},
};
angelsSprites.puissance.one.src = '/assets/angels/puissance/one.png';
angelsSprites.puissance.two.src = '/assets/angels/puissance/two.png';
angelsSprites.puissance.three.src = '/assets/angels/puissance/three.png';
angelsSprites.archange.camael.src = '/assets/angels/camael.png';

//Load background images
const backgrounds = {
	stageOne: new Image(),
};
backgrounds.stageOne.src = '/assets/stages/background/one.png';

//Load missile sprites
const missilesSprites = {
	card: new Image(),
};
missilesSprites.card.src = '/assets/missiles/card.png';

//Load player sprites
const playersSprites = {
	left: new Image(),
	neutral: new Image(),
	right: new Image(),
};
playersSprites.left.src = '/assets/player/left.png';
playersSprites.neutral.src = '/assets/player/neutral.png';
playersSprites.right.src = '/assets/player/right.png';

//Load angel data

let angelsData;
fetch('/assets/angels/angelsData.json')
	.then(response => response.json())
	.then(data => (angelsData = data));

export { angelsSprites, backgrounds, missilesSprites, playersSprites };
export { angelsData };
