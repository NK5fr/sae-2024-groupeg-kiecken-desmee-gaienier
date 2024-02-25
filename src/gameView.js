import View from './view.js';
import startGame from './game.js';

export class GameView extends View {

    show() {
        this.element.classList.add('active');
        startGame();
    }

    hide() {
        this.element.classList.remove('active');
    }
}