export default class MapProjection
{
    private inverseTileSize: number;

    constructor()
    {
        this.inverseTileSize = 1 / overviewerConfig.CONST.tileSize;
    }

    fromLatLngToPoint(latLng: { lng: number, lat: number }): { x: number, y: number }
    {
        const x = latLng.lng * overviewerConfig.CONST.tileSize;
        const y = latLng.lat * overviewerConfig.CONST.tileSize;
        return { x: x, y: y };
    }

    fromPointToLatLng(point: { x: number, y: number }): { lng: number, lat: number }
    {
        const lng = point.x * this.inverseTileSize;
        const lat = point.y * this.inverseTileSize;
        return { lng: lng, lat: lat };
    }
}