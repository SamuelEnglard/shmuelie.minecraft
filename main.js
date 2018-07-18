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
        onNodeCreated: function (node, config, module, path)
        {
            var sri = {
                "leaflet": "sha384-watgrHyz5s6If1F1SQTokK1ytZo0ZIMziman7hchM9VFZ+n4Gx2MJtSVr15p7NSv",
                "leaflet-easybutton": "sha384-nYukKhU4gP3v3v9WXXWSodjuI03hjcPwRwSp3F8eHMmyTA4T2y4iGMa6SiNCfEBR",
                "leaflet-custom": "sha384-0YoQdbydLb3Fy70pJLKP4X5ZRcwmHaeNj62ZJUhkBmvSpe42R0RrDCAP5+Q6XOWe"
            };
            if (sri[module])
            {
                node.setAttribute("integrity", sri[module]);
                node.setAttribute("crossorigin", "anonymous");
            }
        },
        deps: ["App"]
    });
})();