import * as L from "leaflet";
import app from "./App";
import "leaflet-easybutton";

interface CardinalDirections
{
    NW: string;
    NE: string;
    SW: string;
    SE: string;
}

interface ChangeEvent
{
    selectedWorld: string;
}

interface WorldsPrototype extends L.Control
{
    clockwiseRotation: L.Control.EasyButton;
    counterClockwiseRotation: L.Control.EasyButton;
    rotationBar: L.Control.EasyBar;
    onChange(ev: ChangeEvent): void;
}

interface Worlds
{
    new(options?: L.ControlOptions): WorldsPrototype;
}

const worlds: Worlds = L.Control.extend({
    initialize: function (this: WorldsPrototype, options: L.ControlOptions): void
    {
        L.Util.setOptions(this, options);
        this.clockwiseRotation = L.easyButton("<span class='rotation-button'>&curvearrowright;</span>", () =>
        {
            const directions: CardinalDirections = {
                "NW": "SW",
                "SW": "SE",
                "SE": "NE",
                "NE": "NW"
            };
            this.onChange({ selectedWorld: directions[<keyof CardinalDirections>app.current_world] });
        });
        this.counterClockwiseRotation = L.easyButton("<span class='rotation-button'>&curvearrowleft;</span>", () =>
        {
            const directions: CardinalDirections = {
                "NW": "NE",
                "NE": "SE",
                "SE": "SW",
                "SW": "NW"
            };
            this.onChange({ selectedWorld: directions[<keyof CardinalDirections>app.current_world] });
        });
        this.rotationBar = L.easyBar([this.counterClockwiseRotation, this.clockwiseRotation]).setPosition("topright");
    },
    onChange: function (this: WorldsPrototype, ev: ChangeEvent): void
    {
        const selected_world = ev.selectedWorld;


        // save current view for the current_world
        app.centers[app.current_world] = { latLng: app.map.getCenter(), zoom: app.map.getZoom() };

        if (app.layerCtrl !== null)
        {
            app.layerCtrl.remove();
        }

        app.layerCtrl = L.control.layers(
            app.mapTypes[selected_world],
            app.overlays[selected_world],
            { collapsed: false })
            .addTo(app.map);

        for (const world_name in app.mapTypes)
        {
            for (const tset_name in app.mapTypes[world_name])
            {
                const lyr = app.mapTypes[world_name][tset_name];
                if (world_name !== selected_world)
                {
                    if (app.map.hasLayer(lyr))
                    {
                        app.map.removeLayer(lyr);
                    }
                }
                if (lyr.tileSetConfig.marker_groups)
                {
                    for (const marker_group in lyr.tileSetConfig.marker_groups)
                    {
                        lyr.tileSetConfig.marker_groups[marker_group].remove();
                    }
                }
                if (lyr.tileSetConfig.markerCtrl)
                {
                    lyr.tileSetConfig.markerCtrl.remove();
                }
            }

            for (const tset_name in app.overlays[world_name])
            {
                const lyr = app.overlays[world_name][tset_name];
                if (world_name !== selected_world)
                {
                    if (app.map.hasLayer(lyr))
                    {
                        app.map.removeLayer(lyr);
                    }
                }
            }
        }

        const center = app.centers[selected_world];
        if (center !== undefined)
        {
            app.map.setView(center.latLng, center.zoom);
        }

        app.current_world = selected_world;

        const currTileset = app.current_layer[selected_world];
        if (app.mapTypes[selected_world] && currTileset !== undefined)
        {
            app.map.addLayer(app.mapTypes[selected_world][currTileset.tileSetConfig.name]);
        }
        else
        {
            const tset_name = Object.keys(app.mapTypes[selected_world])[0];
            app.map.addLayer(app.mapTypes[selected_world][tset_name]);
        }
    },
    onAdd: function (this: WorldsPrototype, map: L.Map): HTMLElement | null
    {
        if (this.rotationBar.onAdd)
        {
            return this.rotationBar.onAdd(map);
        }
        return null;
    }
});

export default worlds;