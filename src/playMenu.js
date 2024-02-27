export default class PlayMenu{

    constructor(element){
        this.element = element;
        this.showed = false;
        element.querySelector(".jouer").addEventListener('click', event => this.handleMenu(event));
    }

    handleMenu(event){
        event.preventDefault();
        if(this.showed) this.element.querySelector(".menu").style.display = "none";
        else this.element.querySelector(".menu").style.display = "block";
        this.showed = !this.showed;
    }
}