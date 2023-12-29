import { LitElement, html, css, CSSResultGroup, nothing } from "lit";
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
            <mwc-icon-button @click=${() => this._fireNavigateEvent(element)}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <title>forwardburger</title>
                    <path
                        d="M19,13H3V11H19L15,7L16.4,5.6L22.8,12L16.4,18.4L15,17L19,13M3,6H13V8H3V6M13,16V18H3V16H13Z" />
                </svg>
            </mwc-icon-button>
        `;
    }

    private _renderPlayButton(element: PoLRYTubeItem) {
        if (!element.can_play) return html``;
        return html`
            <mwc-icon-button @click=${() => this._play(element)}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <title>play</title>
                    <path d="M8,5.14V19.14L19,12.14L8,5.14Z" />
                </svg>
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
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <title>radio-tower</title>
                        <path
                            d="M12,10A2,2 0 0,1 14,12C14,12.5 13.82,12.94 13.53,13.29L16.7,22H14.57L12,14.93L9.43,22H7.3L10.47,13.29C10.18,12.94 10,12.5 10,12A2,2 0 0,1 12,10M12,8A4,4 0 0,0 8,12C8,12.5 8.1,13 8.28,13.46L7.4,15.86C6.53,14.81 6,13.47 6,12A6,6 0 0,1 12,6A6,6 0 0,1 18,12C18,13.47 17.47,14.81 16.6,15.86L15.72,13.46C15.9,13 16,12.5 16,12A4,4 0 0,0 12,8M12,4A8,8 0 0,0 4,12C4,14.36 5,16.5 6.64,17.94L5.92,19.94C3.54,18.11 2,15.23 2,12A10,10 0 0,1 12,2A10,10 0 0,1 22,12C22,15.23 20.46,18.11 18.08,19.94L17.36,17.94C19,16.5 20,14.36 20,12A8,8 0 0,0 12,4Z" />
                    </svg>
                </mwc-icon-button>
            `;
        }
        return nothing;
    }

    render() {
        if (this.elements == null || this.elements?.length == 0) return html``;

        console.log(this.elements);

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
