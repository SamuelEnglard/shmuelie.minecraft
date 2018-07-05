/// <reference types="leaflet-easybutton" />
import * as L from 'leaflet'

interface CardinalDirections
{
    NW: string
    NE: string
    SW: string
    SE: string
}

declare module 'leaflet' {
    export interface Map extends Evented
    {
        attributionControl: L.Control.Attribution
    }
}

overviewer.util.ready(function ()
{
    overviewer.map.attributionControl.setPrefix('<a target="_blank" href="https://overviewer.org">Overviewer</a>/<a target="_blank" href="https://leafletjs.com/">Leaflet</a>');
    let worldCtrl = overviewer.worldCtrl;
    let cwr = L.easyButton('<span class="rotation-button">&curvearrowright;</span>', function ()
    {
        let directions: CardinalDirections = {
            "NW": "SW",
            "SW": "SE",
            "SE": "NE",
            "NE": "NW"
        };
        worldCtrl.select.value = directions[<keyof CardinalDirections>worldCtrl.select.value];
        worldCtrl.onChange({ target: worldCtrl.select });
    });
    let ccwr = L.easyButton('<span class="rotation-button">&curvearrowleft;</span>', function ()
    {
        let directions: CardinalDirections = {
            "NW": "NE",
            "NE": "SE",
            "SE": "SW",
            "SW": "NW"
        };
        worldCtrl.select.value = directions[<keyof CardinalDirections>worldCtrl.select.value];
        worldCtrl.onChange({ target: worldCtrl.select });
    });
    L.easyBar([ccwr, cwr]).setPosition("topright").addTo(overviewer.map);
    worldCtrl.remove();
});
var ogInit = overviewer.util.initialize;
overviewer.util.initialize = function ()
{
    ogInit();
    overviewer.util.runReadyQueue();
    overviewer.util.isReady = true;
};
