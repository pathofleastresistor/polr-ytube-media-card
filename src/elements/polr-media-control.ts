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
    }

    render() {
        return html`
            ${this._renderProgressBar()}
            <div class="controls">
                ${this._renderMuteToggle()}
                <polr-slider
                    id="volume"
                    min="0"
                    max="100"
                    steps="1"
                    labeled
                    @change=${this._changeVolume}></polr-slider>
                ${this._renderPrevious()} ${this._renderPlayPause()}
                ${this._renderNext()}
            </div>
        `;
    }

    _renderProgressBar() {
        return html`
            <polr-slider
                id="progressSlider"
                min="0"
                max="100"
                @change=${this._seekProgress}></polr-slider>
        `;
    }

    _renderMuteToggle() {
        if (this.entity?.attributes?.is_volume_muted) {
            return html`
                <mwc-icon-button @click=${this._toggleMute}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <title>volume-off</title>
                        <path
                            d="M12,4L9.91,6.09L12,8.18M4.27,3L3,4.27L7.73,9H3V15H7L12,20V13.27L16.25,17.53C15.58,18.04 14.83,18.46 14,18.7V20.77C15.38,20.45 16.63,19.82 17.68,18.96L19.73,21L21,19.73L12,10.73M19,12C19,12.94 18.8,13.82 18.46,14.64L19.97,16.15C20.62,14.91 21,13.5 21,12C21,7.72 18,4.14 14,3.23V5.29C16.89,6.15 19,8.83 19,12M16.5,12C16.5,10.23 15.5,8.71 14,7.97V10.18L16.45,12.63C16.5,12.43 16.5,12.21 16.5,12Z" />
                    </svg>
                </mwc-icon-button>
            `;
        } else {
            return html`
                <mwc-icon-button @click=${this._toggleMute}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <title>volume-high</title>
                        <path
                            d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z" />
                    </svg>
                </mwc-icon-button>
            `;
        }
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
        if (this.entity.state == "playing") {
            return html`
                <mwc-icon-button @click=${this._togglePlayPause}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <title>play</title>
                        <path d="M8,5.14V19.14L19,12.14L8,5.14Z" />
                    </svg>
                </mwc-icon-button>
            `;
        } else {
            return html`
                <mwc-icon-button @click=${this._togglePlayPause}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <title>pause</title>
                        <path d="M14,19H18V5H14M6,19H10V5H6V19Z" />
                    </svg>
                </mwc-icon-button>
            `;
        }
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
                    gap: 24px;
                }

                .controls {
                    display: grid;
                    grid-template-columns: min-content min-content min-content min-content min-content;
                    align-items: center;

                    justify-content: space-evenly;
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
