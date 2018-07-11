import * as L from 'leaflet'
import { fromWorldToLatLng, fromLatLngToWorld, getTileUrlGenerator } from './Utils';
import Compass from './Compass'
import Worlds from './Worlds';
import CoordBox from './CoordBox';

interface OverviewerLayer extends L.Layer
{
    tileSetConfig: OverviewerTileSet
}

interface OverviewTileLayer extends L.TileLayer, OverviewerLayer
{
    getTileUrl: (o: L.Coords) => string
}

interface OverviewerLayersObject extends L.Control.LayersObject
{
    [name: string]: OverviewerLayer
}

interface Centers
{
    [world: string]: { latLng: L.LatLng, zoom: number }
}

interface CurrentLayer
{
    [world: string]: OverviewerLayer
}

interface MapTypes
{
    [world: string]: OverviewerLayersObject
}

interface App
{
    current_world: string
    current_layer: CurrentLayer
    map: L.Map
    layerCtrl: L.Control.Layers | null
    centers: Centers
    mapTypes: MapTypes
    overlays: MapTypes
    ready(callback: () => void): void
}

let isReady = false;
let readyQueue = <(() => void)[]>[];
const compass = new Compass(overviewerConfig.CONST.image.compass);
let spawnMarker: L.Marker<any> | null = null;
let locationMarker: L.Marker<any> | null = null;
let lastHash = "";
const worldCtrl = new Worlds();
const coord_box = new CoordBox();
let haveSigns = false;

function initHash(): boolean
{
    var newHash = window.location.hash;
    if (lastHash !== newHash)
    {
        lastHash = newHash;
        if (newHash.split("/").length > 1)
        {
            goToHash();
            // Clean up the hash.
            updateHash();
            return true;
        }
    }
    return false; // signal to caller that we didn't goto any hash
}

function setHash(x: number, y: number, z: number, zoom: number | "max" | "min", w: string, maptype: string): void
{
    // save this info is a nice easy to parse format
    var newHash = "#/" + Math.floor(x) + "/" + Math.floor(y) + "/" + Math.floor(z) + "/" + zoom + "/" + encodeURI(w) + "/" + encodeURI(maptype);
    lastHash = newHash; // this should not trigger initHash
    window.location.replace(newHash);
}

function updateHash()
{
    // name of current world
    var currWorld = app.current_world;
    if (currWorld == null) { return; }

    var currTileset = app.current_layer[currWorld];
    if (currTileset == null) { return; }

    var ovconf = currTileset.tileSetConfig;

    var coordinates = fromLatLngToWorld(app.map.getCenter().lat,
        app.map.getCenter().lng,
        ovconf);
    var zoom: number | "max" | "min" = app.map.getZoom();

    if (zoom >= ovconf.maxZoom)
    {
        zoom = 'max';
    } else if (zoom <= ovconf.minZoom)
    {
        zoom = 'min';
    } else
    {
        // default to (map-update friendly) negative zooms
        zoom -= ovconf.maxZoom;
    }
    setHash(coordinates.x, coordinates.y, coordinates.z, zoom, currWorld, ovconf.name);
}

function goToHash()
{
    // Note: the actual data begins at coords[1], coords[0] is empty.
    var coords = window.location.hash.split("/");


    var zoom: string | number = "";
    var world_name: string = "";
    var tileset_name: string = "";
    // The if-statements try to prevent unexpected behaviour when using incomplete hashes, e.g. older links
    if (coords.length > 4)
    {
        zoom = coords[4];
    }
    if (coords.length > 6)
    {
        world_name = decodeURI(coords[5]);
        tileset_name = decodeURI(coords[6]);
    }

    var target_layer = app.mapTypes[world_name][tileset_name];
    var ovconf = target_layer.tileSetConfig;

    var latlngcoords = fromWorldToLatLng(parseInt(coords[1]),
        parseInt(coords[2]),
        parseInt(coords[3]),
        ovconf);

    if (zoom == 'max')
    {
        zoom = ovconf.maxZoom;
    } else if (zoom == 'min')
    {
        zoom = ovconf.minZoom;
    } else
    {
        zoom = parseInt(zoom);
        if (zoom < 0)
        {
            // if zoom is negative, treat it as a "zoom out from max"
            zoom += ovconf.maxZoom;
        } else
        {
            // fall back to default zoom
            zoom = ovconf.defaultZoom;
        }
    }

    // clip zoom
    if (zoom > ovconf.maxZoom)
        zoom = ovconf.maxZoom;
    if (zoom < ovconf.minZoom)
        zoom = ovconf.minZoom;

    // build a fake event for the world switcher control
    worldCtrl.onChange({ selectedWorld: world_name });
    if (!app.map.hasLayer(target_layer))
    {
        app.map.addLayer(target_layer);
    }

    app.map.setView(latlngcoords, zoom);

    if (ovconf.showlocationmarker)
    {
        var locationIcon = L.icon({
            iconUrl: overviewerConfig.CONST.image.queryMarker,
            iconRetinaUrl: overviewerConfig.CONST.image.queryMarker2x,
            iconSize: [32, 37],
            iconAnchor: [15, 33],
        });
        var locationm = L.marker(latlngcoords, {
            icon: locationIcon,
            title: "Linked location"
        });
        locationMarker = locationm
        locationMarker.on('contextmenu', function ()
        {
            if (locationMarker !== null)
            {
                locationMarker.remove();
            }
        });
        locationMarker.on('click', function (ev)
        {
            let event: L.LeafletMouseEvent = <L.LeafletMouseEvent>ev;
            app.map.setView(event.latlng, app.map.getZoom());
        });
        locationMarker.addTo(app.map);
    }
}

function runReadyQueue(): void
{
    if (readyQueue.length === 0) return;
    readyQueue.forEach(function (callback)
    {
        callback();
    });
    readyQueue = [];
}

const app: App = {
    current_world: "",
    current_layer: {},
    map: L.map("mcmap", {
        crs: L.CRS.Simple,
        minZoom: 0
    }),
    layerCtrl: null,
    centers: {},
    mapTypes: {},
    overlays: {},
    ready: function (callback: () => void): void
    {
        if (typeof callback !== 'function')
        {
            return;
        }
        if (isReady)
        { // run instantly if overviewer already is ready
            readyQueue.push(callback);
            runReadyQueue();
        }
        else
        {
            readyQueue.push(callback); // wait until initialize is finished
        }
    }
};

app.map.on("baselayerchange", function (event)
{
    const ev: L.LayerEvent = <L.LayerEvent>event;
    const layer: OverviewerLayer = <OverviewerLayer>ev.layer;
    // before updating the current_layer, remove the marker control, if it exists
    if (app.current_world && app.current_layer[app.current_world])
    {
        let tsc = app.current_layer[app.current_world].tileSetConfig;

        if (tsc.markerCtrl)
            tsc.markerCtrl.remove();
        if (tsc.marker_groups)
        {
            for (var marker_group in tsc.marker_groups)
            {
                tsc.marker_groups[marker_group].remove();
            }
        }

    }
    app.current_layer[app.current_world] = layer;
    var ovconf = layer.tileSetConfig;

    // Change the compass
    compass.render(ovconf.north_direction);

    // Set the background colour
    app.map.getContainer().style.backgroundColor = ovconf.bgcolor;

    if (locationMarker)
    {
        locationMarker.remove();
    }
    // Remove old spawn marker, add new one
    if (spawnMarker)
    {
        spawnMarker.remove();
    }
    if (typeof (ovconf.spawn) == "object")
    {
        var spawnIcon = L.icon({
            iconUrl: overviewerConfig.CONST.image.spawnMarker,
            iconRetinaUrl: overviewerConfig.CONST.image.spawnMarker2x,
            iconSize: [32, 37],
            iconAnchor: [15, 33],
        });
        var latlng = fromWorldToLatLng(ovconf.spawn[0],
            ovconf.spawn[1],
            ovconf.spawn[2],
            ovconf);
        var ohaimark = L.marker(latlng, { icon: spawnIcon, title: "Spawn" });
        ohaimark.on('click', function (ev2)
        {
            var event2: L.LeafletMouseEvent = <L.LeafletMouseEvent>ev2;
            app.map.setView(event2.latlng, app.map.getZoom());
        });
        spawnMarker = ohaimark
        spawnMarker.addTo(app.map);
    } else
    {
        spawnMarker = null;
    }

    // reset the markers control with the markers for this layer
    if (ovconf.marker_groups)
    {
        console.log("markers for", ovconf.marker_groups);
        ovconf.markerCtrl = L.control.layers(undefined, ovconf.marker_groups, { collapsed: false }).addTo(app.map);
    }

    updateHash();
});

app.map.on('moveend', function ()
{
    updateHash();
});

var tset = overviewerConfig.tilesets[0];

app.map.on("click", function (event)
{
    let e: L.LeafletMouseEvent = <L.LeafletMouseEvent>event;
    console.log(e.latlng);
    var point = fromLatLngToWorld(e.latlng.lat, e.latlng.lng, tset);
    console.log(point);
});

overviewerConfig.worlds.forEach(function (world_name)
{
    app.mapTypes[world_name] = {};
    app.overlays[world_name] = {};
});

compass.addTo(app.map);
coord_box.addTo(app.map);
worldCtrl.addTo(app.map);

app.map.on('mousemove', function (event)
{
    let ev: L.LeafletMouseEvent = <L.LeafletMouseEvent>event;
    coord_box.render(ev.latlng);
});

overviewerConfig.tilesets.forEach(function (obj)
{
    var myLayer: OverviewTileLayer = <OverviewTileLayer>L.tileLayer('', {
        tileSize: overviewerConfig.CONST.tileSize,
        noWrap: true,
        maxZoom: obj.maxZoom,
        minZoom: obj.minZoom,
        errorTileUrl: obj.base + obj.path + "/blank." + obj.imgextension,
    });
    myLayer.getTileUrl = getTileUrlGenerator(obj.path, obj.base, obj.imgextension);
    myLayer.tileSetConfig = obj;

    if (obj.isOverlay)
    {
        app.overlays[obj.world][obj.name] = myLayer;
    } else
    {
        app.mapTypes[obj.world][obj.name] = myLayer;
    }

    obj.marker_groups = undefined;

    if (haveSigns == true)
    {
        // if there are markers for this tileset, create them now
        if ((typeof markers !== 'undefined') && (typeof markersDB !== "undefined" ) && (obj.path in markers))
        {
            console.log("this tileset has markers:", obj);
            obj.marker_groups = {};

            for (var mkidx = 0; mkidx < markers[obj.path].length; mkidx++)
            {
                var marker_group = L.layerGroup();
                var marker_entry = markers[obj.path][mkidx];
                var icon = L.icon({ iconUrl: marker_entry.icon });
                console.log("marker group:", marker_entry.displayName, marker_entry.groupName);

                for (var dbidx = 0; dbidx < markersDB[marker_entry.groupName].raw.length; dbidx++)
                {
                    var db = markersDB[marker_entry.groupName].raw[dbidx];
                    var latlng = fromWorldToLatLng(db.x, db.y, db.z, obj);
                    var m_icon;
                    if (db.icon != undefined)
                    {
                        m_icon = L.icon({ iconUrl: db.icon });
                    } else
                    {
                        m_icon = icon;
                    }
                    let new_marker = L.marker(latlng, { icon: m_icon });
                    new_marker.bindPopup(db.text);
                    marker_group.addLayer(new_marker);
                }
                obj.marker_groups[marker_entry.displayName] = marker_group;
            }
        }
    }


    if (typeof (obj.spawn) == "object")
    {
        var latlng = fromWorldToLatLng(obj.spawn[0], obj.spawn[1], obj.spawn[2], obj);
        app.centers[obj.world] = { latLng: L.latLng(latlng), zoom: 1 };
    } else
    {
        app.centers[obj.world] = {
            latLng: L.latLng(0, 0),
            zoom: 1
        };
    }

});

app.layerCtrl = L.control.layers(
    app.mapTypes[overviewerConfig.worlds[0]],
    app.overlays[overviewerConfig.worlds[0]],
    { collapsed: false })
    .addTo(app.map);
app.current_world = overviewerConfig.worlds[0];

app.map.setView(fromWorldToLatLng(tset.spawn[0], tset.spawn[1], tset.spawn[2], tset), 1);

if (!initHash())
{
    worldCtrl.onChange({ selectedWorld: app.current_world });
}

export default app;