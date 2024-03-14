import Router from './router.js';
import PlayMenu from './playMenu.js';
import $ from 'jquery';
import { io } from 'socket.io-client';
import LoginMenu from './LoginMenu.js';
import renderGame from './renderGame.js';

export const socket = io();

PlayMenu.setMenu($('.menuJouer'));

LoginMenu.setMenu($('.login'), socket);

const routes = [
	{ path: '/', view: $('.accueil') },
	{ path: '/jeu', view: $('.jeu') },
	{ path: '/join', view: $('.join') },
	{ path: '/login', view: $('.login') },
	{ path: '/signin', view: $('.signin') },
	{ path: '/mdp_oublie', view: $('.mdp_oublie') },
	{ path: '/regles', view: $('.regles') },
	{ path: '/credits', view: $('.credits') },
	{ path: '/personnalisation', view: $('.personnalisation') },
	{ path: '/rejouer', view: $('.rejouer') },
];

socket.on('gameStart', data => {
	requestAnimationFrame(() => {
		renderGame(data.game);
	});
});

Router.routes = routes;
Router.notFound = $('.notFound');

Router.setInnerLinks($('main'));

Router.navigate(window.location.pathname, true);

window.onpopstate = () => Router.navigate(document.location.pathname, true);
