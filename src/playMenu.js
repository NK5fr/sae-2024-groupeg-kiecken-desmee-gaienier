import $ from 'jquery';

export default class PlayMenu{

    constructor(element){
        this.element = element;
        this.showed = false;
        $(".jouer", element).on('click', event => this.handleMenu(event));
    }

    handleMenu(event){
        event.preventDefault();
        if(this.showed) $(".menu", this.element).hide();
        else $(".menu", this.element).show();
        this.showed = !this.showed;
    }
}