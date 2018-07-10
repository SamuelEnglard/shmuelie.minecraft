export default class CoordMapType
{
    private tileSize: { width: number, height: number };

    constructor(tileSize: { width: number, height: number })
    {
        this.tileSize = tileSize;
    }

    getTile(coord: { x: number, y: number }, zoom: number, ownerDocument: HTMLDocument): HTMLDivElement
    {
        const div = ownerDocument.createElement("div");
        div.innerHTML = '(' + coord.x + ', ' + coord.y + ', ' + zoom +
            ')' + '<br />';
        //TODO: figure out how to get the current mapType, I think this
        //will add the maptile url to the grid thing once it works

        //div.innerHTML += overviewer.collections.mapTypes[0].getTileUrl(coord, zoom);

        //this should probably just have a css class
        div.style.width = this.tileSize.width + 'px';
        div.style.height = this.tileSize.height + 'px';
        div.style.fontSize = '10px';
        div.style.borderStyle = 'solid';
        div.style.borderWidth = '1px';
        div.style.borderColor = '#AAAAAA';
        return div;
    }
}