import { __decorate } from "tslib";
import { html } from "lit";
import { customElement, query } from "lit/decorators.js";
import { TabBarBase } from "@material/mwc-tab-bar/mwc-tab-bar-base";
import { styles } from "@material/mwc-tab-bar/mwc-tab-bar.css";
import "./polr-tab-scroller";

@customElement("polr-tab-bar")
export class PoLRTabBar extends TabBarBase {
    override render() {
        return html`
            <div
                class="mdc-tab-bar"
                role="tablist"
                @MDCTab:interacted="${this._handleTabInteraction}"
                @keydown="${this._handleKeydown}">
                <polr-tab-scroller><slot></slot></polr-tab-scroller>
            </div>
        `;
    }
    static override styles = [styles];
}

declare global {
    interface HTMLElementTagNameMap {
        "polr-tab-bar": PoLRTabBar;
    }
}

__decorate(
    [query("polr-tab-scroller")],
    TabBarBase.prototype,
    "scrollerElement",
    void 0
);
