import $ from 'jquery';

export default class CarouselSkin {

    constructor(element, skins, ownedSkins, actualSkin, isProj){
        this.element = element;
        this.skins = skins;
        this.ownedSkins = ownedSkins;
        this.actualSkin = actualSkin;
        this.actualIndex = 0;
        this.nbElement = 0;
        this.isProj = isProj

        this.setCarousel();

        $('.carousel-control-prev', this.carousel).on('click', event => {
            event.preventDefault();
            this.actualIndex = this.modulo(this.actualIndex-1, this.nbElement)
            console.log(this.actualIndex);
            $('.carousel-inner > .active', this.element).removeClass('active');
            $(`.carousel-inner > div:nth-child(${this.actualIndex+1})`, this.element).addClass('active');
        });

        $('.carousel-control-next', this.carousel).on('click', event => {
            event.preventDefault();
            this.actualIndex = this.modulo(this.actualIndex+1, this.nbElement)
            console.log(this.actualIndex);
            $('.carousel-inner > .active', this.element).removeClass('active');
            $(`.carousel-inner > div:nth-child(${this.actualIndex+1})`, this.element).addClass('active');
        });
    }

    setCarousel(){
        let html = ``;
        let n = 0;
        this.skins.forEach(skin => {
            if(this.actualSkin === skin) html += `<div class="carousel-item active">`;
            else html += `<div class="carousel-item">`;

            if(this.isProj) html += `<img src="assets/missile/${skin}.png" style="margin: 5% 0;">`;
            else html += `<img src="assets/player/${skin}idle.png">`;

            if(this.ownedSkins.includes(skin)) html += html += `<p>Cliquez pour équiper</p>`;
            else if(this.actualSkin === skin) html += `<p>Equipé</p>`;
            else html += `<p>Cliquez pour débloquer à 100 pièces</p>`;

            html += `</div>`
            n++;
        });

        this.nbElement = n;
        $(".carousel-inner", this.element).html(html);
    }

    modulo(n, m){
        if(n >= 0){
            return n%m
        }else{
            return this.nbElement-1;
        }
    }
}