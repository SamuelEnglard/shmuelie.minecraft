(function ()
{
    "use strict";

    require.config({
        bundles: {
            "overviewer": ["App", "Compass", "CoordBox", "Information", "Utils", "Worlds"]
        },
        paths: {
            "leaflet": "https://cdn.jsdelivr.net/npm/leaflet@1.3.3/dist/leaflet-src.min",
            "leaflet-easybutton": "https://cdn.jsdelivr.net/npm/leaflet-easybutton@2/src/easy-button.min",
            "leaflet-custom": "https://cdn.jsdelivr.net/npm/leaflet-control-custom@1.0.0/Leaflet.Control.Custom.min"
        },
        shim: {
            "leaflet-easybutton": {
                deps: ["leaflet"],
                exports: "L.Control.EasyButton"
            },
            "leaflet-custom": {
                deps: ["leaflet"],
                exports: "L.control.custom"
            },
            "overviewerConfig": {
                exports: "overviewerConfig"
            },
            "markers": {
                exports: "markers"
            },
            "markersDB": {
                exports: "markersDB"
            }
        },
        deps: ["App"]
    });
})();