import Router from './router.js';
import PlayMenu from './menu/playMenu.js';
import $ from 'jquery';
import { io } from 'socket.io-client';
import LoginMenu from './menu/loginMenu.js';
import startGameRenderer, {
	setGame,
	stopGameRenderer,
} from './game/renderGame.js';
import CarouselStat from './carousel/carouselStat.js';
import CarouselSkin from './carousel/carouselSkin.js';
import ScoreMenu from './menu/scoreMenu.js';

export const socket = io();

export const user = window.sessionStorage.getItem('user');

const playerCommands = [
	'ArrowUp',
	'ArrowDown',
	'ArrowLeft',
	'ArrowRight',
	'z',
	's',
	'q',
	'd',
];

PlayMenu.setMenu($('.menuJouer'));

LoginMenu.setLogin($('.login'), socket);
LoginMenu.setSignin($('.signin'), socket);
LoginMenu.setMdp_oublie($('.mdp_oublie'), socket);

LoginMenu.resetPassword($('.resetPassword'), socket);
LoginMenu.setLogout($('.logout'), socket);

ScoreMenu.setTable($('.scores'), [
	{ name: 'Nathan', value: 1 },
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

socket.on('gameStop', () => {
	stopGameRenderer();
	Router.navigate('/rejouer');
	socket.emit('gameStop');
});

socket.on('connexion', ({ user, playerData, playerSkins, weaponSkins }) => {
	window.sessionStorage.setItem('user', user);
	console.log(user, playerData, playerSkins, weaponSkins);
	carouselLife = new CarouselStat(
		$('.personnalisation .life'),
		playerData.health
	);
	carouselDamage = new CarouselStat(
		$('.personnalisation .damage'),
		playerData.damage
	);
	carouselSpeed = new CarouselStat(
		$('.personnalisation .speed'),
		playerData.speed
	);
	carouselFireRate = new CarouselStat(
		$('.personnalisation .fire-rate'),
		playerData.fireSpeed
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

socket.on('path', path => {
	Router.navigate(path, true);
});

Router.routes = routes;
Router.notFound = $('.notFound');

Router.setInnerLinks(document.body);

Router.navigate(window.location.pathname, true);
if (user) Router.navigate('/', true);
else Router.navigate('/login', true);

socket.on('alert', message => {
	alert(message);
});

window.onpopstate = () => Router.navigate(document.location.pathname, true);
