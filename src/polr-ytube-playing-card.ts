import { LitElement, html, css, CSSResultGroup, PropertyValues } from "lit";
import { property, state } from "lit/decorators.js";
import "./elements/polr-ytube-search";
import "./elements/polr-ytube-page-tabs";
import "./elements/polr-ytube-list";
import { PoLRYTubeItem } from "./utils/polr-ytube-item";

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

export class PoLRYTubePlayingCard extends LitElement {
    @property() _config: any = {};
    @property() _hass: any;
    @property() _entity: any;
    @state() _currentlyPlayingItems: any = [];
    @property() _forYouItems: PoLRYTubeItem[] = [];
    @state() _browseHistory: PoLRYTubeItem[] = [];
    @property() _currentlyPlayingState: PoLRCurrentState =
        PoLRCurrentState.INITAL;
    @property() _forYouState: PoLRCurrentState = PoLRCurrentState.INITAL;
    @property() _page: PoLRYTubePage = PoLRYTubePage.CURRENTLY_PLAYING;

    static getConfigElement() {}

    static getStubConfig() {
        return {};
    }

    setConfig(config: any) {
        if (!config.entity_id) {
            throw new Error("entity_id must be specified");
        }

        this._config = structuredClone(config);
        if (!("header" in this._config)) this._config.header = "YouTube Music";
        if (!("searchTitle" in this._config))
            this._config.searchTitle = "Search";
        if (!("icon" in this._config)) this._config.searchTitle = "mdi:speaker";
    }

    set hass(hass) {
        this._hass = hass;

        if (
            this._hasEntityChanged(
                this._entity,
                this._hass["states"][this._config["entity_id"]]
            )
        ) {
            this._entity = structuredClone(
                this._hass["states"][this._config["entity_id"]]
            );

            if (this._entity["state"] == "off") {
                this._currentlyPlayingState = PoLRCurrentState.INITAL;
            } else {
                this._getCurrentlyPlayingItems();
            }
        }
    }

    shouldUpdate(changedProperties: Map<string, any>) {
        const _hass = changedProperties.get("_hass");
        if (_hass != null) {
            return this._hasEntityChanged(
                this._entity,
                _hass["states"][this._config["entity_id"]]
            );
        }
        return true;
    }

    private _hasEntityChanged(current, updated) {
        // console.log({
        //     current: current?.attributes?.media_title,
        //     updated: updated?.attributes?.media_title,
        // });
        return (
            current?.attributes?.media_title != updated?.attributes?.media_title
        );
    }

    private _renderBackButton() {
        if (this._browseHistory.length <= 1) return html``;

        const breadcrumb = this._browseHistory
            .map((item) => `${item.title}`)
            .join(" > ");

        return html`
            <div class="back-button">
                <mwc-button
                    @click=${() =>
                        this._browse(
                            this._browseHistory.pop() &&
                                this._browseHistory.pop()
                        )}
                    >back</mwc-button
                >
                <div class="breadcrumb">${breadcrumb}</div>
            </div>
        `;
    }

    _renderItems() {
        if (this._page == PoLRYTubePage.FOR_YOU) {
            if (this._forYouState == PoLRCurrentState.INITAL) {
                return html``;
            }

            if (this._forYouState == PoLRCurrentState.NO_RESULTS) {
                return html`
                    ${this._renderBackButton()}
                    <div class="no-results">No songs found.</div>
                `;
            }

            if (this._forYouState == PoLRCurrentState.LOADING) {
                return html`
                    ${this._renderBackButton()}
                    <div class="loading">Loading...</div>
                `;
            }

            if (this._forYouState == PoLRCurrentState.ERROR) {
                return html`
                    ${this._renderBackButton()}
                    <div class="error">An error occurred.</div>
                `;
            }
            return html`
                ${this._renderBackButton()}
                <polr-ytube-list
                    .hass=${this._hass}
                    .elements=${this._forYouItems}
                    .entity=${this._entity}
                    @navigate=${this._handleBrowse}></polr-ytube-list>
            `;
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

        if (this._page == PoLRYTubePage.CURRENTLY_PLAYING) {
            if (this._currentlyPlayingState == PoLRCurrentState.INITAL) {
                return html``;
            }

            if (this._currentlyPlayingState == PoLRCurrentState.NO_RESULTS) {
                return html` <div class="no-results">No songs found.</div>`;
            }

            if (this._currentlyPlayingState == PoLRCurrentState.ERROR) {
                return html` <div class="error">An error occurred.</div>`;
            }

            return html`
                <polr-ytube-list
                    .hass=${this._hass}
                    .elements=${this._currentlyPlayingItems}
                    .entity=${this._entity}></polr-ytube-list>
            `;
        }
    }

    _renderSourceSelctor() {
        const media_players = [];

        for (const [key, value] of Object.entries(this._hass["states"])) {
            if (key.startsWith("media_player")) {
                // Skip ytube_media_player entities
                if ("remote_player_id" in value["attributes"]) continue;

                media_players.push([key, value["attributes"]["friendly_name"]]);
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
                    ${media_players.map((item) =>
                        item[0] ==
                        this._entity["attributes"]["remote_player_id"]
                            ? html`<ha-list-item selected value=${item[0]}>
                                  ${item[1]}
                              </ha-list-item> `
                            : html`<ha-list-item value=${item[0]}
                                  >${item[1]}</ha-list-item
                              > `
                    )}
                </ha-control-select-menu>
            </div>
        `;
    }

    render() {
        return html`
            <ha-card>
                <div class="header">
                    <div class="icon-container">
                        <ha-icon icon="${this._config.icon}"></ha-icon>
                    </div>
                    <div class="info-container">
                        <div class="primary">${this._config.header}</div>
                    </div>
                </div>
                <div class="content">
                    ${this._renderSourceSelctor()}
                    <polr-ytube-page-tabs
                        @tabChange=${(ev) =>
                            this._changeTab(
                                ev.detail.tab
                            )}></polr-ytube-page-tabs>
                    <div class="results">${this._renderItems()}</div>
                </div>
            </ha-card>
        `;
    }

    async _changeTab(page: PoLRYTubePage) {
        this._page = page;

        switch (page) {
            case PoLRYTubePage.CURRENTLY_PLAYING:
                this._getCurrentlyPlayingItems();
                break;

            case PoLRYTubePage.FOR_YOU:
                if (this._forYouItems.length == 0) {
                    const item = new PoLRYTubeItem();
                    item.media_content_id = "";
                    item.media_content_type = "mood_overview";
                    item.title = "For you";
                    this._browse(item);
                }
                this._page = PoLRYTubePage.FOR_YOU;
                break;

            case PoLRYTubePage.SEARCH:
                this._page = PoLRYTubePage.SEARCH;
                break;
        }
    }

    async _getCurrentlyPlayingItems() {
        console.debug("_getCurrentlyPlaying called");

        if (["off", "unavailable"].includes(this._entity["state"])) {
            this._currentlyPlayingItems = [];
            return;
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
                this._currentlyPlayingItems = response["children"];
            }

            if (["album"].includes(media_type)) {
                const response = await this._hass.callWS({
                    type: "media_player/browse_media",
                    entity_id: this._config.entity_id,
                    media_content_type: "album_of_track",
                    media_content_id: "1",
                });
                this._currentlyPlayingItems = response["children"];
            }

            if (this._currentlyPlayingItems.length == 0)
                this._currentlyPlayingState = PoLRCurrentState.NO_RESULTS;

            if (this._currentlyPlayingItems.length > 0)
                this._currentlyPlayingState = PoLRCurrentState.HAS_RESULTS;
        } catch (e) {
            console.error(e);
            this._currentlyPlayingState = PoLRCurrentState.ERROR;
        }
    }

    private async _handleBrowse(event) {
        const element = event.detail.action;
        this._browse(element);
    }

    async _browse(element: PoLRYTubeItem) {
        this._browseHistory.push(element);
        this._forYouState = PoLRCurrentState.LOADING;

        try {
            const response = await this._hass.callWS({
                type: "media_player/browse_media",
                entity_id: this._config.entity_id,
                media_content_type: element.media_content_type,
                media_content_id: element.media_content_id,
            });

            this._forYouItems = response["children"];
            this._forYouState = PoLRCurrentState.HAS_RESULTS;
        } catch (e) {
            this._forYouState = PoLRCurrentState.ERROR;
            console.error(
                e,
                element.media_content_type,
                element.media_content_id
            );
        }
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
        }

        ha-card {
            overflow: hidden;
        }

        .header {
            display: grid;
            padding: 12px 12px 0 12px;
            grid-template-columns: 40px auto;
            gap: 12px;
        }
        .icon-container {
            display: flex;
            height: 40px;
            width: 40px;
            border-radius: 50%;
            background: rgba(111, 111, 111, 0.2);
            place-content: center;
            align-items: center;
        }

        .info-container {
            display: flex;
            flex-direction: column;
            justify-content: center;
        }

        .primary {
            font-weight: bold;
        }

        .content {
            padding: 24px 12px;
            display: grid;
            gap: 12px;
        }

        .source {
            display: grid;
            align-items: center;
            border-top: 2px rgba(111, 111, 111, 0.2) solid;
            border-bottom: 2px rgba(111, 111, 111, 0.2) solid;
            padding: 12px 0;
        }

        polr-ytube-page-tabs {
            padding: 12px;
        }
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
    `;
}

customElements.define("polr-ytube-playing-card", PoLRYTubePlayingCard);

(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
    type: "polr-ytube-playing-card",
    name: "PoLR YouTube Playing",
    description: "Requires the ytube_media_player integration",
});
