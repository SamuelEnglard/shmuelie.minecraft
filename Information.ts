import * as L from "leaflet";
import "leaflet-easybutton";
import "leaflet-custom";
import { DateTime } from "luxon";

interface InformationPrototype extends L.Control
{
    button: L.Control.EasyButton;
    infoArea: L.Control.Custom;
    map: L.Map;
}

interface Information
{
    new(): InformationPrototype;
}
const information: Information = L.Control.extend({
    initialize: function (this: InformationPrototype): void
    {
        this.button = L.easyButton({
            states: [
                {
                    stateName: "showInfo",
                    onClick: (btn: L.Control.EasyButton) =>
                    {
                        this.infoArea.addTo(this.map);
                        btn.state("hideInfo");
                    },
                    icon: "<span>&#8505;</span>",
                    title: "Show Information"
                },
                {
                    stateName: "hideInfo",
                    onClick: (btn: L.Control.EasyButton) =>
                    {
                        this.infoArea.remove();
                        btn.state("showInfo");
                    },
                    icon: "<span>&#215;</span>",
                    title: "Hide Information"
                }
            ]
        });
        this.infoArea = L.control.custom({
            classes: "leaflet-popup-content-wrapper",
            content: "<div class='leaflet-popup-content'>Generated using " + (<HTMLMetaElement>document.getElementsByName("generator")[0]).content + " on " + DateTime.fromHTTP((<HTMLMetaElement>document.getElementsByName("revision")[0]).content).toLocaleString(DateTime.DATETIME_FULL) + "</div>",
            style: <CSSStyleDeclaration>{
                maxWidth: "150px"
            }
        });
    },
    onAdd: function (this: InformationPrototype, map: L.Map): HTMLElement | null
    {
        this.map = map;
        if (this.button.onAdd)
        {
            return this.button.onAdd(map);
        }
        return null;
    },
    setPosition: function (this: InformationPrototype, position: L.ControlPosition): InformationPrototype
    {
        this.button.setPosition(position);
        this.infoArea.setPosition(position);
        return this;
    },
    getPosition: function (this: InformationPrototype): L.ControlPosition
    {
        return this.button.getPosition();
    }
});

export default information;