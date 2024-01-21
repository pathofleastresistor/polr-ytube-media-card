import {
    LitElement,
    html,
    css,
    CSSResultGroup,
    nothing,
    PropertyValueMap,
} from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { PlayableMediaList, PoLRYTubeItem } from "../utils/utils";
import { ForwardBurgerIcon, PlayIcon, RadioTowerIcon } from "../utils/icons";

@customElement("polr-ytube-grid-item")
export class PoLRYTubeGridItem extends LitElement {
    @state() public entity: any;
    @state() public hass: any;
    @state() public element: PoLRYTubeItem;
    @state() public current: boolean;
    private _primaryAction: any;
    private _actions: any[] = [];
    private _hasAdditionalActions: boolean = false;

    protected firstUpdated(
        _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
    ): void {
        if (this.element.can_expand) this._primaryAction = "more";
        else this._primaryAction = "play";

        this._hasAdditionalActions =
            this.element.can_expand == this.element.can_play
                ? this.element.can_expand
                : this.element.media_content_type == "track";
        this.requestUpdate();
    }

    render() {
        return html`
            <div class="grid-item" @click=${this._performPrimaryAction}>
                <div>${this._renderThumbnail(this.element)}</div>
                <span class="title"> ${this.element.title}</span>
                <div class="actions">
                    ${this._hasAdditionalActions
                        ? html`
                              ${this._primaryAction != "more"
                                  ? this._renderMoreButton(this.element)
                                  : html``}
                              ${this._primaryAction != "play"
                                  ? this._renderPlayButton(this.element)
                                  : html``}
                              ${this._renderRadioButton(this.element)}
                          `
                        : ``}
                </div>
            </div>
        `;
    }

    private _performPrimaryAction() {
        if (this._primaryAction == "more")
            this._fireNavigateEvent(this.element);

        if (this._primaryAction == "play") this._play(this.element);
    }

    private _renderPrimaryAction() {
        if (this._primaryAction == "more") {
            return this._renderMoreButton(this.element);
        }

        if (this._primaryAction == "play") {
            return this._renderPlayButton(this.element);
        }

        return html``;
    }

    private _renderMoreButton(element: PoLRYTubeItem) {
        if (!element["can_expand"]) return html``;

        return html`
            <mwc-icon-button @click=${() => this._fireNavigateEvent(element)}>
                ${ForwardBurgerIcon}
            </mwc-icon-button>
        `;
    }

    private _renderPlayButton(element: PoLRYTubeItem) {
        if (!element.can_play) return html``;
        return html`
            <mwc-icon-button @click=${() => this._play(element)}>
                ${PlayIcon}
            </mwc-icon-button>
        `;
    }

    private _renderRadioButton(element: PoLRYTubeItem) {
        if (element.media_content_type == "track") {
            const id =
                element.media_content_type == "track"
                    ? element.media_content_id
                    : this.entity["attributes"]["videoId"];

            return html`
                <mwc-icon-button @click=${() => this._startRadio(id)}>
                    ${RadioTowerIcon}
                </mwc-icon-button>
            `;
        }
        return nothing;
    }

    private _renderThumbnail(element: PoLRYTubeItem) {
        if (element.thumbnail == "") {
            return html`<div class="empty-thumbnail thumbnail">
                <ha-icon icon="mdi:music-box"></ha-icon>
            </div>`;
        }

        return html` <img class="thumbnail" src="${element.thumbnail}" /> `;
    }

    private async _fireNavigateEvent(element: PoLRYTubeItem) {
        this.dispatchEvent(
            new CustomEvent("navigate", {
                detail: {
                    action: element,
                },
            })
        );
        return;
    }

    private async _startRadio(media_content_id) {
        this.hass.callService("media_player", "shuffle_set", {
            entity_id: this.entity["entity_id"],
            shuffle: false,
        });

        this.hass.callService("media_player", "play_media", {
            entity_id: this.entity["entity_id"],
            media_content_id: media_content_id,
            media_content_type: "vid_channel",
        });
        return;
    }

    private async _play(element: PoLRYTubeItem) {
        if (element.media_content_type == "PLAYLIST_GOTO_TRACK") {
            this.hass.callService("ytube_music_player", "call_method", {
                entity_id: this.entity["entity_id"],
                command: "goto_track",
                parameters: element.media_content_id,
            });

            return;
        }
        if (PlayableMediaList.includes(element.media_class)) {
            this.hass.callService("media_player", "play_media", {
                entity_id: this.entity["entity_id"],
                media_content_id: element.media_content_id,
                media_content_type: element.media_content_type,
            });

            return;
        }
    }

    static get styles(): CSSResultGroup {
        return [
            css`
                :host {
                }

                .grid-item {
                    position: relative;
                    display: grid;
                    aspect-ratio: 1 / 1;
                    cursor: pointer;
                    border-radius: 5px;
                    overflow: hidden;
                }

                .grid-item:focus {
                    outline: dotted thin;
                }

                .title {
                    position: absolute;
                    z-index: 2;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    padding: 4px 8px;
                    background-color: color-mix(
                        in srgb,
                        var(--primary-color) 90%,
                        #000000aa
                    );
                    font-size: 12px;
                    overflow: hidden;
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 2;
                }

                .actions {
                    position: absolute;
                    display: grid;
                    align-items: center;
                    grid-template-columns: auto;
                    top: 4px;
                    right: 4px;
                    background: rgba(0, 0, 0, 0.5);
                    border-radius: 9999px;
                }

                .actions > mwc-button {
                    margin: 0 8px;
                }

                .thumbnail {
                    width: 100%;
                    height: 100%;
                }

                .empty-thumbnail {
                    display: flex;
                    background-color: rgba(111, 111, 111, 0.2);
                    align-items: center;
                    justify-content: center;
                }
            `,
        ];
    }
}
