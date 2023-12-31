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
import {
    PauseIcon,
    PlayIcon,
    RadioTowerIcon,
    RepeatIcon,
    ShuffleVariantIcon,
    SkipPreviousIcon,
    SkipNextIcon,
    ThumbUpIcon,
    ThumbUpOutlineIcon,
    VolumeOffIcon,
    VolumeHighIcon,
} from "../utils/icons";

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
        this._trackProgress();
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

    _renderLikeButton() {
        if (this.entity?.state == "off") return html``;
        if (!("likeStatus" in this.entity?.attributes)) return html``;

        return html`
            <mwc-icon-button @click=${() => this._likeSong()}>
                ${this.entity?.attributes?.likeStatus == "LIKE"
                    ? ThumbUpIcon
                    : ThumbUpOutlineIcon}
            </mwc-icon-button>
        `;
    }

    _renderNext() {
        return html`
            <mwc-icon-button @click=${this._skipNext}>
                ${SkipNextIcon}
            </mwc-icon-button>
        `;
    }

    _renderPlayPause() {
        return html`
            <mwc-icon-button @click=${this._togglePlayPause}>
                ${this.entity.state == "playing" ? PauseIcon : PlayIcon}
            </mwc-icon-button>
        `;
    }

    _renderPrevious() {
        return html`
            <mwc-icon-button @click=${this._skipPrevious}
                >${SkipPreviousIcon}
            </mwc-icon-button>
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

    _renderRadioButton() {
        return html`
            <mwc-icon-button @click=${this._startRadio}
                >${RadioTowerIcon}
            </mwc-icon-button>
        `;
    }

    _renderRepeat() {
        return html`
            <mwc-icon-button @click=${this._changeRepeat}
                >${RepeatIcon}
            </mwc-icon-button>
        `;
    }

    _renderShuffle() {
        return html`
            <mwc-icon-button @click=${this._shuffleList}
                >${ShuffleVariantIcon}
            </mwc-icon-button>
        `;
    }

    _renderVolume() {
        return html`
            <div>
                <mwc-icon-button
                    id="volumeButton"
                    @click=${() => this.volumeMenu.show()}>
                    ${VolumeHighIcon}
                </mwc-icon-button>
                <mwc-menu
                    id="volumeMenu"
                    .anchor=${this.volumeButton}
                    corner="BOTTOM_START"
                    menuCorner="START"
                    naturalmenuwidth
                    fixed>
                    <div class="volumeMenuItems">
                        <mwc-icon-button @click=${this._toggleMute}>
                            ${this.entity?.attributes?.is_volume_muted
                                ? VolumeHighIcon
                                : VolumeOffIcon}
                        </mwc-icon-button>
                        <polr-slider
                            id="volume"
                            min="0"
                            max="100"
                            steps="1"
                            @change=${this._changeVolume}></polr-slider>
                    </div>
                </mwc-menu>
            </div>
        `;
    }

    async _changeRepeat() {
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

    async _changeVolume() {
        this.hass.callService("media_player", "volume_set", {
            entity_id: this.entity["entity_id"],
            volume_level: this.volumeSlider.value / 100,
        });
    }

    async _likeSong() {
        await this.hass.callService("ytube_music_player", "rate_track", {
            entity_id: this.entity?.entity_id,
            rating: "thumb_toggle_up_middle",
        });
        this.requestUpdate();
    }

    async _seekProgress() {
        let progress = this.renderRoot.querySelector("#progressSlider") as any;

        let position =
            (progress.value / 100) * this.entity?.attributes?.media_duration;

        this.hass.callService("media_player", "media_seek", {
            entity_id: this.entity["entity_id"],
            seek_position: position,
        });
    }

    async _shuffleList() {
        const shuffle = this.entity?.attributes?.shuffle;

        this.hass.callService("media_player", "shuffle_set", {
            entity_id: this.entity["entity_id"],
            shuffle: !shuffle,
        });
    }

    async _skipNext() {
        this.hass.callService("media_player", "media_next_track", {
            entity_id: this.entity["entity_id"],
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

    async _toggleMute() {
        this.hass.callService("media_player", "volume_mute", {
            entity_id: this.entity["entity_id"],
            is_volume_muted: false,
        });
    }

    async _trackProgress() {
        let now = Date.now();

        let last_update = Date.parse(
            this.entity?.attributes?.media_position_updated_at
        );
        let current =
            this.entity?.attributes?.media_position +
            (now - last_update) / 1000;
        let position =
            100 * (current / this.entity?.attributes?.media_duration);

        if (this.progressSlider != null) {
            this.progressSlider.value = position;
            if (this.entity?.attributes?.media_position == null)
                this.progressSlider.value = 0;
        }

        if (!this.tracker)
            this.tracker = setInterval(() => this._trackProgress(), 1000);
    }

    async _skipPrevious() {
        this.hass.callService("media_player", "media_previous_track", {
            entity_id: this.entity["entity_id"],
        });
    }

    async _togglePlayPause() {
        this.hass.callService("media_player", "media_play_pause", {
            entity_id: this.entity["entity_id"],
        });
    }

    static get styles(): CSSResultGroup {
        return [
            css`
                :host {
                    display: grid;
                    gap: 12px;
                    padding: 12px 0;
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
                .volumeMenuItems {
                    display: grid;
                    grid-template-columns: min-content 1fr;
                    align-items: center;
                    padding: 0 12px;
                }
            `,
        ];
    }
}
