import $ from 'jquery';

export default class CarouselStat {

    constructor(element, actualLevel){
        this.element = element;
        this.actualLevel = actualLevel

        $('.carousel-control-next', this.element).on('click', event => {
            event.preventDefault();
            this.actualLevel++;
            if(this.actualLevel > 10) this.actualLevel = 10;
            this.setCarousel();
        });
        this.setCarousel();
    }

    setCarousel(){
        let html = `<div class="carousel-item active"><h1>${this.actualLevel}</h1><p>Passer au niveau suivant vous demandera 100 pièces</p></div>`;
        $(".carousel-inner", this.element).html(html);
    }
}