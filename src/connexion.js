// regarde si un click est fait sur le lien interne mdp_oublie
document
	.querySelector('.mdp_oublieLien')
	.addEventListener('click', function (e) {
		// mettre les div de connextion en display none
		document.querySelectorAll('.connexion > div').forEach(function (div) {
			div.style.display = 'none';
		});
		document.querySelector('.mdp_oublie').style.display = 'flex';
	});

// regarde si un click est fait sur le lien interne connexion
document.querySelector('.loginLien').addEventListener('click', function (e) {
	// mettre les div de connextion en display none
	document.querySelectorAll('.connexion > div').forEach(function (div) {
		div.style.display = 'none';
	});

	document.querySelector('.login').style.display = 'flex';
});

// regarde si un click est fait sur le lien interne sigin
document.querySelector('.siginLien').addEventListener('click', function (e) {
	// mettre les div de connextion en display none
	document.querySelectorAll('.connexion > div').forEach(function (div) {
		div.style.display = 'none';
	});
	document.querySelector('.sigin').style.display = 'flex';
});
