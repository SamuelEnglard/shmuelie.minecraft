interface Marker
{
    text: string;
    x: number;
    y: number;
    z: number;
    hovertext?: string;
    icon: string;
}

interface MarkerGroup
{
    raw: Marker[];
    name: string;
    created: boolean;
}

interface MarkerDb
{
    [markerGroup: string]: MarkerGroup;
}

interface MarkersGroup
{
    groupName: string;
    icon: string;
    createInfoWindow: boolean;
    displayName: string;
    checked: boolean;
}

interface Markers
{
    [world: string]: MarkersGroup[];
}

declare const markers: Markers | undefined;
declare const markersDB: MarkerDb | undefined;