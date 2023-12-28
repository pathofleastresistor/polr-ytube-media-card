import { LitElement, html, css, CSSResultGroup } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { PoLRYTubeItem } from "../utils/polr-ytube-item";

export const enum PoLRYTubeState {
    INITAL = 1,
    LOADING = 2,
    HAS_RESULTS = 4,
    NO_RESULTS = 8,
    ERROR = 16,
}

@customElement("polr-ytube-list")
export class PoLRYTubeList extends LitElement {
    @property() public entity: any;
    @property() public hass: any;
    @property() public elements: PoLRYTubeItem[];
    @state() private _browseHistory: PoLRYTubeItem[] = [];

    private _is_current(element: PoLRYTubeItem): boolean {
        if (this.entity == null) return false;
        if ("current_track" in this.entity["attributes"]) {
            return (
                parseInt(element.media_content_id) - 1 ==
                this.entity["attributes"]["current_track"]
            );
        }
        return false;
    }

    private _renderThumbnail(element: PoLRYTubeItem) {
        if (element.thumbnail == "") {
            return html`<div class="empty thumbnail">
                <ha-icon icon="mdi:music-box"></ha-icon>
            </div>`;
        }

        return html` <img class="thumbnail" src="${element.thumbnail}" /> `;
    }

    private _renderMoreButton(element: PoLRYTubeItem) {
        if (!element["can_expand"]) return html``;

        return html`
            <mwc-button @click=${() => this._fireNavigateEvent(element)}>
                More
            </mwc-button>
        `;
    }

    private _renderPlayButton(element: PoLRYTubeItem) {
        if (!element.can_play) return html``;
        return html`
            <mwc-button @click=${() => this._play(element)}>Play</mwc-button>
        `;
    }

    private _renderRadioButton(element: PoLRYTubeItem) {
        if (!(this._is_current(element) || element.media_content_id === null))
            return html``;

        const id =
            element.media_content_type == "track"
                ? element.media_content_id
                : this.entity["attributes"]["videoId"];

        return html`
            <mwc-button @click=${() => this._startRadio(id)}>
                Radio
            </mwc-button>
        `;
    }

    private _renderBackButton() {
        if (this._browseHistory.length <= 1) return html``;

        return html`
            <div>
                <mwc-button
                    @click=${() =>
                        this._fireNavigateEvent(
                            this._browseHistory.pop() &&
                                this._browseHistory.pop()
                        )}
                    >back</mwc-button
                >
            </div>
        `;
    }

    render() {
        //console.debug(this.elements);

        if (this.elements == null || this.elements?.length == 0) return html``;

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
                ${this._renderBackButton()}
                <div class="elements">${renderedElements}</div>
            </div>
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

        this.dispatchEvent(new CustomEvent("update"));
        return;
    }

    private async _play(element: PoLRYTubeItem) {
        if (["track", "playlist"].includes(element.media_content_type)) {
            this.hass.callService("media_player", "play_media", {
                entity_id: this.entity["entity_id"],
                media_content_id: element.media_content_id,
                media_content_type: element.media_content_type,
            });
        } else {
            this.hass.callService("ytube_music_player", "call_method", {
                entity_id: this.entity["entity_id"],
                command: "goto_track",
                parameters: element.media_content_id,
            });
        }
    }

    static get styles(): CSSResultGroup {
        return [
            css`
                :host {
                }

                .elements {
                    height: 400px;
                    overflow: scroll;
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

                .empty {
                    display: flex;
                    background-color: rgba(111, 111, 111, 0.2);
                    border-radius: 5%;
                    height: 40px;
                    align-items: center;
                    justify-content: center;
                }

                .current {
                    background-color: rgba(111, 111, 111, 0.2);
                }
            `,
        ];
    }
}
