import { LitElement, html, css, CSSResultGroup } from "lit";
import { property, state } from "lit/decorators.js";
import "../elements/polr-ytube-search";

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

export class PoLRYTubeSearchCard extends LitElement {
    @property() _config: any = {};
    @property() _hass: any;
    @property() _runOnce: boolean = false;
    @state() _response: any = {};
    @state() _action: PoLRMediaSearchAction = PoLRMediaSearchAction.SEARCH;
    @property() _resultsState = PoLRMediaSearchState.CLEAR;

    static getConfigElement() {
        // return document.createElement("polr-ytube-search-card-editor");
    }

    static getStubConfig() {
        return {};
    }

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
        if (!this._runOnce) {
            this._hass = hass;
            this._runOnce = true;
        }
    }

    _renderResponse() {
        if (this._resultsState == PoLRMediaSearchState.CLEAR) return html``;

        if (this._resultsState == PoLRMediaSearchState.HAS_RESULTS) {
            const elements = this._response["children"]
                ?.filter(
                    (result) => true //result["can_play"] && !result["can_expand"]
                )
                .map((str) => {
                    return html`
                        <div class="result">
                            <img src="${str["thumbnail"]}" />
                            <div class="title">${str["title"]}</div>
                            <mwc-button
                                @click=${() =>
                                    this._play(
                                        str["media_content_type"],
                                        str["media_content_id"]
                                    )}>
                                Play
                            </mwc-button>
                            <mwc-button
                                @click=${() =>
                                    this._startRadio(str["media_content_id"])}>
                                Radio
                            </mwc-button>
                        </div>
                    `;
                });
            return elements;
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
        const header = this._config["showHeader"]
            ? html`
                  <div class="header">
                      <div class="icon-container">
                          <ha-icon icon="${this._config.icon}"></ha-icon>
                      </div>
                      <div class="info-container">
                          <div class="primary">${this._config.header}</div>
                      </div>
                  </div>
              `
            : html``;

        return html`
            <ha-card>
                ${header}
                <div class="content">
                    <polr-ytube-search
                        ._hass=${this._hass}
                        ._config=${{
                            entity_id: this._config["entity_id"],
                        }}></polr-ytube-search>
                </div>
            </ha-card>
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

        const filter = (this.shadowRoot.querySelector("#filter") as any).value;
        await this._hass.callService("ytube_music_player", "search", {
            entity_id: this._config.entity_id,
            query: (this.shadowRoot.querySelector("#query") as any).value,
            filter: filter,
            limit: 50,
        });

        this._fetchResults();
    }

    private _clear() {
        (this.shadowRoot.querySelector("#query") as any).value = "";
        this._response = [];
        this._action = PoLRMediaSearchAction.SEARCH;
    }

    async _play(media_content_type, media_content_id) {
        this._hass.callService("media_player", "play_media", {
            entity_id: this._config.entity_id,
            media_content_id: media_content_id,
            media_content_type: media_content_type,
        });
    }

    async _startRadio(media_content_id) {
        // await this._hass.callService("ytube_music_player", "start_radio", {
        //     entity_id: this._config.entity_id,
        //     interrupt: false,
        // });
        this._hass.callService("media_player", "shuffle_set", {
            entity_id: this._config.entity_id,
            shuffle: false,
        });
        this._hass.callService("media_player", "play_media", {
            entity_id: this._config.entity_id,
            media_content_id: media_content_id,
            media_content_type: "vid_channel",
        });
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
            grid-template-columns: min-content 1fr min-content;
            align-items: center;
            gap: 4px;
        }

        .search > mwc-button {
        }

        .results {
            max-height: 400px;
            overflow: scroll;
        }

        .result {
            padding: 12px 0;
            display: grid;
            grid-template-columns: 40px 1fr min-content min-content;
            align-items: center;
            font-size: 12px;
            gap: 8px;
        }

        .result img {
            width: 40px;
            height: 40px;
        }

        .loading {
            height: 50px;
            text-align: center;
            display: grid;
            align-items: center;
            padding: 12px 0;
        }

        .header {
            display: grid;
            height: 40px;
            padding: 12px 12px 0 12px;
            grid-template-columns: min-content auto 40px;
            gap: 4px;
        }

        .icon-container {
            display: flex;
            height: 40px;
            width: 40px;
            border-radius: 50%;
            background: rgba(111, 111, 111, 0.2);
            place-content: center;
            align-items: center;
            margin-right: 12px;
        }

        .info-container {
            display: flex;
            flex-direction: column;
            justify-content: center;
        }

        .primary {
            font-weight: bold;
        }

        .action-container {
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
        }

        .content {
            padding: 12px 12px 12px 12px;
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

customElements.define("polr-ytube-search-card", PoLRYTubeSearchCard);

// This puts your card into the UI card picker dialog
(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
    type: "polr-ytube-search-card",
    name: "PoLR YouTube Search",
    description: "Requires the ytube_media_player integration",
});
