declare namespace markersDB
{
    interface Marker
    {
        text: string;
        x: number;
        y: number;
        z: number;
        hovertext?: string;
        icon?: string;
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
}

declare const markersDB: markersDB.MarkerDb | undefined;