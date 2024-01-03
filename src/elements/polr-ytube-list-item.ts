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

@customElement("polr-ytube-list-item")
export class PoLRYTubeListItem extends LitElement {
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
            <mwc-list-item
                graphic="medium"
                hasMeta
                @click=${this._performPrimaryAction}
                ?activated=${this.current}
            >
                ${this._renderThumbnail(this.element)} ${this.element.title}
                ${this._renderAction()}
            </mwc-list-item>
            ${this._hasAdditionalActions
                ? html`
                      <div class="divider"></div>
                      <div class="actions">
                          ${this._primaryAction != "more"
                              ? this._renderMoreButton(this.element)
                              : html``}
                          ${this._primaryAction != "play"
                              ? this._renderPlayButton(this.element)
                              : html``}
                          ${this._renderRadioButton(this.element)}
                      </div>
                  `
                : ``}
        `;
    }

    private _performPrimaryAction() {
        if (this._primaryAction == "more")
            this._fireNavigateEvent(this.element);

        if (this._primaryAction == "play") this._play(this.element);
    }

    private _renderAction() {
        if (this._primaryAction == "more") {
            return html`<span slot="meta">${ForwardBurgerIcon}</span>`;
        }

        if (this._primaryAction == "play") {
            return html`<ha-icon slot="meta" icon="mdi:play"></ha-icon>`;
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
            return html`<div slot="graphic" class="empty-thumbnail thumbnail">
                <ha-icon icon="mdi:music-box"></ha-icon>
            </div>`;
        }

        return html`
            <img slot="graphic" class="thumbnail" src="${element.thumbnail}" />
        `;
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
                    display: grid;
                    grid-template-columns: 1fr min-content min-content;
                    align-items: center;
                }

                mwc-list-item {
                    border-radius: 12px;
                }

                svg {
                    width: 18px;
                    height: 18px;
                    fill: var(--primary-text-color);
                }

                .divider {
                    width: 2px;
                    background: rgba(var(--rgb-primary-text-color), 0.2);
                    height: 50%;
                    margin: 0 4px;
                }

                .actions {
                    display: grid;
                    grid-template-columns: auto;
                    align-items: center;
                }

                .actions > mwc-button {
                    margin: 0 8px;
                }

                .element img {
                    width: 40px;
                    height: 40px;
                    border-radius: 5%;
                }

                .empty-thumbnail {
                    display: flex;
                    background-color: rgba(111, 111, 111, 0.2);
                    border-radius: 5%;
                    height: 40px;
                    align-items: center;
                    justify-content: center;
                }
            `,
        ];
    }
}
