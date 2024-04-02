//import require from 'require';

export default function encryptionTool(password) {
	const crypto = require('crypto');

	var text = '';

	// On définit notre algorithme de cryptage
	var algorithm = 'aes256';
	var password = 'l5JmP+G0/1zB%;r8B8?2?2pcqGcL^3';
	// On crypte notre texte
	var cipher = crypto.createCipher(algorithm, password);
	var crypted = cipher.update(text, 'utf8', 'hex');
	crypted += cipher.final('hex');
	// On décrypte notre texte
	var decipher = crypto.createDecipher(algorithm, password);
	var dec = decipher.update(crypted, 'hex', 'utf8');
	dec += decipher.final('utf8');
}
