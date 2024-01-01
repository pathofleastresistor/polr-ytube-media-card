import {
    LitElement,
    html,
    css,
    CSSResultGroup,
    nothing,
    PropertyValueMap,
} from "lit";
import { customElement, property, state } from "lit/decorators.js";
import {
    isNumeric,
    PlayableMediaList,
    PoLRYTubeItem,
    PoLRYTubeListState,
    areDeeplyEqual,
} from "../utils/utils";
import { ForwardBurgerIcon, PlayIcon, RadioTowerIcon } from "../utils/icons";

@customElement("polr-ytube-list")
export class PoLRYTubeList extends LitElement {
    @state() public entity: any;
    @state() public hass: any;
    @state() public elements: PoLRYTubeItem[];
    @state() public state: PoLRYTubeListState;

    protected updated(
        _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
    ): void {
        // this.renderRoot.querySelector(".current")?.scrollIntoView({
        //     behavior: "smooth",
        //     block: "start",
        //     inline: "center",
        // });
    }

    private _is_current(element: PoLRYTubeItem): boolean {
        if (this.entity == null) return false;
        if (!isNumeric(element.media_content_id)) return false;

        if ("current_track" in this.entity["attributes"]) {
            return (
                parseInt(element.media_content_id) - 1 ==
                this.entity["attributes"]["current_track"]
            );
        }
        return false;
    }

    render() {
        if (this.state == PoLRYTubeListState.LOADING) {
            return html`<div class="loading">Loading...</div>`;
        }

        if (this.state == PoLRYTubeListState.NO_RESULTS) {
            return html`<div class="empty">No results</div>`;
        }

        if (this.state == PoLRYTubeListState.ERROR) {
            return html`<div class="error">Unknown Error</div>`;
        }

        if (this.state == PoLRYTubeListState.HAS_RESULTS) {
            if (this.elements.length == 0) return html``;

            const renderedElements = this.elements.map((element) => {
                return html`
                    <div
                        class="element ${this._is_current(element)
                            ? "current"
                            : ""}">
                        ${this._renderThumbnail(element)}
                        <div class="info">${element.title}</div>
                        <div class="actions">
                            ${this._renderMoreButton(element)}
                            ${this._renderRadioButton(element)}
                            ${this._renderPlayButton(element)}
                        </div>
                    </div>
                `;
            });

            return html`
                <div class="list-container">
                    <div class="elements">${renderedElements}</div>
                </div>
            `;
        }
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
        if (
            this._is_current(element) ||
            element.media_content_type == "track"
        ) {
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
                .elements {
                }

                .element {
                    display: grid;
                    grid-template-columns: 40px 1fr min-content;
                    align-items: center;
                    gap: 12px;
                    padding: 12px;
                    border-radius: 12px;
                }

                .actions {
                    display: grid;
                    grid-template-columns: auto auto auto;
                }

                .actions > mwc-button {
                    margin-right: 8px;
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

                .current {
                    background-color: var(--primary-background-color);
                }

                .empty,
                .loading,
                .error {
                    display: grid;
                    align-items: center;
                    justify-items: center;
                    height: 100px;
                }
            `,
        ];
    }
}
