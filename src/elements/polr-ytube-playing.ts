import { LitElement, html, css, CSSResultGroup, PropertyValueMap } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import "../elements/polr-ytube-list";
import { PoLRYTubeListState } from "../utils/utils";

@customElement("polr-ytube-playing")
export class PoLRYTubePlaying extends LitElement {
    @state() public _hass: any;
    @state() public _entity: any;
    @state() private _results: any = {};
    @state() private _resultsState = PoLRYTubeListState.CLEAR;

    _renderResults() {
        if (this._resultsState == PoLRYTubeListState.CLEAR) return html``;

        if (this._resultsState == PoLRYTubeListState.HAS_RESULTS) {
            const elements = this._results["children"];
            return html`
                <polr-ytube-list
                    .hass=${this._hass}
                    .entity=${this._entity}
                    .elements="${elements}"></polr-ytube-list>
            `;
        }

        if (this._resultsState == PoLRYTubeListState.LOADING) {
            return html`<div class="loading">Loading...</div>`;
        }

        if (this._resultsState == PoLRYTubeListState.NO_RESULTS) {
            return html`<div class="empty">No results</div>`;
        }

        if (this._resultsState == PoLRYTubeListState.ERROR) {
            return html`<div class="error">Unknown Error</div>`;
        }
    }

    protected firstUpdated(_changedProperties): void {
        this._getCurrentlyPlayingItems();
    }

    render() {
        return html`
            <div class="content">
                <div class="results">${this._renderResults()}</div>
            </div>
        `;
    }

    async _getCurrentlyPlayingItems() {
        const media_type = this._entity["attributes"]["_media_type"];

        try {
            if (["vid_channel", "playlist", "track"].includes(media_type)) {
                this._results = await this._hass.callWS({
                    type: "media_player/browse_media",
                    entity_id: this._entity["entity_id"],
                    media_content_type: "cur_playlists",
                    media_content_id: "",
                });
            }

            if (["album"].includes(media_type)) {
                this._results = await this._hass.callWS({
                    type: "media_player/browse_media",
                    entity_id: this._entity["entity_id"],
                    media_content_type: "album_of_track",
                    media_content_id: "1",
                });
            }

            if (this._results["children"]?.length > 0) {
                this._resultsState = PoLRYTubeListState.HAS_RESULTS;
            } else this._resultsState = PoLRYTubeListState.NO_RESULTS;
            this.requestUpdate();
        } catch (e) {
            console.error(e);
            this._resultsState = PoLRYTubeListState.ERROR;
        }
    }

    public refresh() {
        this._getCurrentlyPlayingItems();
    }

    static styles = css`
        .loading {
            height: 50px;
            text-align: center;
            display: grid;
            align-items: center;
            padding: 12px 0;
        }
    `;
}
