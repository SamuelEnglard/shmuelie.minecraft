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