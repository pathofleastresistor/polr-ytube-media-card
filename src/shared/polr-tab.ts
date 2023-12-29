import { __decorate } from "tslib";
import { html } from "lit";
import { customElement, query } from "lit/decorators.js";
import { TabBase } from "@material/mwc-tab/mwc-tab-base";
import { styles } from "@material/mwc-tab/mwc-tab.css";
import "./polr-tab-indicator";

@customElement("polr-tab")
export class PoLRTab extends TabBase {
    renderIndicator() {
        return html`<polr-tab-indicator
            .icon="${this.indicatorIcon}"
            .fade="${this.isFadingIndicator}"></polr-tab-indicator>`;
    }

    static override styles = [styles];
}

declare global {
    interface HTMLElementTagNameMap {
        "polr-tab": PoLRTab;
    }
}

__decorate(
    [query("polr-tab-indicator")],
    TabBase.prototype,
    "tabIndicator",
    void 0
);
