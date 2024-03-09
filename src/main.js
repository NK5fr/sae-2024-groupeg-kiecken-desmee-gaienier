import Router from './router.js';
import PlayMenu from './playMenu.js';
import $ from 'jquery';


PlayMenu.setMenu($('.menuJouer'));

const routes = [
	{ path: '/', view: $('.accueil')},
	{ path: '/jeu', view: $('.jeu')},
    { path: '/login', view: $('.login')},
    { path: '/signin', view: $('.signin')},
    { path: '/mdp_oublie', view: $('.mdp_oublie')},
    { path: '/regles', view: $('.regles')},
    { path: '/credits', view: $('.credits')},
    { path: '/personnalisation', view: $('.personnalisation')},
    { path: '/rejouer', view: $('.rejouer')},
];

Router.routes = routes;

Router.setInnerLinks($('main'));

Router.navigate(window.location.pathname, true);

window.onpopstate = () => Router.navigate(document.location.pathname, true);


