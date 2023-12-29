import { LitElement, html, css, CSSResultGroup } from "lit";
import { property, state } from "lit/decorators.js";
import "../elements/polr-ytube-search";

export class PoLRYTubeSearchCard extends LitElement {
    @property() _config: any = {};
    @property() _hass: any;
    @state() _entity: any;
    @state() _runOnce: boolean = false;

    static getConfigElement() {
        // return document.createElement("polr-ytube-search-card-editor");
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
            this._config.header = "YouTube Music Search";
        if (!("showHeader" in this._config)) this._config.showHeader = false;
        if (!("icon" in this._config)) this._config.searchTitle = "mdi:speaker";
    }

    set hass(hass) {
        if (!this._runOnce) {
            this._hass = hass;
            this._entity = structuredClone(
                this._hass["states"][this._config["entity_id"]]
            );
            this._runOnce = true;
        }
    }

    render() {
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
                    <polr-ytube-search
                        ._hass=${this._hass}
                        ._entity=${this._entity}>
                    </polr-ytube-search>
                </div>
            </ha-card>
        `;
    }
    static styles = css`
        ha-card {
            overflow: hidden;
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

customElements.define("polr-ytube-search-card", PoLRYTubeSearchCard);

// This puts your card into the UI card picker dialog
(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
    type: "polr-ytube-search-card",
    name: "PoLR YouTube Search",
    description: "Requires the ytube_media_player integration",
});
