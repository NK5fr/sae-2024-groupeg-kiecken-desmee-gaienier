import Router from './router.js';
import PlayMenu from './menu/playMenu.js';
import $ from 'jquery';
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

export let userName = window.sessionStorage.getItem('userName');

export const images = {};

const playerCommands = [
	'arrowup',
	'arrowdown',
	'arrowleft',
	'arrowright',
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

const score = new ScoreMenu($('.scores'));
const game = new JoinMenu($('.join'));

let resourcesToLoad = 0;

function loadResources() {
	socket.emit('getResourcesToLoad');
	socket.on(
		'resourcesToLoad',
		({ angels, bonus, missiles, players, stages }) => {
			resourcesToLoad =
				angels.length +
				bonus.length +
				missiles.length +
				players.length +
				stages.length +
				1;
			angels.forEach(({ species, type }) => {
				if (!images.angels) images.angels = {};
				if (!images.angels[species]) images.angels[species] = {};
				if (!images.angels[species][type])
					images.angels[species][type] = new Image();
				images.angels[species][type].src =
					`./assets/angel/${species}/${type}.png`;
				images.angels[species][type].onload = () => {
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
			missiles.forEach(({ skin }) => {
				if (!images.missiles) images.missiles = {};
				if (!images.missiles[skin]) images.missiles[skin] = new Image();
				images.missiles[skin].src = `./assets/missile/${skin}.png`;
				images.missiles[skin].onload = () => {
					resourcesToLoad--;
				};
			});
			players.forEach(({ skin }) => {
				if (!images.players) images.players = {};
				if (!images.players[skin]) images.players[skin] = {};
				images.players[skin].left = new Image();
				images.players[skin].left.src = `./assets/player/${skin}/left.png`;
				images.players[skin].idle = new Image();
				images.players[skin].idle.src = `./assets/player/${skin}/idle.png`;
				images.players[skin].idle.onload = () => {
					resourcesToLoad--;
				};
				images.players[skin].right = new Image();
				images.players[skin].right.src = `./assets/player/${skin}/right.png`;
			});
			stages.forEach(({ stage }) => {
				if (!images.stages) images.stages = {};
				if (!images.stages[stage]) images.stages[stage] = new Image();
				images.stages[stage].src = `./assets/stage/background/${stage}.png`;
				images.stages[stage].onload = () => {
					resourcesToLoad--;
				};
			});
			if (!images.stages['transition'])
				images.stages['transition'] = new Image();
			images.stages['transition'].src =
				`./assets/stage/background/transition.png`;
		}
	);
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

Router.routes = routes;
Router.connexionRoutes = ['/login', '/signin', '/mdp_oublie', '/resetPassword'];
Router.notFound = $('.notFound');

Router.setInnerLinks(document.body);

window.onpopstate = () => {
	Router.navigate(document.location.pathname, true);
};

function redirect() {
	if (resourcesToLoad === 0) {
		if (userName) {
			Router.navigate(window.location.pathname);
			setAllCarouselData();
			setScores();
			setGames();
			setSouls();
		} else Router.navigate('/login');
	} else setTimeout(redirect, 1000);
}

socket.on('game is started', game => {
	addListeners();
	setGame(game);
	startGameRenderer();
});

socket.on('game is updated', game => {
	setGame(game);
});

socket.on(
	'game is stoped',
	({ userName, souls, time = '00:00:00', win = false }) => {
		stopGameRenderer();
		setGame(undefined);
		Router.navigate('/rejouer');
		$('.personnalisation header h4').html(
			`<img href="images/soul.png" alt="âmes"> : ${souls}`
		);
		socket.emit('game is stoped', { userName, souls });
		if (win) {
			const date = new Date(time);
			const formatedTime =
				`${date.getUTCHours() >= 10 ? date.getUTCHours() : '0' + date.getUTCHours()}` +
				`:${date.getUTCMinutes() >= 10 ? date.getUTCMinutes() : '0' + date.getUTCMinutes()}` +
				`:${date.getUTCSeconds() >= 10 ? date.getUTCSeconds() : '0' + time.getUTCSeconds()}`;
			socket.emit('client send score', { userName, formatedTime });
			setScores();
			$('.rejouer h2').html(`Victoire, score : ${formatedTime}`);
		} else {
			$('.rejouer h2').html(`Défaite`);
		}
	}
);

socket.on('transition to next stage', prevStage => {
	stopGameRenderer();
	startTransition(prevStage);
});

socket.on('userLogin', login => {
	window.sessionStorage.setItem('userName', login);
	userName = login;
	setAllCarouselData();
	setScores();
	setGames();
	setSouls();
	Router.navigate('/');
});

socket.on('changePath', path => {
	Router.navigate(path);
});

socket.on('server send alert', message => {
	alert(message);
});

function setAllCarouselData() {
	socket.emit('client need playerProperties', userName);
	socket.on(
		'server send playerProperties',
		({ playerProperties, playerSkins, weaponSkins }) => {
			new CarouselStat(
				$('.personnalisation .health'),
				playerProperties.health,
				'health'
			);
			new CarouselStat(
				$('.personnalisation .damage'),
				playerProperties.damage,
				'damage'
			);
			new CarouselStat(
				$('.personnalisation .speed'),
				playerProperties.speed,
				'speed'
			);
			new CarouselStat(
				$('.personnalisation .fireSpeed'),
				playerProperties.fireSpeed,
				'fireSpeed'
			);
			new CarouselSkin(
				$('.personnalisation .skin'),
				playerSkins,
				playerProperties.skinsPool,
				playerProperties.currentSkin,
				false
			);
			new CarouselSkin(
				$('.personnalisation .proj-skin'),
				weaponSkins,
				playerProperties.weaponsPool,
				playerProperties.currentWeapon,
				true
			);
		}
	);
}

function setScores() {
	socket.emit('client need scores');
	socket.on('server send scores', scores => {
		score.setTable(scores);
	});
}

export function setSouls() {
	socket.emit('client need souls', userName);
	socket.on('server send souls', souls => {
		$('.personnalisation header h4').html(
			`<img href="images/soul.png" alt="âmes"> : ${souls}`
		);
	});
}

function setGames() {
	socket.emit('client need gamesInfo');
	socket.on('server send gamesInfo', gamesInfo => {
		game.setGames(gamesInfo);
	});
}

function addListeners() {
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
}

window.addEventListener('unload', event => {
	if (userName) socket.emit('close', userName);
});

window.addEventListener('load', event => {
	if (userName) socket.emit('open', userName);
});

export function setUserNull() {
	userName = null;
	window.sessionStorage.removeItem('userName');
	window.sessionStorage.removeItem('diff');
}

loadResources();
redirect();
