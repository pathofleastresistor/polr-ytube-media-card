import { LitElement, html, css, CSSResultGroup } from "lit";
import { property, state } from "lit/decorators.js";

export class PoLRYTubePlayingCard extends LitElement {
    @property() _config: any = {};
    @property() _hass: any;
    @property() _runOnce: boolean = false;
    @property() _response: boolean = false;
    @state() _entity: any;

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

        this._config = structuredClone(config);
        if (!("header" in this._config))
            this._config.header = "Current Playlist";
        if (!("showHeader" in this._config)) this._config.showHeader = false;
        if (!("searchTitle" in this._config))
            this._config.searchTitle = "Search";
    }

    set hass(hass) {
        this._hass = hass;
        this._entity = this._hass["states"][this._config["entity_id"]];
        if (!this._runOnce) {
            this._fetchResults();
            this._runOnce = true;
            console.log(this._entity);
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

    _renderResponse() {
        const elements = this._response["children"]
            ?.filter((result) => result["can_play"] && !result["can_expand"])
            .map((str) => {
                return html`
                    <div class="result">
                        <div
                            class="title ${str["media_content_id"] ==
                            this._entity["attributes"]["current_track"]
                                ? "current_track"
                                : ""}">
                            ${str["title"]}
                        </div>
                    </div>
                `;
            });
        return elements;
    }
    render() {
        const elements = this._response["children"];
        const header = this._config["showHeader"]
            ? html`
                  <div class="header">
                      <div class="icon-container">
                          <ha-icon icon="${this._config.icon}"></ha-icon>
                      </div>
                      <div class="info-container">
                          <div class="primary">${this._config.header}</div>
                      </div>
                  </div>
              `
            : html``;

        return html`
            <ha-card>
                ${header}
                <div class="content">
                    <div class="results">${this._renderResponse()}</div>
                </div>
            </ha-card>
        `;
    }

    static styles = css`
        ha-card {
            overflow: hidden;
        }
        .results {
            max-height: 400px;
            overflow: scroll;
        }
        .result {
            padding: 12px 0;
            display: grid;
            grid-template-columns: 1fr;
            align-items: center;
            gap: 8px;
        }
        .current_track {
            font-weight: bold;
        }

        .header {
            display: grid;
            height: 40px;
            padding: 12px 12px 0 12px;
            grid-template-columns: min-content auto 40px;
            gap: 4px;
        }
        .icon-container {
            display: flex;
            height: 40px;
            width: 40px;
            border-radius: 50%;
            background: rgba(111, 111, 111, 0.2);
            place-content: center;
            align-items: center;
            margin-right: 12px;
        }
        .info-container {
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
        .primary {
            font-weight: bold;
        }
        .action-container {
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
        }
        .content {
            padding: 12px 12px 12px 12px;
        }
    `;
}

customElements.define("polr-ytube-playing-card", PoLRYTubePlayingCard);

// This puts your card into the UI card picker dialog
(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
    type: "polr-ytube-playing-card",
    name: "PoLR YouTube Playing",
    description: "Requires the ytube_media_player integration",
});
