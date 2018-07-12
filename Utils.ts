export function fromWorldToLatLng(x: number, y: number, z: number, tset: OverviewerTileSet): [number, number]
{

    const zoomLevels = tset.zoomLevels;
    const north_direction = tset.north_direction;

    // the width and height of all the highest-zoom tiles combined,
    // inverted
    const perPixel = 1 / (overviewerConfig.CONST.tileSize *
        Math.pow(2, zoomLevels));

    if (north_direction === overviewerConfig.CONST.UPPERRIGHT)
    {
        const temp = x;
        x = -z + 15;
        z = temp;
    }
    else if (north_direction === overviewerConfig.CONST.LOWERRIGHT)
    {
        x = -x + 15;
        z = -z + 15;
    }
    else if (north_direction === overviewerConfig.CONST.LOWERLEFT)
    {
        const temp = x;
        x = z;
        z = -temp + 15;
    }

    // This information about where the center column is may change with
    // a different drawing implementation -- check it again after any
    // drawing overhauls!

    // point (0, 0, 127) is at (0.5, 0.0) of tile (tiles/2 - 1, tiles/2)
    // so the Y coordinate is at 0.5, and the X is at 0.5 -
    // ((tileSize / 2) / (tileSize * 2^zoomLevels))
    // or equivalently, 0.5 - (1 / 2^(zoomLevels + 1))
    let lng = 0.5 - (1 / Math.pow(2, zoomLevels + 1));
    let lat = 0.5;

    // the following metrics mimic those in
    // chunk_render in src/iterate.c

    // each block on X axis adds 12px to x and subtracts 6px from y
    lng += 12 * x * perPixel;
    lat -= 6 * x * perPixel;

    // each block on Y axis adds 12px to x and adds 6px to y
    lng += 12 * z * perPixel;
    lat += 6 * z * perPixel;

    // each block down along Z adds 12px to y
    lat += 12 * (256 - y) * perPixel;

    // add on 12 px to the X coordinate to center our point
    lng += 12 * perPixel;

    return [-lat * overviewerConfig.CONST.tileSize, lng * overviewerConfig.CONST.tileSize];
}

export function fromLatLngToWorld(lat: number, lng: number, tset: OverviewerTileSet): {x: number, y: number, z: number}
{
    const zoomLevels = tset.zoomLevels;
    const north_direction = tset.north_direction;

    lat = -lat / overviewerConfig.CONST.tileSize;
    lng = lng / overviewerConfig.CONST.tileSize;

    // lat lng will always be between (0,0) -- top left corner
    //                                (-384, 384) -- bottom right corner

    // Initialize world x/y/z object to be returned
    const point = {
        x: 0,
        y: 64,
        z: 0
    };

    // the width and height of all the highest-zoom tiles combined,
    // inverted
    const perPixel = 1 / (overviewerConfig.CONST.tileSize *
        Math.pow(2, zoomLevels));

    // Revert base positioning
    // See equivalent code in fromWorldToLatLng()
    lng -= 0.5 - (1 / Math.pow(2, zoomLevels + 1));
    lat -= 0.5;

    // I"ll admit, I plugged this into Wolfram Alpha:
    //   a = (x * 12 * r) + (z * 12 * r), b = (z * 6 * r) - (x * 6 * r)
    // And I don"t know the math behind solving for for X and Z given
    // A (lng) and B (lat).  But Wolfram Alpha did. :)  I"d welcome
    // suggestions for splitting this up into long form and documenting
    // it. -RF
    point.x = Math.floor((lng - 2 * lat) / (24 * perPixel));
    point.z = Math.floor((lng + 2 * lat) / (24 * perPixel));

    // Adjust for the fact that we we can"t figure out what Y is given
    // only latitude and longitude, so assume Y=64. Since this is lowering
    // down from the height of a chunk, it depends on the chunk height as
    // so:
    point.x += 256 - 64;
    point.z -= 256 - 64;

    if (north_direction === overviewerConfig.CONST.UPPERRIGHT)
    {
        const temp = point.z;
        point.z = -point.x + 15;
        point.x = temp;
    }
    else if (north_direction === overviewerConfig.CONST.LOWERRIGHT)
    {
        point.x = -point.x + 15;
        point.z = -point.z + 15;
    }
    else if (north_direction === overviewerConfig.CONST.LOWERLEFT)
    {
        const temp = point.z;
        point.z = point.x;
        point.x = -temp + 15;
    }

    return point;
}

export function getTileUrlGenerator(path: string, pathBase: string, pathExt: string)
{
    return function (o: L.Coords)
    {
        let url = path;
        const zoom = o.z;
        const urlBase = (pathBase ? pathBase : "");
        if (o.x < 0 || o.x >= Math.pow(2, zoom) ||
            o.y < 0 || o.y >= Math.pow(2, zoom))
        {
            url += "/blank";
        }
        else if (zoom === 0)
        {
            url += "/base";
        }
        else
        {
            for (let z = zoom - 1; z >= 0; --z)
            {
                const x = Math.floor(o.x / Math.pow(2, z)) % 2;
                const y = Math.floor(o.y / Math.pow(2, z)) % 2;
                url += "/" + (x + 2 * y);
            }
        }
        url = url + "." + pathExt;
        if (typeof overviewerConfig.map.cacheTag !== "undefined")
        {
            url += "?c=" + overviewerConfig.map.cacheTag;
        }
        return (urlBase + url);
    };
}