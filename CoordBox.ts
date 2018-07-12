import * as L from "leaflet";
import { fromLatLngToWorld } from "./Utils";
import app from "./App";

interface CoordBoxPrototype extends L.Control
{
    coord_box: HTMLDivElement;
    render(latlng: { lat: number, lng: number }): void;
}

interface CoordBox
{
    new(): CoordBoxPrototype;
}

const coordBox: CoordBox = L.Control.extend({
    options: {
        position: "bottomleft",
    },
    initialize: function (this: CoordBoxPrototype): void
    {
        this.coord_box = <HTMLDivElement>L.DomUtil.create("div", "coordbox");
    },
    render: function (this: CoordBoxPrototype, latlng: { lat: number, lng: number }): void
    {
        const currWorld = app.current_world;

        const currTileset = app.current_layer[currWorld];

        const ovconf = currTileset.tileSetConfig;

        const w_coords = fromLatLngToWorld(latlng.lat, latlng.lng, ovconf);

        const r_x = Math.floor(Math.floor(w_coords.x / 16) / 32);
        const r_z = Math.floor(Math.floor(w_coords.z / 16) / 32);
        const r_name = "r." + r_x + "." + r_z + ".mca";

        this.coord_box.innerHTML = "<strong>X</strong> " +
            Math.round(w_coords.x) +
            " <strong>Z</strong> " + Math.round(w_coords.z) +
            " (" + r_name + ")";
    },
    onAdd: function (this: CoordBoxPrototype): HTMLElement
    {
        return this.coord_box;
    }
});

export default coordBox;