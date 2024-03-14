// Purpose: Load images, sprites and data for use in the game.

//Load background images
const backgrounds = {
	stageOne: '/assets/stage/background/five.png',
};

//Load data

let angelsData;
let playerData;
let missilesData;

export default async function loadAssets() {
	fetch('/assets/angel/angelData.json')
		.then(response => response.json())
		.then(data => (angelsData = data));

	fetch('/assets/player/playerData.json')
		.then(response => response.json())
		.then(data => (playerData = data));

	fetch('/assets/missile/missileData.json')
		.then(response => response.json())
		.then(data => (missilesData = data));
}

export { angelsData, playerData, missilesData };
export { backgrounds };
