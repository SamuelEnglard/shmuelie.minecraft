import * as L from 'leaflet'
import overviewer from './App'
import 'leaflet-easybutton'

interface CardinalDirections
{
    NW: string
    NE: string
    SW: string
    SE: string
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
        this.clockwiseRotation = L.easyButton('<span class="rotation-button">&curvearrowright;</span>', () =>
        {
            const directions: CardinalDirections = {
                "NW": "SW",
                "SW": "SE",
                "SE": "NE",
                "NE": "NW"
            };
            this.onChange({ selectedWorld: directions[<keyof CardinalDirections>overviewer.current_world] });
        });
        this.counterClockwiseRotation = L.easyButton('<span class="rotation-button">&curvearrowleft;</span>', () =>
        {
            const directions: CardinalDirections = {
                "NW": "NE",
                "NE": "SE",
                "SE": "SW",
                "SW": "NW"
            };
            this.onChange({ selectedWorld: directions[<keyof CardinalDirections>overviewer.current_world] });
        });
        this.rotationBar = L.easyBar([this.counterClockwiseRotation, this.clockwiseRotation]).setPosition("topright");
    },
    onChange: function (this: WorldsPrototype, ev: ChangeEvent): void
    {
        var selected_world = ev.selectedWorld;


        // save current view for the current_world
        overviewer.centers[overviewer.current_world] = { latLng: overviewer.map.getCenter(), zoom: overviewer.map.getZoom() };

        if (overviewer.layerCtrl !== null)
        {
            overviewer.layerCtrl.remove();
        }

        overviewer.layerCtrl = L.control.layers(
            overviewer.mapTypes[selected_world],
            overviewer.overlays[selected_world],
            { collapsed: false })
            .addTo(overviewer.map);

        for (var world_name in overviewer.mapTypes)
        {
            for (var tset_name in overviewer.mapTypes[world_name])
            {
                var lyr = overviewer.mapTypes[world_name][tset_name];
                if (world_name != selected_world)
                {
                    if (overviewer.map.hasLayer(lyr))
                        overviewer.map.removeLayer(lyr);
                }
                if (lyr.tileSetConfig.marker_groups)
                {
                    for (var marker_group in lyr.tileSetConfig.marker_groups)
                    {
                        lyr.tileSetConfig.marker_groups[marker_group].remove();
                    }
                }
                if (lyr.tileSetConfig.markerCtrl)
                {
                    lyr.tileSetConfig.markerCtrl.remove();
                }
            }

            for (var tset_name in overviewer.overlays[world_name])
            {
                var lyr = overviewer.overlays[world_name][tset_name];
                if (world_name != selected_world)
                {
                    if (overviewer.map.hasLayer(lyr))
                        overviewer.map.removeLayer(lyr);
                }
            }
        }

        var center = overviewer.centers[selected_world];
        if (center !== undefined)
        {
            overviewer.map.setView(center.latLng, center.zoom);
        }

        overviewer.current_world = selected_world;

        if (overviewer.mapTypes[selected_world] && overviewer.current_layer[selected_world])
        {
            overviewer.map.addLayer(overviewer.mapTypes[selected_world][overviewer.current_layer[selected_world].tileSetConfig.name]);
        } else
        {
            var tset_name = Object.keys(overviewer.mapTypes[selected_world])[0]
            overviewer.map.addLayer(overviewer.mapTypes[selected_world][tset_name]);
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