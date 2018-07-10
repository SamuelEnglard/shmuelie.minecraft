import * as L from 'leaflet'
import { fromLatLngToWorld } from './Utils';
import app from './App';

interface CoordBoxPrototype extends L.Control
{
    coord_box: HTMLDivElement
    render(latlng: { lat: number, lng: number }): void
}

interface CoordBox
{
    new(): CoordBoxPrototype
}

const coordBox: CoordBox = L.Control.extend({
    options: {
        position: 'bottomleft',
    },
    initialize: function (): void
    {
        this.coord_box = <HTMLDivElement>L.DomUtil.create('div', 'coordbox');
    },
    render: function (latlng: { lat: number, lng: number }): void
    {
        const currWorld = app.current_world;
        if (currWorld == null) { return; }

        const currTileset = app.current_layer[currWorld];
        if (currTileset == null) { return; }

        const ovconf = currTileset.tileSetConfig;

        const w_coords = fromLatLngToWorld(latlng.lat, latlng.lng, ovconf);

        var r_x = Math.floor(Math.floor(w_coords.x / 16.0) / 32.0);
        var r_z = Math.floor(Math.floor(w_coords.z / 16.0) / 32.0);
        var r_name = "r." + r_x + "." + r_z + ".mca";

        this.coord_box.innerHTML = "<strong>X</strong> " +
            Math.round(w_coords.x) +
            " <strong>Z</strong> " + Math.round(w_coords.z) +
            " (" + r_name + ")";
    },
    onAdd: function (): HTMLElement
    {
        return this.coord_box;
    }
});

export default coordBox;