import { LitElement, html, css, CSSResultGroup } from "lit";
import { property, state } from "lit/decorators.js";

export class PoLRYTubePlayingCard extends LitElement {
    @property() _config: any = {};
    @property() _hass: any;
    @property() _runOnce: boolean = false;
    @property() _response: boolean = false;

    static getConfigElement() {
        // return document.createElement("polr-ytube-playing-card-editor");
    }

    static getStubConfig() {
        return {};
    }

    setConfig(config: any) {
        if (!config.entity_id) {
            throw new Error("entity_id must be specified");
        }
        if (!config.header) {
            throw new Error("header must be specified");
        }

        this._config = structuredClone(config);
        this._config.header = this._config.header;
        if (!("showHeader" in this._config)) this._config.showHeader = false;
        if (!("searchTitle" in this._config))
            this._config.searchTitle = "Search";
    }

    set hass(hass) {
        if (!this._runOnce) {
            this._hass = hass;
            this._fetchResults();
            this._runOnce = true;
        }
    }
    async _fetchResults() {
        try {
            this._response = await this._hass.callWS({
                type: "media_player/browse_media",
                entity_id: this._config.entity_id,
                media_content_type: "cur_playlists",
                media_content_id: "",
            });

            console.log(this._response);
        } catch (e) {
            console.error(e);
        }
    }
}

customElements.define("polr-ytube-playing-card", PoLRYTubePlayingCard);

// This puts your card into the UI card picker dialog
(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
    type: "polr-ytube-playing-card",
    name: "PoLR YouTube Playing",
    description: "Requires the ytube_media_player integration",
});
