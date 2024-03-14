import Router from './router.js';
import PlayMenu from './playMenu.js';
import $ from 'jquery';
import { io } from 'socket.io-client';
import LoginMenu from './LoginMenu.js';

const socket = io();

PlayMenu.setMenu($('.menuJouer'));

LoginMenu.setMenu($('.login'), socket);

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
];

Router.routes = routes;
Router.notFound = $('.notFound');

Router.setInnerLinks($('main'));

console.log(window.location.pathname);

Router.navigate(window.location.pathname, true);

window.onpopstate = () => Router.navigate(document.location.pathname, true);