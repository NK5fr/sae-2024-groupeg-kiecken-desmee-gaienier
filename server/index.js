import http from 'http';
import express from 'express';
import addWebpackMiddleware from './middlewares/addWebpackMiddleware.js';
import { Server as IOServer } from 'socket.io';
import expressStatusMonitor from 'express-status-monitor';

const fileOptions = { root: process.cwd() };
const app = express();
const httpServer = http.createServer(app);
const io = new IOServer(httpServer, {
	allowEIO3: true,
});

io.on('connection', socket => {
	console.log(`Nouvelle connexion du client ${socket.id}`);

	socket.on('disconnect', () => {
		console.log(`Déconnexion du client ${socket.id}`);
	});
});

addWebpackMiddleware(app);

app.use(express.static('client/public'));

let port = process.env.PORT;
if (!port) port = 8000;
httpServer.listen(port, () => {
	console.log(`Server running at http://localhost:${port}/`);
});
