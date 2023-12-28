import { LitElement, html, css, CSSResultGroup, PropertyValueMap } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import "../elements/polr-ytube-list";
import "@material/mwc-textfield";
import "@material/mwc-select";

export const enum PoLRMediaSearchState {
    CLEAR = 1,
    HAS_RESULTS = 2,
    LOADING = 4,
    NO_RESULTS = 8,
    ERROR = 16,
}

export const enum PoLRMediaSearchAction {
    SEARCH = 1,
    CLEAR = 2,
}

@customElement("polr-ytube-search")
export class PoLRYTubeSearch extends LitElement {
    @property() public _config: any = {};
    @property() public _hass: any;
    @state() private _response: any = {};
    @state() private _action: PoLRMediaSearchAction =
        PoLRMediaSearchAction.SEARCH;
    @property() private _resultsState = PoLRMediaSearchState.CLEAR;
    @state() private _filter: any;

    setConfig(config: any) {
        if (!config.entity_id) {
            throw new Error("entity_id must be specified");
        }

        this._config = structuredClone(config);
        if (!("header" in this._config)) this._config.header = "YouTube Search";
        if (!("showHeader" in this._config)) this._config.showHeader = false;
        if (!("searchTitle" in this._config))
            this._config.searchTitle = "Search";
    }

    set hass(hass) {
        this._hass = hass;
    }

    protected firstUpdated(_changedProperties): void {
        this._filter = this.renderRoot.querySelector("#filter");
    }

    _renderResponse() {
        if (this._resultsState == PoLRMediaSearchState.CLEAR) return html``;

        if (this._resultsState == PoLRMediaSearchState.HAS_RESULTS) {
            const elements = this._response["children"];
            return html`
                <polr-ytube-list
                    .hass=${this._hass}
                    .entity=${this._hass["states"][this._config.entity_id]}
                    .elements="${elements}"></polr-ytube-list>
            `;
        }

        if (this._resultsState == PoLRMediaSearchState.LOADING) {
            return html`<div class="loading">Loading...</div>`;
        }

        if (this._resultsState == PoLRMediaSearchState.NO_RESULTS) {
            return html`<div class="empty">No results</div>`;
        }

        if (this._resultsState == PoLRMediaSearchState.ERROR) {
            return html`<div class="error">Unknown Error</div>`;
        }
    }

    _renderAction() {
        if (this._action == PoLRMediaSearchAction.SEARCH)
            return html` <mwc-button @click=${this._search}
                ><ha-icon icon="mdi:magnify"></ha-icon
            ></mwc-button>`;
        if (this._action == PoLRMediaSearchAction.CLEAR)
            return html`
                <mwc-button @click=${this._clear}
                    ><ha-icon icon="mdi:close"></ha-icon
                ></mwc-button>
            `;
    }

    render() {
        const elements = this._response["children"];

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
                <div class="results">${this._renderResponse()}</div>
            </div>
        `;
    }

    async _fetchResults() {
        try {
            this._response = await this._hass.callWS({
                type: "media_player/browse_media",
                entity_id: this._config.entity_id,
                media_content_type: "search",
                media_content_id: "",
            });

            if (this._response["children"]?.length > 0) {
                // TODO: Move to ytube_music_player component,
                //       instead of handling in frontend
                // Filter out community playlists of podcast
                this._response["children"].filter(
                    (el) => !el["media_content_id"].startsWith("MPSP")
                );
                this._resultsState = PoLRMediaSearchState.HAS_RESULTS;
            } else this._resultsState = PoLRMediaSearchState.NO_RESULTS;
        } catch (e) {
            this._resultsState = PoLRMediaSearchState.ERROR;
            console.error(e, this._resultsState);
        }
    }

    handleKey(ev) {
        const value = (this.shadowRoot.querySelector("#query") as any).value;
        if (value == "") this._clear();

        if (ev.keyCode == 13) this._search();
    }

    async _search() {
        this._response = {};
        this._resultsState = PoLRMediaSearchState.LOADING;
        this._action = PoLRMediaSearchAction.CLEAR;

        const data =
            this._filter.selected.value == "all"
                ? {
                      entity_id: this._config.entity_id,
                      query: (this.shadowRoot.querySelector("#query") as any)
                          .value,
                      limit: 50,
                  }
                : {
                      entity_id: this._config.entity_id,
                      query: (this.shadowRoot.querySelector("#query") as any)
                          .value,
                      filter: this._filter.selected.value,
                      limit: 50,
                  };

        await this._hass.callService("ytube_music_player", "search", data);

        this._fetchResults();
    }

    private _clear() {
        (this.shadowRoot.querySelector("#query") as any).value = "";
        this._response = [];
        this._action = PoLRMediaSearchAction.SEARCH;
    }

    static styles = css`
        :host {
            --mdc-typography-subtitle1-font-size: 12px;
        }

        ha-card {
            overflow: hidden;
        }

        .search {
            display: grid;
            grid-template-columns: 1fr min-content min-content;
            align-items: center;
            gap: 4px;
        }

        .loading {
            height: 50px;
            text-align: center;
            display: grid;
            align-items: center;
            padding: 12px 0;
        }

        .content {
            padding: 0 12px;
        }

        select {
            appearance: none;
            display: grid;
            border: none;
            padding: 10px;
            outline: none;
            border: 1px solid rgba(40, 40, 40, 0.3);
            border-radius: 0.25em;
            cursor: pointer;
        }
        .filter {
            margin: 4px;
        }
        ha-select {
            width: 100px;
        }
    `;
}
