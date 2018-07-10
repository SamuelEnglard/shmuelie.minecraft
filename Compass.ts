import * as L from 'leaflet'

interface CompassPrototype extends L.Control
{
    compass_img: HTMLImageElement
    imagedict: { [x: number]: string }
    render(direction: number): void
}

interface Compass
{
    new(imagedict: { [x: number]: string }, options?: L.ControlOptions): CompassPrototype
}

const compass: Compass = L.Control.extend({
    initialize: function (imagedict: { [x: number]: string }, options: L.ControlOptions): void
    {
        L.Util.setOptions(this, options);
        this.compass_img = <HTMLImageElement>L.DomUtil.create('img', 'compass');
        this.imagedict = imagedict;
    },
    render: function (direction: number): void
    {
        this.compass_img.src = this.imagedict[direction];
    },
    onAdd: function (): HTMLElement
    {
        return this.compass_img;
    }
});

export default compass;