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

//LoginMenu.resetPassword($('.resetPassword'), socket);

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

Router.routes = routes;
Router.notFound = $('.notFound');

Router.setInnerLinks(document.body);

Router.navigate(window.location.pathname, true);
//Router.navigate('/signin', true);

window.onpopstate = () => Router.navigate(document.location.pathname, true);

const carouselLife = new CarouselStat($(".personnalisation .life"));
