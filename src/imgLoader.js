// Purpose: Load images for use in the game.

//Load angel images
const angels = {
	puissance: new Image(),
};
angels.puissance.src = '/assets/angels/puissance.png';

//Load background images
const backgrounds = {
	stageOne: new Image(),
};
backgrounds.stageOne.src = '/assets/backgrounds/stageOne.png';

//Load missile images
const missiles = {
	card: new Image(),
};
missiles.card.src = '/assets/missiles/card.png';

//Load player images
const players = {
	left: new Image(),
	neutral: new Image(),
	right: new Image(),
};
players.left.src = '/assets/player/left.png';
players.neutral.src = '/assets/player/neutral.png';
players.right.src = '/assets/player/right.png';

export { angels, backgrounds, missiles, players };
