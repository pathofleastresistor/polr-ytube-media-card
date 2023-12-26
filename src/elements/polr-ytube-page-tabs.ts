import { LitElement, html, css, CSSResultGroup } from "lit";
import { customElement, property, state } from "lit/decorators.js";

export const enum PoLRYTubePage {
    CURRENTLY_PLAYING = 1,
    FOR_YOU = 2,
    SEARCH = 4,
}

@customElement("polr-ytube-page-tabs")
export class PoLRYTubePageTabs extends LitElement {
    @property() _active: PoLRYTubePage = PoLRYTubePage.CURRENTLY_PLAYING;
    render() {
        return html`
            <div class="tab-container">
                <div
                    class="tab ${this._active == PoLRYTubePage.CURRENTLY_PLAYING
                        ? "active"
                        : "inactive"}"
                    @click=${() =>
                        this.setActive(PoLRYTubePage.CURRENTLY_PLAYING)}>
                    Playing
                </div>
                <div
                    class="tab ${this._active == PoLRYTubePage.FOR_YOU
                        ? "active"
                        : "inactive"}"
                    @click=${() => this.setActive(PoLRYTubePage.FOR_YOU)}>
                    For You
                </div>
                <div
                    class="tab ${this._active == PoLRYTubePage.SEARCH
                        ? "active"
                        : "inactive"}"
                    @click=${() => this.setActive(PoLRYTubePage.SEARCH)}>
                    Search
                </div>
            </div>
        `;
    }

    setActive(page) {
        this._active = page;

        this.dispatchEvent(
            new CustomEvent("tabChange", {
                detail: {
                    tab: page,
                },
            })
        );
    }

    static styles = css`
        .tab-container {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            font-size: 13px;
            text-transform: uppercase;
            justify-items: stretch;
            font-weight: bold;
            gap: 4px;
        }
        .tab {
            text-align: center;
            cursor: pointer;
            padding: 12px;
        }

        .active {
            color: var(--mdc-theme-primary, #6200ee);
            border-bottom: 2px var(--mdc-theme-primary, #6200ee) solid;
        }

        .inactive {
            color: var(--primary-text-color);
        }
    `;
}
