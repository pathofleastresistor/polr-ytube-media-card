import {
    LitElement,
    html,
    css,
    CSSResultGroup,
    nothing,
    PropertyValueMap,
} from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("polr-media-control")
export class PoLRMediaControl extends LitElement {
    @property() hass: any;
    @property() entity: any;
    @property() volumeSlider: any;
    @property() tracker: any;
    @property() progress: any;

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
    }

    trackProgress() {
        let now = Date.now();

        let last_update = Date.parse(
            this.entity?.attributes?.media_position_updated_at
        );
        let current =
            this.entity?.attributes?.media_position +
            (now - last_update) / 1000;

        this.progress =
            100 * (current / this.entity?.attributes?.media_duration);

        if (this.entity?.attributes?.media_position == null) this.progress = 0;

        if (!this.tracker)
            this.tracker = setInterval(() => this.trackProgress(), 1000);
    }

    render() {
        return html`
            <div class="controls">
                ${this._renderMuteToggle()}
                <md-slider
                    id="volume"
                    min="0"
                    max="100"
                    steps="1"
                    labeled
                    @change=${this._changeVolume}></md-slider>
                ${this._renderPrevious()} ${this._renderPlayPause()}
                ${this._renderNext()}
            </div>
            <div id="progress" @click=${this._seekProgress}>
                ${this._renderProgressBar()}
            </div>
        `;
    }

    _renderProgressBar() {
        return html`
            <div
                id="progress-bar"
                style="width:${Math.round(this.progress)}%"></div>
        `;
    }

    _renderMuteToggle() {
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
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <title>play</title>
                    <path d="M8,5.14V19.14L19,12.14L8,5.14Z" />
                </svg>
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
        let volume = this.renderRoot.querySelector("md-slider") as any;

        this.hass.callService("media_player", "volume_set", {
            entity_id: this.entity["entity_id"],
            volume_level: volume.value / 100,
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

    _seekProgress(ev) {
        let progress = this.renderRoot.querySelector(
            "#progress"
        ) as HTMLDivElement;

        let rect = progress.getBoundingClientRect();
        let distance = (ev.clientX - rect.x) / rect.width;
        let position = distance * this.entity?.attributes?.media_duration;

        this.hass.callService("media_player", "media_seek", {
            entity_id: this.entity["entity_id"],
            seek_position: position,
        });
    }

    static get styles(): CSSResultGroup {
        return [
            css`
                :host {
                    --md-sys-color-primary: var(--primary-color);
                    display: grid;
                    gap: 12px;
                }

                .controls {
                    display: grid;
                    grid-template-columns: min-content 1fr min-content min-content min-content;
                    align-items: center;
                }

                #progress {
                    display: grid;
                    height: 10px;
                    cursor: pointer;
                    background-color: rgba(111, 111, 111, 0.2);
                    border-radius: 5px;
                }

                #progress-bar {
                    display: block;
                    height: 10px;
                    border-radius: 5px;
                    background-color: var(--primary-color);
                }
            `,
        ];
    }
}
