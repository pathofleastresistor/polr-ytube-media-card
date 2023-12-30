import {
    LitElement,
    html,
    css,
    CSSResultGroup,
    PropertyValueMap,
    nothing,
} from "lit";
import { property, state } from "lit/decorators.js";
import "../shared/polr-tab";
import "../shared/polr-tab-bar";
import "../elements/polr-media-control";
import "../elements/polr-ytube-playing";
import "../elements/polr-ytube-search";
import "../elements/polr-ytube-browser";
import { PoLRYTubeItem, PoLRYTubeTab } from "../utils/utils";

export class PoLRYTubePlayingCard extends LitElement {
    @property() _config: any = {};
    @property() _hass: any;
    @property() _entity: any;
    @property() _activeTab: PoLRYTubeTab = PoLRYTubeTab.CURRENTLY_PLAYING;
    @state() _menuButton: any;
    @state() _menu: any;
    @state() _playing: any;
    @state() _search: any;
    @state() _forYou: any;
    @state() _mediaControl: any;

    static getConfigElement() {}

    static getStubConfig() {
        return {
            entity_id: "media_player.ytube_music_player",
            showHeader: "true",
            header: "YouTube Music",
        };
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
        const newEntity = this._hass["states"][this._config["entity_id"]];
        this._entity = structuredClone(newEntity);
        this._playing?.refresh();

        if (this._hasEntityChanged(this._entity, newEntity)) {
            if (this._entity["state"] == "off") {
                this._changeTab(PoLRYTubeTab.FOR_YOU);
            } else {
                //this._playing?.refresh(this._entity);
            }
        }
    }

    protected firstUpdated(
        _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
    ): void {
        // (async () => await loadHaForm())();
        this._menuButton = this.renderRoot.querySelector("#menuButton");
        this._menu = this.renderRoot.querySelector("#menu");
        this._playing = this.renderRoot.querySelector("#playing");
        this._mediaControl = this.renderRoot.querySelector("mediaControl");
    }

    private _hasEntityChanged(current, updated) {
        return (
            current?.state != updated?.state ||
            current?.attributes?.media_title !=
                updated?.attributes?.media_title ||
            current?.attributes?.likeStatus !=
                updated?.attributes?.likeStatus ||
            current?.attributes.media_content_id !=
                updated?.attributes.media_content_id
        );
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

    _renderLikeButton() {
        if (this._entity?.state == "off") return html``;
        if (!this._entity?.attributes?.likeStatus) return html``;

        if (this._entity?.attributes?.likeStatus == "LIKE") {
            return html`
                <mwc-icon-button @click=${() => this._likeSong("thumb_middle")}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <title>thumb-up</title>
                        <path
                            d="M23,10C23,8.89 22.1,8 21,8H14.68L15.64,3.43C15.66,3.33 15.67,3.22 15.67,3.11C15.67,2.7 15.5,2.32 15.23,2.05L14.17,1L7.59,7.58C7.22,7.95 7,8.45 7,9V19A2,2 0 0,0 9,21H18C18.83,21 19.54,20.5 19.84,19.78L22.86,12.73C22.95,12.5 23,12.26 23,12V10M1,21H5V9H1V21Z" />
                    </svg>
                </mwc-icon-button>
            `;
        } else {
            return html`
                <mwc-icon-button @click=${() => this._likeSong("thumb_up")}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <title>thumb-up-outline</title>
                        <path
                            d="M5,9V21H1V9H5M9,21A2,2 0 0,1 7,19V9C7,8.45 7.22,7.95 7.59,7.59L14.17,1L15.23,2.06C15.5,2.33 15.67,2.7 15.67,3.11L15.64,3.43L14.69,8H21C22.11,8 23,8.9 23,10V12C23,12.26 22.95,12.5 22.86,12.73L19.84,19.78C19.54,20.5 18.83,21 18,21H9M9,19H18.03L21,12V10H12.21L13.34,4.68L9,9.03V19Z" />
                    </svg>
                </mwc-icon-button>
            `;
        }
    }

    _renderSecondary() {
        // TODO: Implement a title
        if (this._entity?.state == "off") return html``;

        const items = [];
        if (
            this._entity?.attributes?.media_title &&
            this._entity.attributes.media_title != ""
        )
            items.push(this._entity.attributes.media_title);

        if (
            this._entity?.attributes?.media_artist &&
            this._entity.attributes.media_artist != ""
        )
            items.push(this._entity.attributes.media_artist);

        return html` <div class="secondary">${items.join(" - ")}</div> `;
    }

    _renderSourceSelctor() {
        const media_players = [];

        for (const [key, value] of Object.entries(this._hass["states"])) {
            if (key.startsWith("media_player")) {
                // Skip ytube_media_player entities
                if ((value as any)?.attributes?.remote_player_id) continue;

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
            <div class="source" style="position: relative;">
                <mwc-icon-button
                    id="menuButton"
                    @click=${() => this._menu.show()}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <title>dots-vertical</title>
                        <path
                            d="M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z" />
                    </svg>
                </mwc-icon-button>
                <mwc-menu
                    id="menu"
                    .anchor=${this._menuButton}
                    @selected=${this._selectSource}
                    corner="BOTTOM_END"
                    menuCorner="END"
                    naturalmenuwidth
                    fixed>
                    ${media_players.map((item) =>
                        item[0] == this._entity?.attributes?.remote_player_id
                            ? html`<mwc-list-item
                                  selected
                                  activated
                                  value=${item[0]}>
                                  ${item[1]}
                              </mwc-list-item> `
                            : html`<mwc-list-item value=${item[0]}
                                  >${item[1]}</mwc-list-item
                              > `
                    )}
                </mwc-menu>
            </div>
        `;
    }

    _renderTab() {
        let tabs = [];

        const forYouItem = new PoLRYTubeItem();
        forYouItem.title = "Yours";

        // Currently Playing Tab
        tabs.push(html`
            <polr-ytube-playing
                class="${this._activeTab == PoLRYTubeTab.CURRENTLY_PLAYING
                    ? "activeTab"
                    : "hiddenTab"}"
                id="playing"
                ._hass=${this._hass}
                ._entity=${this._entity}></polr-ytube-playing>
        `);

        // For You Tab
        tabs.push(html`
            <polr-ytube-browser
                class="${this._activeTab == PoLRYTubeTab.FOR_YOU
                    ? "activeTab"
                    : "hiddenTab"}"
                .hass=${this._hass}
                .entity=${this._entity}
                .initialAction=${forYouItem}></polr-ytube-browser>
        `);

        // Search tab
        tabs.push(html`
            <polr-ytube-search
                class="${this._activeTab == PoLRYTubeTab.SEARCH
                    ? "activeTab"
                    : "hiddenTab"}"
                ._hass=${this._hass}
                ._entity=${this._entity}
                ._limit="50"></polr-ytube-search>
        `);

        return tabs;
    }

    render() {
        return html`
            <ha-card>
                <div class="header">
                    <div class="icon-container" @click=${
                        this._togglePower
                    }>${this._renderIcon()}</div>
                    <div class="info-container">
                        <div class="primary">${this._config.header}</div>
                        ${this._renderSecondary()}
                    </div>
                    <div class="action-container">
                        ${this._renderLikeButton()}
                        ${this._renderSourceSelctor()}
                    </div>
                </div>
                </polr-header>
                <div class="content">
                    <polr-media-control
                        id="mediaControl"
                        .hass=${this._hass}
                        .entity=${this._entity}>
                    </polr-media-control>
                    <polr-tab-bar
                        activeIndex=${this._activeTab}
                        @MDCTabBar:activated="${(ev) =>
                            this._changeTab(ev.detail.index)}">
                        <polr-tab label="Playing"></polr-tab>
                        <polr-tab label="For You"></polr-tab>
                        <polr-tab label="Search"></polr-tab>
                    </polr-tab-bar>

                    <div class="results">${this._renderTab()}</div>
                </div>
            </ha-card>
        `;
    }

    async _changeTab(index: any) {
        switch (index) {
            case 0:
                this._activeTab = PoLRYTubeTab.CURRENTLY_PLAYING;
                //this._getCurrentlyPlayingItems();
                break;
            case 1:
                this._activeTab = PoLRYTubeTab.FOR_YOU;
                break;
            case 2:
                this._activeTab = PoLRYTubeTab.SEARCH;
                break;
            case 3:
                this._activeTab = PoLRYTubeTab.YOURS;
                break;

            default:
                break;
        }
    }

    async _likeSong(rating) {
        await this._hass.callService("ytube_music_player", "rate_track", {
            entity_id: this._config.entity_id,
            rating: rating,
        });
        this.requestUpdate();
    }

    async _selectSource(ev) {
        const selectedSource = this._menu.selected.value;
        const currentSource = this._entity?.attributes?.remote_player_id;

        if (selectedSource == "") return;
        if (selectedSource == currentSource) return;

        this._hass.callService("media_player", "select_source", {
            entity_id: this._config.entity_id,
            source: selectedSource,
        });
    }

    async _togglePower() {
        await this._hass.callService("media_player", "turn_off", {
            entity_id: this._config.entity_id,
        });
        this.requestUpdate();
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
                    grid-template-columns: 40px auto min-content;
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
                    cursor: pointer;
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

                .action-container {
                    display: flex;
                    justify-content: flex-end;
                }
                .source {
                    position: relative;
                }
                .hiddenTab {
                    display: none;
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
