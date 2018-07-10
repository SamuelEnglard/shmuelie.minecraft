interface OverviewerTileSet
{
    spawn: number[],
    isOverlay: boolean,
    last_rendertime: number,
    name: string,
    poititle: string,
    north_direction: number,
    minZoom: number,
    bgcolor: string,
    zoomLevels: number,
    base: string,
    imgextension: string,
    defaultZoom: number,
    world: string,
    maxZoom: number,
    path: string,
    showlocationmarker: boolean,
    marker_groups: L.Control.LayersObject | undefined,
    markerCtrl: L.Control | undefined
}

interface OverviewerConfig
{
    worlds: string[],
    tilesets: OverviewerTileSet[],
    CONST: {
        mapDivId: string,
        UPPERLEFT: number,
        tileSize: number,
        UPPERRIGHT: number,
        image: {
            queryMarker: string,
            spawnMarker: string,
            spawnMarker2x: string,
            signMarker: string,
            queryMarker2x: string,
            compass: {
                0: string,
                1: string,
                2: string,
                3: string
            },
            defaultMarker: string,
            bedMarker: string
        },
        LOWERRIGHT: number,
        LOWERLEFT: number
    },
    map: {
        debug: boolean,
        north_direction: "lower-left" | "lower-right" | "upper-right" | "upper-left",
        controls: {
            spawn: boolean,
            coordsBox: boolean,
            zoom: boolean,
            mapType: boolean,
            compass: boolean,
            overlays: boolean,
            pan: boolean
        },
        center: number[],
        cacheTag: string
    }
}

declare const overviewerConfig: OverviewerConfig;