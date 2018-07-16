import * as L from "leaflet";
import "leaflet-easybutton";
import "leaflet-custom";

interface InformationPrototype extends L.Control
{
    button: L.Control.EasyButton;
    onClick: () => void;
    infoArea: L.Control.Custom;
    open: boolean;
    map: L.Map;
}

interface Information
{
    new(): InformationPrototype;
}

const information: Information = L.Control.extend({
    initialize: function (this: InformationPrototype): void
    {
        this.button = L.easyButton("<span>&#8505;</span>", this.onClick.bind(this), "Information");
        this.open = false;
        this.infoArea = L.control.custom({
            classes: "leaflet-popup-content-wrapper",
            content: "<div class='leaflet-popup-content'>Generated using " + (<HTMLMetaElement>document.getElementsByName("generator")[0]).content + " on " + (<HTMLMetaElement>document.getElementsByName("revision")[0]).content + "</div>",
            style: <CSSStyleDeclaration>{
                maxWidth: "150px"
            }
        });
    },
    onClick: function (this: InformationPrototype): void
    {
        if (this.open)
        {
            this.infoArea.remove();
        }
        else
        {
            this.infoArea.addTo(this.map);
        }
        this.open = !this.open;
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