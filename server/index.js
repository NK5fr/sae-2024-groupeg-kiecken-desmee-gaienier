import http from 'http';
import express from 'express';
import addWebpackMiddleware from './middlewares/addWebpackMiddleware.js';
import { Server as IOServer } from 'socket.io';
import connexion from './connexion.js';
import signin from './signin.js';
import mdp_oublie from './mdp_oublie.js';

const fileOptions = { root: process.cwd() };
const app = express();
const httpServer = http.createServer(app);
const io = new IOServer(httpServer, {
	allowEIO3: true,
});

io.on('connection', socket => {
	socket.on('login', data => {
		connexion(data);
	});
	socket.on('signin', data => {
		signin(data);
	});
	socket.on('mdp_oublie', data => {
		mdp_oublie(data);
	});
	socket.on('resetPassword', data => {
		console.log('resetPassword', data);
	});
});

addWebpackMiddleware(app);

app.use(express.static('client/public'));

app.get('/:path', (req, res) => {
	res.sendFile('client/public/index.html', fileOptions);
});

app.use((req, res) => {
	res.status(404);
	res.send(
		'<img src="https://cdn.vox-cdn.com/uploads/chorus_asset/file/22312759/rickroll_4k.jpg" style="width: 100%; height: 100%" \\>'
	);
});

let port = process.env.PORT;
if (!port) port = 8000;
httpServer.listen(port, () => {
	console.log(`Server running at http://localhost:${port}/`);
});
