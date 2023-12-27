import { LitElement, html, css, CSSResultGroup } from "lit";
import { property, state } from "lit/decorators.js";
import "./elements/polr-ytube-search";
import "./elements/polr-ytube-page-tabs";

export const enum PoLRCurrentState {
    INITAL = 1,
    LOADING = 2,
    HAS_RESULTS = 4,
    NO_RESULTS = 8,
    ERROR = 16,
}
export const enum PoLRYTubePage {
    CURRENTLY_PLAYING = 1,
    FOR_YOU = 2,
    SEARCH = 4,
}

export interface PoLRBrowseAction {
    media_content_id: string;
    media_content_type: string;
}

export class PoLRYTubePlayingCard extends LitElement {
    @property() _config: any = {};
    @state() _hass: any;
    @property() _runOnce: boolean = false;
    @property() _response: any = [];
    @state() _entity: any;
    @state() _cardState: PoLRCurrentState = PoLRCurrentState.INITAL;
    @state() _lastChanged: any;
    @property() _page: PoLRYTubePage = PoLRYTubePage.CURRENTLY_PLAYING;
    @property() _forYouResponse: any = [];
    @state() _lastBrowseAction: PoLRBrowseAction[] = [];

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

        if (this._entity["state"] == "off") {
            this._cardState = PoLRCurrentState.INITAL;
        }
        //console.log(this._entity);

        this._getCurrentlyPlaying();
        if (!this._runOnce) {
            this._runOnce = true;
        }
    }

    _renderItems() {
        if (this._page == PoLRYTubePage.FOR_YOU) {
            const elements = [];
            if (this._lastBrowseAction.length > 1) {
                elements.push(html`
                    <div>
                        <mwc-button
                            @click=${() =>
                                this._browseForYou(
                                    this._lastBrowseAction.pop() &&
                                        this._lastBrowseAction.pop()
                                )}
                            >back</mwc-button
                        >
                    </div>
                `);
            }

            elements.push(
                this._forYouResponse.map((str) => {
                    return html`
                        <div
                            class="result ${parseInt(str["media_content_id"]) -
                                1 ==
                            this._entity["attributes"]["current_track"]
                                ? "current_track"
                                : ""}">
                            <div class="title">${str["title"]}</div>
                            ${this._renderMoreButton(str)}
                            ${this._renderRadioButton(
                                str["media_content_id"] - 1,
                                this._entity["attributes"]["current_track"],
                                str["media_content_type"],
                                str["media_content_id"]
                            )}
                            ${this._renderPlayButton(str)}
                        </div>
                    `;
                })
            );
            return elements;
        }

        if (this._page == PoLRYTubePage.SEARCH) {
            return html`
                <polr-ytube-search
                    ._hass=${this._hass}
                    ._config=${{
                        entity_id: this._config["entity_id"],
                    }}></polr-ytube-search>
            `;
        }

        if (this._cardState == PoLRCurrentState.INITAL) {
            return html``;
        }

        if (this._cardState == PoLRCurrentState.NO_RESULTS) {
            return html` <div class="no-results">No songs found.</div>`;
        }

        if (this._cardState == PoLRCurrentState.ERROR) {
            return html` <div class="error">An error occurred.</div>`;
        }

        if (this._page == PoLRYTubePage.CURRENTLY_PLAYING) {
            const elements = this._response.map((str) => {
                return html`
                    <div
                        class="result ${parseInt(str["media_content_id"]) - 1 ==
                        this._entity["attributes"]["current_track"]
                            ? "current_track"
                            : ""}">
                        <div class="title">${str["title"]}</div>
                        ${this._renderMoreButton(str)}
                        ${this._renderRadioButton(
                            str["media_content_id"] - 1,
                            this._entity["attributes"]["current_track"],
                            str["media_content_type"],
                            str["media_content_id"]
                        )}
                        ${this._renderPlayButton(str)}
                    </div>
                `;
            });
            return elements;
        }
    }

    _renderPlayButton(str) {
        if (!str["can_play"]) return html``;
        return html`
            <mwc-button
                @click=${() =>
                    ["track", "playlist"].includes(str["media_content_type"])
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
        `;
    }

    _renderMoreButton(item) {
        if (!item["can_expand"]) return html``;
        return html`
            <mwc-button
                @click=${() =>
                    this._browseForYou({
                        media_content_type: item["media_content_type"],
                        media_content_id: item["media_content_id"],
                    })}>
                More
            </mwc-button>
        `;
    }

    _renderRadioButton(
        cur_item,
        active_item,
        media_content_type,
        media_content_id
    ) {
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

    _renderSourceSelctor() {
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
                <ha-control-select-menu
                    id="source"
                    show-arrow
                    hide-label
                    naturalmenuwidth
                    fixedmenuposition
                    @selected=${this._selectSource}>
                    <ha-svg-icon
                        slot="icon"
                        path="M12,12A3,3 0 0,0 9,15A3,3 0 0,0 12,18A3,3 0 0,0 15,15A3,3 0 0,0 12,12M12,20A5,5 0 0,1 7,15A5,5 0 0,1 12,10A5,5 0 0,1 17,15A5,5 0 0,1 12,20M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8C10.89,8 10,7.1 10,6C10,4.89 10.89,4 12,4M17,2H7C5.89,2 5,2.89 5,4V20A2,2 0 0,0 7,22H17A2,2 0 0,0 19,20V4C19,2.89 18.1,2 17,2Z"></ha-svg-icon>
                    ${media_players.map((str) =>
                        str[0] == this._entity["attributes"]["remote_player_id"]
                            ? html`<ha-list-item selected value=${str[0]}>
                                  ${str[1]}
                              </ha-list-item> `
                            : html`<ha-list-item value=${str[0]}
                                  >${str[1]}</ha-list-item
                              > `
                    )}
                </ha-control-select-menu>
            </div>
        `;
    }

    render() {
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
                    ${this._renderSourceSelctor()}
                    <polr-ytube-page-tabs
                        @tabChange=${(ev) =>
                            this._navigate(
                                ev.detail.tab
                            )}></polr-ytube-page-tabs>
                    <div class="results">${this._renderItems()}</div>
                </div>
            </ha-card>
        `;
    }

    async _navigate(page: PoLRYTubePage) {
        this._page = page;

        switch (page) {
            case PoLRYTubePage.CURRENTLY_PLAYING:
                this._getCurrentlyPlaying();
                break;
            case PoLRYTubePage.FOR_YOU:
                if (this._forYouResponse.length == 0) {
                    this._browseForYou({
                        media_content_type: "mood_overview",
                        media_content_id: "",
                    });
                }
                this._page = PoLRYTubePage.FOR_YOU;
                break;
            case PoLRYTubePage.SEARCH:
                this._page = PoLRYTubePage.SEARCH;
                break;
        }
    }

    async _getCurrentlyPlaying() {
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

            if (["album"].includes(media_type)) {
                const response = await this._hass.callWS({
                    type: "media_player/browse_media",
                    entity_id: this._config.entity_id,
                    media_content_type: "album_of_track",
                    media_content_id: "1",
                });
                this._response = response["children"];
            }

            if (this._response.length == 0)
                this._cardState = PoLRCurrentState.NO_RESULTS;

            if (this._response.length > 0)
                this._cardState = PoLRCurrentState.HAS_RESULTS;
        } catch (e) {
            console.error(e);
            this._cardState = PoLRCurrentState.ERROR;
        }
    }

    async _browseForYou(browseAction: PoLRBrowseAction) {
        this._lastBrowseAction.push({
            media_content_type: browseAction.media_content_type,
            media_content_id: browseAction.media_content_id,
        });

        try {
            const response = await this._hass.callWS({
                type: "media_player/browse_media",
                entity_id: this._config.entity_id,
                media_content_type: browseAction.media_content_type,
                media_content_id: browseAction.media_content_id,
            });

            this._forYouResponse = response["children"];
        } catch (e) {
            console.log(
                e,
                browseAction.media_content_type,
                browseAction.media_content_id
            );
        }
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

        // var res = await this._hass.callWS({
        //     type: "execute_script",
        //     sequence: [
        //         {
        //             service: "media_player.turn_on",
        //             target: {
        //                 entity_id: this._config.entity_id,
        //             },
        //         },
        //         {
        //             service: "media_player.select_source",
        //             target: {
        //                 entity_id: this._config.entity_id,
        //             },
        //             data: {
        //                 source: (
        //                     this.shadowRoot.querySelector("#source") as any
        //                 ).value,
        //             },
        //         },
        //         {
        //             stop: "done",
        //         },
        //     ],
        // });
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
            display: grid;
            gap: 12px;
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
        polr-ytube-page-tabs {
            padding: 12px;
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
