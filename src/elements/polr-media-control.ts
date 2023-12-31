import {
    LitElement,
    html,
    css,
    CSSResultGroup,
    nothing,
    PropertyValueMap,
} from "lit";
import { customElement, property } from "lit/decorators.js";
import "../shared/polr-slider";

@customElement("polr-media-control")
export class PoLRMediaControl extends LitElement {
    @property() hass: any;
    @property() entity: any;
    @property() volumeSlider: any;
    @property() tracker: any;
    @property() progress: any;
    @property() progressSlider: any;
    @property() volumeButton: any;
    @property() volumeMenu: any;

    async connectedCallback() {
        super.connectedCallback();
        this.trackProgress();
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        clearInterval(this.tracker);
        this.tracker = null;
    }

    protected firstUpdated(
        _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
    ): void {
        this.volumeSlider = this.renderRoot.querySelector("#volume") as any;
        if (this.volumeSlider)
            this.volumeSlider.value =
                this.entity?.attributes?.volume_level * 100;

        this.progressSlider = this.renderRoot.querySelector(
            "#progressSlider"
        ) as any;
        this.volumeButton = this.renderRoot.querySelector(
            "#volumeButton"
        ) as any;
        this.volumeMenu = this.renderRoot.querySelector("#volumeMenu") as any;
    }

    render() {
        return html`
            <div class="action-row">
                ${this._renderVolume()} ${this._renderLikeButton()}
                ${this._renderRadioButton()}
            </div>
            <div class="progress-row">${this._renderProgress()}</div>
            <div class="control-row">
                ${this._renderShuffle()} ${this._renderPrevious()}
                ${this._renderPlayPause()} ${this._renderNext()}
                ${this._renderRepeat()}
            </div>
        `;
    }

    _renderProgress() {
        return html`
            <polr-slider
                id="progressSlider"
                min="0"
                max="100"
                @change=${this._seekProgress}></polr-slider>
        `;
    }

    _renderVolume() {
        return html`
            <div>
                <mwc-icon-button
                    id="volumeButton"
                    @click=${() => this.volumeMenu.show()}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <title>volume-high</title>
                        <path
                            d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z" />
                    </svg>
                </mwc-icon-button>
                <mwc-menu
                    id="volumeMenu"
                    .anchor=${this.volumeButton}
                    corner="BOTTOM_START"
                    menuCorner="START"
                    naturalmenuwidth
                    fixed>
                    <mwc-icon-button @click=${this._toggleMute}>
                        ${this.entity?.attributes?.is_volume_muted
                            ? html` <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24">
                                  <title>volume-high</title>
                                  <path
                                      d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z" />
                              </svg>`
                            : html` <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24">
                                  <title>volume-off</title>
                                  <path
                                      d="M12,4L9.91,6.09L12,8.18M4.27,3L3,4.27L7.73,9H3V15H7L12,20V13.27L16.25,17.53C15.58,18.04 14.83,18.46 14,18.7V20.77C15.38,20.45 16.63,19.82 17.68,18.96L19.73,21L21,19.73L12,10.73M19,12C19,12.94 18.8,13.82 18.46,14.64L19.97,16.15C20.62,14.91 21,13.5 21,12C21,7.72 18,4.14 14,3.23V5.29C16.89,6.15 19,8.83 19,12M16.5,12C16.5,10.23 15.5,8.71 14,7.97V10.18L16.45,12.63C16.5,12.43 16.5,12.21 16.5,12Z" />
                              </svg>`}
                    </mwc-icon-button>
                    <polr-slider
                        id="volume"
                        min="0"
                        max="100"
                        steps="1"
                        @change=${this._changeVolume}></polr-slider>
                </mwc-menu>
            </div>
        `;
    }

    _renderLikeButton() {
        if (this.entity?.state == "off") return html``;
        if (!this.entity?.attributes?.likeStatus) return html``;

        if (this.entity?.attributes?.likeStatus == "LIKE") {
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

    _renderRadioButton() {
        return html`
            <mwc-icon-button @click=${this._startRadio}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                        d="M12,10A2,2 0 0,1 14,12C14,12.5 13.82,12.94 13.53,13.29L16.7,22H14.57L12,14.93L9.43,22H7.3L10.47,13.29C10.18,12.94 10,12.5 10,12A2,2 0 0,1 12,10M12,8A4,4 0 0,0 8,12C8,12.5 8.1,13 8.28,13.46L7.4,15.86C6.53,14.81 6,13.47 6,12A6,6 0 0,1 12,6A6,6 0 0,1 18,12C18,13.47 17.47,14.81 16.6,15.86L15.72,13.46C15.9,13 16,12.5 16,12A4,4 0 0,0 12,8M12,4A8,8 0 0,0 4,12C4,14.36 5,16.5 6.64,17.94L5.92,19.94C3.54,18.11 2,15.23 2,12A10,10 0 0,1 12,2A10,10 0 0,1 22,12C22,15.23 20.46,18.11 18.08,19.94L17.36,17.94C19,16.5 20,14.36 20,12A8,8 0 0,0 12,4Z" />
                </svg>
            </mwc-icon-button>
        `;
    }

    _renderShuffle() {
        return html`
            <mwc-icon-button @click=${this._shuffleList}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <title>shuffle-variant</title>
                    <path
                        d="M17,3L22.25,7.5L17,12L22.25,16.5L17,21V18H14.26L11.44,15.18L13.56,13.06L15.5,15H17V12L17,9H15.5L6.5,18H2V15H5.26L14.26,6H17V3M2,6H6.5L9.32,8.82L7.2,10.94L5.26,9H2V6Z" />
                </svg>
            </mwc-icon-button>
        `;
    }

    _renderRepeat() {
        return html`
            <mwc-icon-button @click=${this._changeRepeat}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <title>repeat</title>
                    <path
                        d="M17,17H7V14L3,18L7,22V19H19V13H17M7,7H17V10L21,6L17,2V5H5V11H7V7Z" />
                </svg>
            </mwc-icon-button>
        `;
    }
    _renderPrevious() {
        return html`
            <mwc-icon-button @click=${this._skipPrevious}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <title>skip-previous</title>
                    <path d="M6,18V6H8V18H6M9.5,12L18,6V18L9.5,12Z" />
                </svg>
            </mwc-icon-button>
        `;
    }

    _renderPlayPause() {
        return html`
            <mwc-icon-button @click=${this._togglePlayPause}>
                ${this.entity.state == "playing"
                    ? html` <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24">
                          <title>pause</title>
                          <path d="M14,19H18V5H14M6,19H10V5H6V19Z" />
                      </svg>`
                    : html` <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24">
                          <title>play</title>
                          <path d="M8,5.14V19.14L19,12.14L8,5.14Z" />
                      </svg>`}
            </mwc-icon-button>
        `;
    }

    _renderNext() {
        return html`
            <mwc-icon-button @click=${this._skipNext}
                ><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <title>skip-next</title>
                    <path d="M16,18H18V6H16M6,18L14.5,12L6,6V18Z" />
                </svg>
            </mwc-icon-button>
        `;
    }

    _changeVolume() {
        this.hass.callService("media_player", "volume_set", {
            entity_id: this.entity["entity_id"],
            volume_level: this.volumeSlider.value / 100,
        });
    }

    _toggleMute() {
        this.hass.callService("media_player", "volume_mute", {
            entity_id: this.entity["entity_id"],
            is_volume_muted: false,
        });
    }
    async _startRadio() {
        await this.hass.callService("media_player", "shuffle_set", {
            entity_id: this.entity["entity_id"],
            shuffle: false,
        });

        this.hass.callService("media_player", "play_media", {
            entity_id: this.entity["entity_id"],
            media_content_id: this.entity?.attributes?.videoId,
            media_content_type: "vid_channel",
        });
    }

    async _likeSong(rating) {
        await this.hass.callService("ytube_music_player", "rate_track", {
            entity_id: this.entity?.entity_id,
            rating: rating,
        });
        this.requestUpdate();
    }

    _shuffleList() {
        const shuffle = this.entity?.attributes?.shuffle;

        this.hass.callService("media_player", "shuffle_set", {
            entity_id: this.entity["entity_id"],
            shuffle: !shuffle,
        });
    }

    _changeRepeat() {
        const repeat = this.entity?.attributes?.repeat;
        let newRepeat;

        switch (repeat) {
            case "off":
                newRepeat = "one";
                break;
            case "one":
                newRepeat = "all";
                break;
            case "all":
                newRepeat = "off";
                break;
            default:
                break;
        }

        this.hass.callService("media_player", "repeat_set", {
            entity_id: this.entity["entity_id"],
            repeat: newRepeat,
        });
    }

    _skipPrevious() {
        this.hass.callService("media_player", "media_previous_track", {
            entity_id: this.entity["entity_id"],
        });
    }

    _togglePlayPause() {
        this.hass.callService("media_player", "media_play_pause", {
            entity_id: this.entity["entity_id"],
        });
    }

    _skipNext() {
        this.hass.callService("media_player", "media_next_track", {
            entity_id: this.entity["entity_id"],
        });
    }

    _seekProgress() {
        let progress = this.renderRoot.querySelector("#progressSlider") as any;

        let position =
            (progress.value / 100) * this.entity?.attributes?.media_duration;

        this.hass.callService("media_player", "media_seek", {
            entity_id: this.entity["entity_id"],
            seek_position: position,
        });
    }

    trackProgress() {
        let now = Date.now();

        let last_update = Date.parse(
            this.entity?.attributes?.media_position_updated_at
        );
        let current =
            this.entity?.attributes?.media_position +
            (now - last_update) / 1000;

        if (this.progressSlider != null) {
            this.progressSlider.value =
                100 * (current / this.entity?.attributes?.media_duration);
        }

        if (this.entity?.attributes?.media_position == null)
            this.progressSlider.value = 0;

        if (!this.tracker)
            this.tracker = setInterval(() => this.trackProgress(), 1000);
    }

    static get styles(): CSSResultGroup {
        return [
            css`
                :host {
                    --mdc-icon-button-size: 40px;
                    --mdc-icon-size: 20px;
                    display: grid;
                    gap: 12px;
                }
                .action-row {
                    display: grid;
                    grid-template-columns: min-content min-content min-content;

                    justify-content: space-evenly;
                }
                .progress-row {
                    display: grid;
                    grid-template-columns: 1fr;
                }

                .control-row {
                    display: grid;
                    grid-template-columns: min-content min-content min-content min-content min-content;
                    align-items: center;

                    justify-content: space-evenly;
                }
                #volumeSlider {
                    transform: rotate(-90deg);
                }

                #volume {
                    --md-sys-color-primary: var(--primary-color);
                    --md-slider-handle-height: 10px;
                    --md-slider-handle-shape: 9999px;
                    --md-slider-active-track-shape: 9999px;
                    --md-slider-inactive-track-shape: 4px;
                    --md-slider-active-track-height: 5px;
                    --md-slider-inactive-track-height: 5px;
                }
                #progressSlider {
                    --md-sys-color-primary: var(--primary-color);
                    --md-slider-handle-height: 12px;
                    --md-slider-handle-shape: 4px;
                    --md-slider-active-track-shape: 4px;
                    --md-slider-inactive-track-shape: 4px;
                    --md-slider-active-track-height: 12px;
                    --md-slider-inactive-track-height: 12px;
                }
            `,
        ];
    }
}
