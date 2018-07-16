import * as L from "leaflet";
import { ControlPosition } from "leaflet";
declare module "leaflet" {

    namespace control
    {
        function custom(options?: CustomOptions): Control.Custom;
    }

    interface CustomOptions
    {
        position?: ControlPosition;
        id?: string;
        title?: string;
        classes?: string;
        content?: string;
        style?: CSSStyleDeclaration;
        datas?: object;
        events?: object;
    }

    namespace Control
    {
        class Custom extends L.Control
        {
            constructor(options?: CustomOptions);

            container: HTMLElement | null;
            version: string;
        }
    }
}