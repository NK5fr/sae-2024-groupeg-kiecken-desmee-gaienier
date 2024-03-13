import $ from 'jquery';

export default class PlayMenu{

    static showed = false;
    static element;

    static setMenu(element){
        this.element = element;
        $(".jouer", element).on('click', event => this.handleMenu(event));
    }

    static handleMenu(event){
        event.preventDefault();
        if(this.showed) $(".menu", this.element).hide();
        else $(".menu", this.element).show();
        this.showed = !this.showed;
    }
}