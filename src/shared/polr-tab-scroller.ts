import { TabScrollerBase } from "@material/mwc-tab-scroller/mwc-tab-scroller-base";
import { styles } from "@material/mwc-tab-scroller/mwc-tab-scroller.css";
import { customElement } from "lit/decorators.js";

@customElement("polr-tab-scroller")
export class PoLRTabScroller extends TabScrollerBase {
    static override styles = [styles];
}

declare global {
    interface HTMLElementTagNameMap {
        "polr-tab-scroller": PoLRTabScroller;
    }
}
