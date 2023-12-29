import { TabIndicatorBase } from "@material/mwc-tab-indicator/mwc-tab-indicator-base";
import { styles } from "@material/mwc-tab-indicator/mwc-tab-indicator.css";
import { customElement } from "lit/decorators.js";

@customElement("polr-tab-indicator")
export class PoLRTabIndicator extends TabIndicatorBase {
    static override styles = [styles];
}

declare global {
    interface HTMLElementTagNameMap {
        "polr-tab-indicator": PoLRTabIndicator;
    }
}
