import Router from './router.js';
import PlayMenu from './playMenu.js';
import $ from 'jquery';
import { io } from 'socket.io-client';
import LoginMenu from './LoginMenu.js';

const socket = io();

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

Router.routes = routes;
Router.notFound = $('.notFound');

Router.navigate(window.location.pathname, true);
//Router.navigate('/signin', true);

window.onpopstate = () => Router.navigate(document.location.pathname, true);
