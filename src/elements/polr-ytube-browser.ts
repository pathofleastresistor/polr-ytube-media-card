import { LitElement, html, css, CSSResultGroup, PropertyValueMap } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { PoLRYTubeList } from "./polr-ytube-list";
import { PoLRYTubeItem, PoLRYTubeListState } from "../utils/utils";

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
            ${this._renderBackButton()}
            <polr-ytube-list
                .hass=${this.hass}
                .entity=${this.entity}
                @navigate=${(ev) =>
                    this._browse(ev.detail.action)}></polr-ytube-list>
        `;
    }

    private _renderBackButton() {
        if (this._browseHistory.length <= 1) return html``;

        const breadcrumb = this._browseHistory
            .map((item) => `${item.title}`)
            .join(" > ");

        return html`
            <div class="back-button">
                <mwc-icon-button
                    @click=${() =>
                        this._browse(
                            this._browseHistory.pop() &&
                                this._browseHistory.pop()
                        )}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <title>arrow-left</title>
                        <path
                            d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z" />
                    </svg>
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
            this.requestUpdate();
        } catch (e) {
            this._polrYTubeList.state = PoLRYTubeListState.ERROR;
            console.error(
                e,
                element.media_content_type,
                element.media_content_id
            );
        }
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
                    display: block;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
            `,
        ];
    }
}
