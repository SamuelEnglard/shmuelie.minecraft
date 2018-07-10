import * as L from 'leaflet'
import overviewer from './App';

interface ChangeEvent
{
    target: { value: string }
}

interface WorldsPrototype extends L.Control
{
    container: HTMLDivElement;
    select: HTMLSelectElement;
    addWorld(world: string): void;
    onChange(ev: ChangeEvent): void;
}

interface Worlds
{
    new(options?: L.ControlOptions): WorldsPrototype;
}

const worlds: Worlds = L.Control.extend({
    initialize: function (options: L.ControlOptions): void
    {
        L.Util.setOptions(this, options);

        this.container = L.DomUtil.create('div', 'worldcontrol');
        this.select = L.DomUtil.create('select');
        this.select.onchange = this.onChange;
        this.container.appendChild(this.select);
    },
    addWorld: function (world: string): void
    {
        var option: HTMLOptionElement = <HTMLOptionElement>L.DomUtil.create('option');
        option.value = world;
        option.innerText = world;
        this.select.appendChild(option);
    },
    onChange: function (ev: ChangeEvent): void
    {
        console.log(ev.target);
        console.log(ev.target.value);
        var selected_world = ev.target.value;


        // save current view for the current_world
        if (overviewer.map === null)
        {
            return;
        }
        overviewer.centers[overviewer.current_world].latLng = overviewer.map.getCenter();
        overviewer.centers[overviewer.current_world].zoom = overviewer.map.getZoom();

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
        overviewer.map.setView(center.latLng, center.zoom);

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
    onAdd: function (): HTMLElement
    {
        console.log("onAdd mycontrol");

        return this.container
    }
});

export default worlds;