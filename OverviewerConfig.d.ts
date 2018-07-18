export as namespace overviewerConfig;

export interface MapLocation
{
    latLng: L.LatLngExpression;
    zoom: number;
}

export type Point3DTuple = [number, number, number];

export interface Point3D
{
    x: number;
    y: number;
    z: number;
}

export type Point3DExpression = Point3D | Point3DTuple;

export interface OverviewerTileSet
{
    spawn: Point3DTuple,
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

export const worlds: string[];
export const tilesets: OverviewerTileSet[];
export const CONST: {
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
};
export const map: {
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
    center: [number, number],
    cacheTag: string
};