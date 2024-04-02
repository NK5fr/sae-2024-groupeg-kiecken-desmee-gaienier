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
	'g',
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

ScoreMenu.setTable($('.scores'), [
	{ name: 'Nathan', value: 12 },
	{ name: 'Nathan', value: 2 },
	{ name: 'Nathan', value: 3 },
	{ name: 'Nathan', value: 4 },
	{ name: 'Nathan', value: 5 },
	{ name: 'Nathan', value: 6 },
	{ name: 'Nathan', value: 7 },
	{ name: 'Nathan', value: 8 },
	{ name: 'Nathan', value: 9 },
	{ name: 'Nathan', value: 10 },
	{ name: 'Nathan', value: 11 },
]);

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

if (user) {
	Router.navigate(window.location.pathname);
	setAllCarouselData();
	setTimeout(() => socket.emit('open', user), 1000);
} else Router.navigate('/login');

window.onpopstate = () => {
	Router.navigate(document.location.pathname, true);
};

socket.on('gameStart', game => {
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
});

socket.on('stageTransition', previousStage => {
	stopGameRenderer();
	startTransition(previousStage);
});

socket.on('userLogin', login => {
	window.sessionStorage.setItem('user', login);
	user = login;
	setAllCarouselData();
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

window.addEventListener('unload', event => {
	if (user) socket.emit('close', user);
});

export function setUserNull() {
	user = null;
	window.sessionStorage.removeItem('user');
}
