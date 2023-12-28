import { LitElement, html, css, CSSResultGroup, PropertyValueMap } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { PoLRYTubeItem } from "../utils/polr-ytube-item";

export const enum PoLRYTubeState {
    INITAL = 1,
    LOADING = 2,
    HAS_RESULTS = 4,
    NO_RESULTS = 8,
    ERROR = 16,
}

@customElement("polr-ytube-browser")
export class PoLRYTubeBrowser extends LitElement {
    @property() public entity: any;
    @property() public hass: any;
    @property() public elements: PoLRYTubeItem[];
    @property() private _state: PoLRYTubeState = PoLRYTubeState.INITAL;
    @state() private _browseHistory: PoLRYTubeItem[] = [];
    @state() public initialAction: PoLRYTubeItem;

    protected firstUpdated(
        _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
    ): void {
        this._browse(this.initialAction);
    }

    render() {
        if (this._state == PoLRYTubeState.INITAL) {
            return html``;
        }

        if (this._state == PoLRYTubeState.NO_RESULTS) {
            return html`
                ${this._renderBackButton()}
                <div class="no-results">No songs found.</div>
            `;
        }

        if (this._state == PoLRYTubeState.LOADING) {
            return html`
                ${this._renderBackButton()}
                <div class="loading">Loading...</div>
            `;
        }

        if (this._state == PoLRYTubeState.ERROR) {
            return html`
                ${this._renderBackButton()}
                <div class="error">An error occurred.</div>
            `;
        }

        return html`
            ${this._renderBackButton()}
            <polr-ytube-list
                .hass=${this.hass}
                .elements=${this.elements}
                .entity=${this.entity}
                @navigate=${this._handleBrowse}></polr-ytube-list>
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

    private async _handleBrowse(event) {
        const element = event.detail.action;
        this._browse(element);
    }

    async _browse(element: PoLRYTubeItem) {
        this._state = PoLRYTubeState.LOADING;
        this._browseHistory.push(element);

        try {
            const response = await this.hass.callWS({
                type: "media_player/browse_media",
                entity_id: this.entity["entity_id"],
                media_content_type: element.media_content_type,
                media_content_id: element.media_content_id,
            });

            this.elements = response["children"];
            this._state = PoLRYTubeState.HAS_RESULTS;
        } catch (e) {
            this._state = PoLRYTubeState.ERROR;
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
