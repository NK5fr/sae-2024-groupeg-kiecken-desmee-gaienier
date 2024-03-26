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
LoginMenu.setLogout(
	$('.logout'),
	socket,
	window.sessionStorage.getItem('user')
);

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

socket.on('gameStart', game => {
	document.addEventListener('keydown', e => {
		if (!playerCommands.includes(e.key)) return;
		socket.emit('playerKeyDown', {
			socketId: socket.id,
			key: e.key,
		});
	});
	document.addEventListener('keyup', e => {
		if (!playerCommands.includes(e.key)) return;
		socket.emit('playerKeyUp', {
			socketId: socket.id,
			key: e.key,
		});
	});
	document.addEventListener('mousedown', event => {
		socket.emit('playerMouseDown', {
			socketId: socket.id,
			x: event.clientX,
			y: event.clientY,
		});
	});
	document.addEventListener('mouseup', () => {
		socket.emit('playerMouseUp', {
			socketId: socket.id,
		});
	});
	document.addEventListener('mousemove', event => {
		socket.emit('playerMouseMove', {
			socketId: socket.id,
			x: event.clientX,
			y: event.clientY,
		});
	});

	setGame(game);
	startGameRenderer();
});

socket.on('gameUpdate', game => {
	if (socket.id !== game.socketId) return;
	setGame(game);
});

socket.on('gameEnd', () => {
	stopGameRenderer();
	Router.navigate('/rejouer');
	socket.emit('gameEnd', { socketId: socket.id });
});

socket.on('path', path => {
	Router.navigate(path, true);
});

Router.routes = routes;
Router.notFound = $('.notFound');

Router.setInnerLinks(document.body);

Router.navigate(window.location.pathname, true);
//Router.navigate('/login', true);

socket.on('alert', message => {
	alert(message);
});

window.onpopstate = () => Router.navigate(document.location.pathname, true);

const carouselLife = new CarouselStat($('.personnalisation .life'), 1);
const carouselDamage = new CarouselStat($('.personnalisation .damage'), 1);
const carouselFireRate = new CarouselStat($('.personnalisation .fire-rate'), 1);
const carouselSpeed = new CarouselStat($('.personnalisation .speed'), 1);
const carouselSkin = new CarouselSkin(
	$('.personnalisation .skin'),
	['base', 'reverse'],
	['base'],
	'base',
	false
);
const carouselProjSkin = new CarouselSkin(
	$('.personnalisation .proj-skin'),
	['card', 'energy-ball'],
	['card'],
	'card',
	true
);
