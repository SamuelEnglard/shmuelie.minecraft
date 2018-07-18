(function ()
{
    "use strict";

    require.config({
        bundles: {
            "overviewer": ["App", "Compass", "CoordBox", "Information", "Utils", "Worlds"]
        },
        paths: {
            "leaflet": "https://unpkg.com/leaflet@1.3.1/dist/leaflet",
            "leaflet-easybutton": "https://cdn.jsdelivr.net/npm/leaflet-easybutton@2/src/easy-button",
            "leaflet-custom": "https://cdn.rawgit.com/yigityuce/Leaflet.Control.Custom/7b4c9088/Leaflet.Control.Custom"
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