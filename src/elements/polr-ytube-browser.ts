import { LitElement, html, css, CSSResultGroup, PropertyValueMap } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { join } from "lit/directives/join.js";
import { map } from "lit/directives/map.js";
import { PoLRYTubeList } from "./polr-ytube-list";
import { PoLRYTubeItem, PoLRYTubeListState } from "../utils/utils";
import { ArrowLeftIcon } from "../utils/icons";

@customElement("polr-ytube-browser")
export class PoLRYTubeBrowser extends LitElement {
    @property() public entity: any;
    @property() public hass: any;
    @state() public initialAction: PoLRYTubeItem;
    @state() private _browseHistory: PoLRYTubeItem[] = [];
    @state() private _polrYTubeList: PoLRYTubeList;

    protected firstUpdated(_changedProperties): void {
        this._polrYTubeList = this.renderRoot.querySelector("polr-ytube-list");
        this._browse(this.initialAction);
    }

    render() {
        return html`
            ${this._renderNavigation()}
            <polr-ytube-list
                .hass=${this.hass}
                .entity=${this.entity}
                @navigate=${(ev) =>
                    this._browse(ev.detail.action)}></polr-ytube-list>
        `;
    }

    private _renderNavigation() {
        if (this._browseHistory.length <= 1) return html``;

        let breadcrumbItems;
        if (this._browseHistory.length > 2) {
            breadcrumbItems = [
                this._browseHistory[0].title,
                "...",
                this._browseHistory[this._browseHistory.length - 1].title,
            ];
        } else {
            breadcrumbItems = this._browseHistory.map((item) => item.title);
        }

        let breadcrumb = html`
            ${join(
                map(
                    breadcrumbItems,
                    (i) => html`<span class="crumb">${i}</span>`
                ),
                html`<span class="separator">/</span>`
            )}
        `;

        return html`
            <div class="back-button">
                <mwc-icon-button
                    @click=${() =>
                        this._browse(
                            this._browseHistory.pop() &&
                                this._browseHistory.pop()
                        )}>
                    ${ArrowLeftIcon}
                </mwc-icon-button>
                <div class="breadcrumb">${breadcrumb}</div>
            </div>
        `;
    }

    async _browse(element: PoLRYTubeItem) {
        this._polrYTubeList.state = PoLRYTubeListState.LOADING;
        this._browseHistory.push(element);

        try {
            const response = await this.hass.callWS({
                type: "media_player/browse_media",
                entity_id: this.entity["entity_id"],
                media_content_type: element.media_content_type,
                media_content_id: element.media_content_id,
            });

            this._polrYTubeList.elements = response["children"];
            this._polrYTubeList.state = PoLRYTubeListState.HAS_RESULTS;
        } catch (e) {
            this._polrYTubeList.state = PoLRYTubeListState.ERROR;
            console.error(
                e,
                element.media_content_type,
                element.media_content_id
            );
        }
        this.requestUpdate();
    }

    static get styles(): CSSResultGroup {
        return [
            css`
                .back-button {
                    display: grid;
                    padding: 12px 0;
                    grid-template-columns: min-content 1fr;
                    align-items: center;
                    gap: 12px;
                }

                .breadcrumb {
                    display: flex;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    align-items: center;
                }
                .crumb {
                    background-color: rgba(111, 111, 111, 0.2);
                    padding: 4px 8px;
                    border-radius: 12px;
                    text-transform: uppercase;
                    font-size: 10px;
                    font-weight: bold;
                }
                .separator {
                    font-weight: bold;
                    padding: 4px;
                }
            `,
        ];
    }
}
