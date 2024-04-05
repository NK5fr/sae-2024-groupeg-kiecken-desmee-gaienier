import Router from './router.js';
import PlayMenu from './menu/playMenu.js';
import $, { event } from 'jquery';
import { io } from 'socket.io-client';
import LoginMenu from './menu/loginMenu.js';
import startGameRenderer, {
	setGame,
	stopGameRenderer,
	startTransition,
} from './game/renderGame.js';
import CarouselStat from './carousel/carouselStat.js';
import CarouselSkin from './carousel/carouselSkin.js';
import ScoreMenu from './menu/scoreMenu.js';
import JoinMenu from './menu/joinMenu.js';

export const socket = io();

export let user = window.sessionStorage.getItem('user');

const playerCommands = [
	'ArrowUp',
	'ArrowDown',
	'ArrowLeft',
	'ArrowRight',
	'z',
	's',
	'q',
	'd',
	'Z',
	'S',
	'Q',
	'D',
	'g',
	'G',
];

PlayMenu.setMenu($('.menuJouer'));

LoginMenu.setLogin($('.login'));
LoginMenu.setSignin($('.signin'));
LoginMenu.setForgetPassword($('.mdp_oublie'));
socket.on('userResetPassword', login => {
	LoginMenu.setResetPassword($('.resetPassword'), login);
	Router.navigate('/resetPassword', true);
});
LoginMenu.setLogout($('.logout'));

const score = new ScoreMenu($('.scores'));
const game = new JoinMenu($('.join'));

export const images = {};
let resourcesToLoad = 0;

loadResources();

function loadResources() {
	socket.emit('getResourcesToLoad');
	socket.on('resourcesToLoad', ({ angel, bonus, missile, player }) => {
		resourcesToLoad =
			angel.length + bonus.length + missile.length + player.length;
		angel.forEach(({ species, type }) => {
			if (!images.angel) images.angel = {};
			if (!images.angel[species]) images.angel[species] = {};
			if (!images.angel[species][type])
				images.angel[species][type] = new Image();
			images.angel[species][type].src = `./assets/angel/${species}/${type}.png`;
			images.angel[species][type].onload = () => {
				resourcesToLoad--;
			};
		});
		bonus.forEach(({ type }) => {
			if (!images.bonus) images.bonus = {};
			if (!images.bonus[type]) images.bonus[type] = new Image();
			images.bonus[type].src = `./assets/bonus/${type}.png`;
			images.bonus[type].onload = () => {
				resourcesToLoad--;
			};
		});
		missile.forEach(({ skin }) => {
			if (!images.missiles) images.missiles = {};
			if (!images.missiles[skin]) images.missiles[skin] = new Image();
			images.missiles[skin].src = `./assets/missile/${skin}.png`;
			images.missiles[skin].onload = () => {
				resourcesToLoad--;
			};
		});
		player.forEach(({ skin }) => {
			if (!images.player) images.player = {};
			if (!images.player[skin]) images.player[skin] = {};
			images.player[skin].left = new Image();
			images.player[skin].left.src = `./assets/player/${skin}/left.png`;
			images.player[skin].idle = new Image();
			images.player[skin].idle.src = `./assets/player/${skin}/idle.png`;
			images.player[skin].idle.onload = () => {
				resourcesToLoad--;
			};
			images.player[skin].right = new Image();
			images.player[skin].right.src = `./assets/player/${skin}/right.png`;
		});
	});
}

const routes = [
	{ path: '/', view: $('.accueil') },
	{ path: '/jeu', view: $('.jeu') },
	{ path: '/rejoindre', view: $('.jeu') },
	{ path: '/login', view: $('.login') },
	{ path: '/signin', view: $('.signin') },
	{ path: '/mdp_oublie', view: $('.mdp_oublie') },
	{ path: '/regles', view: $('.regles') },
	{ path: '/credits', view: $('.credits') },
	{ path: '/personnalisation', view: $('.personnalisation') },
	{ path: '/rejouer', view: $('.rejouer') },
	{ path: '/resetPassword', view: $('.resetPassword') },
	{ path: '/scores', view: $('.scores') },
	{ path: '/join', view: $('.join') },
];

let carouselLife;
let carouselDamage;
let carouselFireRate;
let carouselSpeed;
let carouselSkin;
let carouselProjSkin;

Router.routes = routes;
Router.connexionRoutes = ['/login', '/signin', '/mdp_oublie', '/resetPassword'];
Router.notFound = $('.notFound');

Router.setInnerLinks(document.body);

function redirect() {
	console.log(resourcesToLoad);
	if (resourcesToLoad === 0) {
		if (user) {
			Router.navigate(window.location.pathname);
			setAllCarouselData();
			setScores();
			setGames();
		} else Router.navigate('/login');
	} else setTimeout(redirect, 1000);
}

redirect();

window.onpopstate = () => {
	Router.navigate(document.location.pathname, true);
};

socket.on('user start a game', game => {
	document.addEventListener('keydown', ({ key }) => {
		if (!playerCommands.includes(key)) return;
		socket.emit('playerKeyDown', key);
	});
	document.addEventListener('keyup', ({ key }) => {
		if (!playerCommands.includes(key)) return;
		socket.emit('playerKeyUp', key);
	});
	document.addEventListener('mousedown', ({ clientX, clientY }) => {
		socket.emit('playerMouseDown', { clientX, clientY });
	});
	document.addEventListener('mouseup', () => {
		socket.emit('playerMouseUp');
	});
	document.addEventListener('mousemove', ({ clientX, clientY }) => {
		socket.emit('playerMouseMove', { clientX, clientY });
	});
	setGame(game);
	startGameRenderer();
});

socket.on('gameUpdate', game => {
	setGame(game);
});

socket.on('gameJoin', game => {
	setGame(game);
	startGameRenderer();
});

socket.on('gameStop', data => {
	stopGameRenderer();
	Router.navigate('/rejouer');
	socket.emit('gameStop');
	if(data.win) {
		socket.emit('score', data);
		setScores();
		$(".rejouer h2").html(`Victoire, score : ${data.time}`);
	}else{
		$(".rejouer h2").html(`Défaite`);
	}
});

socket.on('stageTransition', previousStage => {
	stopGameRenderer();
	startTransition(previousStage);
});

socket.on('userLogin', login => {
	window.sessionStorage.setItem('user', login);
	user = login;
	setAllCarouselData();
	setScores();
	setGames();
	Router.navigate('/');
});

socket.on('changePath', path => {
	Router.navigate(path);
});

socket.on('serverAlert', message => {
	alert(message);
});

function setAllCarouselData() {
	socket.emit('setCarousel', user);
	socket.on('setCarousel', ({ playerData, playerSkins, weaponSkins }) => {
		carouselLife = new CarouselStat(
			$('.personnalisation .health'),
			playerData.health,
			'health'
		);
		carouselDamage = new CarouselStat(
			$('.personnalisation .damage'),
			playerData.damage,
			'damage'
		);
		carouselSpeed = new CarouselStat(
			$('.personnalisation .speed'),
			playerData.speed,
			'speed'
		);
		carouselFireRate = new CarouselStat(
			$('.personnalisation .fireSpeed'),
			playerData.fireSpeed,
			'fireSpeed'
		);
		carouselSkin = new CarouselSkin(
			$('.personnalisation .skin'),
			playerSkins,
			playerData.skinsPool,
			playerData.currentSkin,
			false
		);
		carouselProjSkin = new CarouselSkin(
			$('.personnalisation .proj-skin'),
			weaponSkins,
			playerData.weaponsPool,
			playerData.currentWeapon,
			true
		);
	});
}

function setScores() {
	socket.emit('setScore');
	socket.on('setScore', data => {
		score.setTable(data.scores);
	});
}

function setGames() {
	socket.emit('setGames');
	socket.on('setGames', data => {
		game.setGames(data.games);
	});
}

window.addEventListener('unload', event => {
	if (user) socket.emit('close', user);
});

window.addEventListener('load', event => {
	if (user) socket.emit('open', user);
	//if(user) setTimeout(() => socket.emit('open', user), 1000);
});

export function setUserNull() {
	user = null;
	window.sessionStorage.removeItem('user');
}
