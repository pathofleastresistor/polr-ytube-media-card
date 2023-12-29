import { LitElement, html, css, CSSResultGroup, PropertyValueMap } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { PoLRYTubeListState } from "../utils/utils";
import "../elements/polr-ytube-list";
import "@material/mwc-textfield";
import "@material/mwc-select";

@customElement("polr-ytube-search")
export class PoLRYTubeSearch extends LitElement {
    @property() public _hass: any;
    @state() public _entity: any;
    @state() private _results: any = {};
    @property() private _resultsState = PoLRYTubeListState.CLEAR;

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

    render() {
        return html`
            <div class="content">
                <div class="search">
                    <mwc-textfield
                        label="Search "
                        type="search"
                        id="query"
                        outlined
                        @keyup="${this.handleKey}">
                    </mwc-textfield>
                    <mwc-select
                        id="filter"
                        label="Filter"
                        fixedMenuPosition
                        naturalMenuWidth>
                        <mwc-list-item value="all"> All </mwc-list-item>
                        <mwc-list-item value="artists"> Artists </mwc-list-item>
                        <mwc-list-item selected value="songs">
                            Songs
                        </mwc-list-item>
                        <mwc-list-item selected value="playlists">
                            Playlists
                        </mwc-list-item>
                    </mwc-select>
                </div>
                <div class="results">${this._renderResults()}</div>
            </div>
        `;
    }

    async _fetchResults() {
        try {
            this._results = await this._hass.callWS({
                type: "media_player/browse_media",
                entity_id: this._entity?.entity_id,
                media_content_type: "search",
                media_content_id: "",
            });

            if (this._results["children"]?.length > 0) {
                // TODO: Move to ytube_music_player component,
                //       instead of handling in frontend
                // Filter out community playlists of podcast
                this._results["children"].filter(
                    (el) => !el["media_content_id"].startsWith("MPSP")
                );
                this._resultsState = PoLRYTubeListState.HAS_RESULTS;
            } else this._resultsState = PoLRYTubeListState.NO_RESULTS;
        } catch (e) {
            this._resultsState = PoLRYTubeListState.ERROR;
            console.error(e, this._resultsState);
        }
    }

    handleKey(ev) {
        if (ev.keyCode == 13) this._search();
    }

    async _search() {
        this._resultsState = PoLRYTubeListState.LOADING;
        const query = (this.shadowRoot.querySelector("#query") as any).value;
        const filter = (this.renderRoot.querySelector("#filter") as any)
            .selected.value;

        let data;
        if (filter == "all") {
            data = {
                entity_id: this._entity?.entity_id,
                query: query,
                limit: 50,
            };
        } else {
            data = {
                entity_id: this._entity?.entity_id,
                query: query,
                filter: filter,
                limit: 50,
            };
        }

        await this._hass.callService("ytube_music_player", "search", data);
        this._fetchResults();
    }

    static styles = css`
        .search {
            display: grid;
            grid-template-columns: 1fr min-content min-content;
            align-items: center;
            gap: 4px;
        }

        .empty,
        .error,
        .loading {
            height: 50px;
            text-align: center;
            display: grid;
            align-items: center;
            padding: 12px 0;
        }
    `;
}
