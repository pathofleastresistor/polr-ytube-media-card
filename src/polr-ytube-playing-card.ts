import { LitElement, html, css, CSSResultGroup } from "lit";
import { property, state } from "lit/decorators.js";

export class PoLRYTubePlayingCard extends LitElement {
    @property() _config: any = {};
    @property() _hass: any;
    @property() _runOnce: boolean = false;
    @property() _response: any = [];
    @state() _entity: any;

    static getConfigElement() {
        // return document.createElement("polr-ytube-playing-card-editor");
    }

    static getStubConfig() {
        return {};
    }

    setConfig(config: any) {
        if (!config.entity_id) {
            throw new Error("entity_id must be specified");
        }

        this._config = structuredClone(config);
        if (!("header" in this._config))
            this._config.header = "Current Playlist";
        if (!("showHeader" in this._config)) this._config.showHeader = false;
        if (!("searchTitle" in this._config))
            this._config.searchTitle = "Search";
    }

    set hass(hass) {
        this._hass = hass;
        this._entity = structuredClone(
            this._hass["states"][this._config["entity_id"]]
        );
        this._fetchResults();
        if (!this._runOnce) {
            this._runOnce = true;
        }
    }

    async _fetchResults() {
        if (["off", "unavailable"].includes(this._entity["state"])) {
            return [];
        }

        const media_type = this._entity["attributes"]["_media_type"];
        try {
            if (["vid_channel", "playlist", "track"].includes(media_type)) {
                const response = await this._hass.callWS({
                    type: "media_player/browse_media",
                    entity_id: this._config.entity_id,
                    media_content_type: "cur_playlists",
                    media_content_id: "",
                });
                this._response = response["children"];
            }
            //album_of_track

            if (["album"].includes(media_type)) {
                const response = await this._hass.callWS({
                    type: "media_player/browse_media",
                    entity_id: this._config.entity_id,
                    media_content_type: "album_of_track",
                    media_content_id: "1",
                });
                this._response = response["children"];
            }
        } catch (e) {
            console.error(e);
        }
    }

    _renderResponse() {
        if (this._response.length == 0) {
            return html` <div class="empty">No playlist</div>`;
        }

        const elements = this._response.map((str) => {
            return html`
                <div
                    class="result ${parseInt(str["media_content_id"]) - 1 ==
                    this._entity["attributes"]["current_track"]
                        ? "current_track"
                        : ""}">
                    <div class="title">${str["title"]}</div>
                    ${this._renderRadio(
                        str["media_content_id"] - 1,
                        this._entity["attributes"]["current_track"],
                        str["media_content_type"],
                        str["media_content_id"]
                    )}
                    <mwc-button
                        @click=${() =>
                            str["media_content_type"] == "track"
                                ? this._playTrack(
                                      str["media_content_type"],
                                      str["media_content_id"]
                                  )
                                : this._play(
                                      str["media_content_type"],
                                      str["media_content_id"]
                                  )}>
                        Play
                    </mwc-button>
                </div>
            `;
        });
        return elements;
    }

    _renderRadio(cur_item, active_item, media_content_type, media_content_id) {
        if (cur_item != active_item && media_content_type != "track")
            return html``;

        const id =
            media_content_type == "track"
                ? media_content_id
                : this._entity["attributes"]["videoId"];
        return html`
            <mwc-button @click=${() => this._startRadio(id)}>
                Radio
            </mwc-button>
        `;
    }

    _renderSource() {
        const media_players = [];
        for (const [key, value] of Object.entries(this._hass["states"])) {
            if (key.startsWith("media_player")) {
                if (!("remote_player_id" in value["attributes"]))
                    media_players.push([
                        key,
                        value["attributes"]["friendly_name"],
                    ]);
            }
        }
        media_players.sort(function (a, b) {
            if (a[1] < b[1]) {
                return -1;
            }
            if (a[1] > b[1]) {
                return 1;
            }
            return 0;
        });

        return html`
            <div class="source">
                <div>Source:</div>
                <ha-select
                    id="source"
                    naturalmenuwidth
                    fixedmenuposition
                    @selected=${this._selectSource}>
                    ${media_players.map((str) =>
                        str[0] == this._entity["attributes"]["remote_player_id"]
                            ? html`<mwc-list-item selected value=${str[0]}>
                                  ${str[1]}
                              </mwc-list-item> `
                            : html`<mwc-list-item value=${str[0]}
                                  >${str[1]}</mwc-list-item
                              > `
                    )}
                </ha-select>
            </div>
        `;
        // return html`
        //     <div class="source">
        //         <select id="source" @change=${this._selectSource}>
        //             ${media_players.map((str) =>
        //                 str[0] == this._entity["attributes"]["remote_player_id"]
        //                     ? html`<option selected value=${str[0]}>
        //                           ${str[1]}
        //                       </option> `
        //                     : html`<option value=${str[0]}>${str[1]}</option> `
        //             )}
        //         </select>
        //     </div>
        // `;
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
                    ${this._renderSource()}
                    <div class="results">${this._renderResponse()}</div>
                </div>
            </ha-card>
        `;
    }

    async _play(media_content_type, media_content_id) {
        this._hass.callService("ytube_music_player", "call_method", {
            entity_id: this._config.entity_id,
            command: "goto_track",
            parameters: media_content_id,
        });
    }
    async _playTrack(media_content_type, media_content_id) {
        this._hass.callService("media_player", "play_media", {
            entity_id: this._config.entity_id,
            media_content_id: media_content_id,
            media_content_type: media_content_type,
        });
    }

    async _startRadio(media_content_id) {
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

    async _selectSource(ev) {
        const selectedSource = (this.shadowRoot.querySelector("#source") as any)
            .value;
        const currentSource = this._entity["attributes"]["remote_player_id"];

        if (selectedSource == "") return;
        if (selectedSource == currentSource) return;

        this._hass.callService("media_player", "select_source", {
            entity_id: this._config.entity_id,
            source: (this.shadowRoot.querySelector("#source") as any).value,
        });
    }

    static styles = css`
        :host {
            --mdc-typography-subtitle1-font-size: 12px;
        }

        ha-card {
            overflow: hidden;
        }

        .results {
            max-height: 400px;
            overflow: scroll;
        }

        .result {
            padding: 12px;
            border-radius: 12px;
            display: grid;
            grid-template-columns: 1fr min-content auto;
            align-items: center;
        }

        .current_track {
            font-weight: bold;
            background-color: rgb(64 64 64 / 20%);
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

        .source {
            padding: 12px;
            display: grid;
            grid-template-columns: min-content 1fr;
            gap: 20px;
            align-items: center;
            border-top: 1px rgb(98 98 98 / 30%) solid;
            border-bottom: 1px rgb(98 98 98 / 30%) solid;
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
    `;
}

customElements.define("polr-ytube-playing-card", PoLRYTubePlayingCard);

// This puts your card into the UI card picker dialog
(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
    type: "polr-ytube-playing-card",
    name: "PoLR YouTube Playing",
    description: "Requires the ytube_media_player integration",
});
