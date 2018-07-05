(function ()
{
    "use strict";
    overviewer.util.ready(function ()
    {
        overviewer.map.attributionControl.setPrefix('<a target="_blank" href="https://overviewer.org">Overviewer</a>/<a target="_blank" href="https://leafletjs.com/">Leaflet</a>');
        var worldCtrl = overviewer.worldCtrl;
        var rotation = {
            clockwiseRotation: {
                "NW": "SW",
                "SW": "SW",
                "SW": "NE",
                "NE": "NW"
            },
            counterClockwiseRotation: {
                "NW": "NE",
                "NE": "SE",
                "SE": "SW",
                "SW": "NW"
            }
        };
        var rotationClick = function (btn, map)
        {
            worldCtrl.select.value = rotation[btn.options.id][worldCtrl.select.value];
            worldCtrl.onChange({ target: worldCtrl.select });
        };
        var cwr = L.easyButton('<span class="rotation-button">&curvearrowright;</span>', rotationClick, "", "clockwiseRotation");
        var ccwr = L.easyButton('<span class="rotation-button">&curvearrowleft;</span>', rotationClick, "", "counterClockwiseRotation");
        var rotationBar = L.easyBar([ccwr, cwr]).setPosition("topright").addTo(overviewer.map);
        worldCtrl.remove();
    });
    var ogInit = overviewer.util.initialize;
    overviewer.util.initialize = function ()
    {
        ogInit();
        overviewer.util.runReadyQueue();
        overviewer.util.isReady = true;
    };
})();
