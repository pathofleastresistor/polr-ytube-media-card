import { LitElement, html, css, CSSResultGroup } from "lit";
import { customElement, state } from "lit/decorators.js";
import { isNumeric, PoLRYTubeItem, PoLRYTubeListState } from "../utils/utils";
import "./polr-ytube-list-item";

@customElement("polr-ytube-list")
export class PoLRYTubeList extends LitElement {
    @state() public entity: any;
    @state() public hass: any;
    @state() public elements: PoLRYTubeItem[];
    @state() public state: PoLRYTubeListState;

    render() {
        if (this.state == PoLRYTubeListState.LOADING) {
            return html`<div class="loading">Loading...</div>`;
        }

        if (this.state == PoLRYTubeListState.NO_RESULTS) {
            return html`<div class="empty">No results</div>`;
        }

        if (this.state == PoLRYTubeListState.ERROR) {
            return html`<div class="error">Unknown Error</div>`;
        }

        if (this.state == PoLRYTubeListState.HAS_RESULTS) {
            if (this.elements.length == 0) return html``;

            const renderedElements = this.elements.map((element) => {
                return html`
                    <polr-ytube-list-item
                        .hass=${this.hass}
                        .entity=${this.entity}
                        .element=${element}
                        .current=${this._is_current(element)}
                        @navigate=${(ev) =>
                            this._fireNavigateEvent(ev.detail.action)}
                    ></polr-ytube-list-item>
                `;
            });

            return html`${renderedElements}`;
        }
    }

    private _is_current(element: PoLRYTubeItem): boolean {
        if (this.entity == null) return false;
        if (!isNumeric(element.media_content_id)) return false;

        if ("current_track" in this.entity["attributes"]) {
            return (
                parseInt(element.media_content_id) - 1 ==
                this.entity["attributes"]["current_track"]
            );
        }
        return false;
    }

    private async _fireNavigateEvent(element: PoLRYTubeItem) {
        this.dispatchEvent(
            new CustomEvent("navigate", {
                detail: {
                    action: element,
                },
            })
        );
        return;
    }

    static get styles(): CSSResultGroup {
        return [
            css`
                :host {
                    display: grid;
                    gap: 4px;
                }

                .empty,
                .loading,
                .error {
                    display: grid;
                    align-items: center;
                    justify-items: center;
                    height: 100px;
                }
            `,
        ];
    }
}
