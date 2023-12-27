import { LitElement, html, css, CSSResultGroup, PropertyValues } from "lit";
import { property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map";
import "./elements/polr-ytube-search";
import "./elements/polr-ytube-page-tabs";
import "./elements/polr-ytube-list";
import "./elements/polr-ytube-browser";
import { PoLRYTubeItem } from "./utils/polr-ytube-item";

export const enum PoLRCurrentState {
    INITAL = 1,
    LOADING = 2,
    HAS_RESULTS = 4,
    NO_RESULTS = 8,
    ERROR = 16,
}
export const enum PoLRYTubeTab {
    CURRENTLY_PLAYING = 1,
    FOR_YOU = 2,
    SEARCH = 4,
    YOURS = 8,
}

export class PoLRYTubePlayingCard extends LitElement {
    @property() _config: any = {};
    @property() _hass: any;
    @property() _entity: any;
    @state() _currentlyPlayingItems: any = [];
    @property() _currentlyPlayingState: PoLRCurrentState =
        PoLRCurrentState.INITAL;
    @property() _page: PoLRYTubeTab = PoLRYTubeTab.CURRENTLY_PLAYING;

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
            current?.attributes?.media_title !=
                updated?.attributes?.media_title ||
            current?.attributes?.likeStatus != updated?.attributes?.likeStatus
        );
    }

    _renderTab() {
        if (this._page == PoLRYTubeTab.FOR_YOU) {
            const item = new PoLRYTubeItem();
            item.media_content_id = "";
            item.media_content_type = "mood_overview";
            item.title = "For You";

            return html`
                <polr-ytube-browser
                    .hass=${this._hass}
                    .entity=${this._entity}
                    .initialAction=${item}></polr-ytube-browser>
            `;
        }
        if (this._page == PoLRYTubeTab.YOURS) {
            const item = new PoLRYTubeItem();
            item.title = "Yours";

            return html`
                <polr-ytube-browser
                    .hass=${this._hass}
                    .entity=${this._entity}
                    .initialAction=${item}></polr-ytube-browser>
            `;
        }

        if (this._page == PoLRYTubeTab.SEARCH) {
            return html`
                <polr-ytube-search
                    ._hass=${this._hass}
                    ._config=${{
                        entity_id: this._config["entity_id"],
                    }}></polr-ytube-search>
            `;
        }

        if (this._page == PoLRYTubeTab.CURRENTLY_PLAYING) {
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

    _renderLikeButton() {
        if (this._entity?.state == "off") return html``;
        if (!("likeStatus" in this._entity["attributes"])) return html``;

        if (this._entity?.attributes?.likeStatus == "LIKE") {
            return html`
                <mwc-button @click=${() => this._likeSong("thumb_middle")}>
                    <ha-icon icon="mdi:thumb-up"></ha-icon>
                </mwc-button>
            `;
        } else {
            return html`
                <mwc-button @click=${() => this._likeSong("thumb_up")}>
                    <ha-icon icon="mdi:thumb-up-outline"></ha-icon>
                </mwc-button>
            `;
        }
    }

    _renderIcon() {
        if (this._entity?.attributes?.entity_picture_local != null)
            return html`<img
                src="${this._entity.attributes.entity_picture_local}" /> `;

        if (this._entity?.attributes?.entity_picture != null)
            return html`<img
                src="${this._entity.attributes.entity_picture}" /> `;

        return html`<ha-icon icon="${this._config.icon}"></ha-icon> `;
    }

    render() {
        return html`
            <ha-card>
                <div class="header">
                    <div class="icon-container">${this._renderIcon()}</div>
                    <div class="info-container">
                        <div class="primary">${this._config.header}</div>
                        ${this._renderSecondary()}
                    </div>
                    <div class="action-container">
                        ${this._renderLikeButton()}
                    </div>
                </div>
                <div class="content">
                    ${this._renderSourceSelctor()}
                    <polr-ytube-page-tabs
                        @tabChange=${(ev) =>
                            this._changeTab(
                                ev.detail.tab
                            )}></polr-ytube-page-tabs>
                    <div class="results">${this._renderTab()}</div>
                </div>
            </ha-card>
        `;
    }

    _renderSecondary() {
        // TODO: Implement a title
        if (this._entity?.state == "off") return html``;

        const items = [];
        if (
            "media_title" in this._entity?.attributes &&
            this._entity.attributes.media_title != ""
        )
            items.push(this._entity.attributes.media_title);

        if (
            "media_artist" in this._entity?.attributes &&
            this._entity.attributes.media_artist != ""
        )
            items.push(this._entity.attributes.media_artist);

        return html` <div class="secondary">${items.join(" - ")}</div> `;
    }

    async _changeTab(page: PoLRYTubeTab) {
        this._page = page;

        switch (page) {
            case PoLRYTubeTab.CURRENTLY_PLAYING:
                this._getCurrentlyPlayingItems();
                break;
        }
    }

    async _getCurrentlyPlayingItems() {
        //console.debug("_getCurrentlyPlaying called");

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

    async _likeSong(rating) {
        console.log(rating);
        await this._hass.callService("ytube_music_player", "rate_track", {
            entity_id: this._config.entity_id,
            rating: rating,
        });
        this.requestUpdate();
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

    static get styles(): CSSResultGroup {
        return [
            css`
                :host {
                }

                ha-card {
                    overflow: hidden;
                }

                .header {
                    display: grid;
                    padding: 12px 12px 0 12px;
                    grid-template-columns: 40px auto 70px;
                    gap: 12px;
                    align-items: center;
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
                .icon-container > img {
                    width: 40px;
                    height: 40px;
                    border-radius: 5%;
                }

                .info-container {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }

                .action-container {
                }

                .primary {
                    font-weight: bold;
                }

                .secondary {
                    font-size: 12px;
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
            `,
        ];
    }
}

customElements.define("polr-ytube-playing-card", PoLRYTubePlayingCard);

(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
    type: "polr-ytube-playing-card",
    name: "PoLR YouTube Playing",
    description: "Requires the ytube_media_player integration",
});
