interface WorldCtrl
{
    select: HTMLSelectElement
    onChange(ev: { target: HTMLSelectElement }): void
    remove(): void
}
interface OverviewerUtils
{
    initialize(): void
    runReadyQueue(): void
    isReady: boolean
    ready(func: () => void): void
}
interface Overviewer
{
    worldCtrl: WorldCtrl
    map: L.Map
    util: OverviewerUtils
}

declare const overviewer: Overviewer;