import { GameView } from './gameView.js';
import Router from './router.js';
import View from './view.js';


const acceuil = new View(document.querySelector('.accueil'));
const jeu = new GameView(document.querySelector('.jeu'));
const login = new View(document.querySelector('.login'));
const signin = new View(document.querySelector('.signin'));
const mdp_oublie = new View(document.querySelector('.mdp_oublie'));
const regles = new View(document.querySelector('.regles'));
const credits = new View(document.querySelector('.credits'));
const personnalisation = new View(document.querySelector('.personnalisation'));


const routes = [
	{ path: '/', view: acceuil},
	{ path: '/jeu', view: jeu},
    { path: '/login', view: login},
    { path: '/signin', view: signin},
    { path: '/mdp_oublie', view: mdp_oublie},
    { path: '/regles', view: regles},
    { path: '/credits', view: credits},
    { path: '/personnalisation', view: personnalisation},
];

Router.routes = routes;

Router.setInnerLinks(document.querySelector('main'));

Router.navigate(window.location.pathname, true);

window.onpopstate = () => Router.navigate(document.location.pathname, true);


