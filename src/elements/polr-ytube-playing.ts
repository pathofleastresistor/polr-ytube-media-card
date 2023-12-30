import { LitElement, html, css, CSSResultGroup, PropertyValueMap } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import "../elements/polr-ytube-list";
import { PoLRYTubeList } from "../elements/polr-ytube-list";
import { FetchableMediaContentType, PoLRYTubeListState } from "../utils/utils";

@customElement("polr-ytube-playing")
export class PoLRYTubePlaying extends LitElement {
    @state() public _hass: any;
    @state() public _entity: any;
    @state() private _polrYTubeList: PoLRYTubeList;

    protected firstUpdated(_changedProperties): void {
        this._polrYTubeList = this.renderRoot.querySelector("polr-ytube-list");
        this._getCurrentlyPlayingItems();
    }

    render() {
        return html`
            <polr-ytube-list
                .hass=${this._hass}
                .entity=${this._entity}></polr-ytube-list>
        `;
    }

    async _getCurrentlyPlayingItems() {
        let media_content_type = this._entity?.attributes?.media_content_type;
        let results;
        if (this._entity.state == "idle") return;

        try {
            if (FetchableMediaContentType.includes(media_content_type)) {
                results = await this._hass.callWS({
                    type: "media_player/browse_media",
                    entity_id: this._entity["entity_id"],
                    media_content_type: "cur_playlists",
                    media_content_id: "",
                });
            }

            if (["album"].includes(media_content_type)) {
                results = await this._hass.callWS({
                    type: "media_player/browse_media",
                    entity_id: this._entity["entity_id"],
                    media_content_type: "album_of_track",
                    media_content_id: "1",
                });
            }

            if (
                //this._entity.state == "idle" ||
                this._entity.attributes?.media_title == "loading..."
            ) {
                this._polrYTubeList.state = PoLRYTubeListState.LOADING;
                return;
            }

            //console.log(this._entity);
            if (results?.children?.length > 0) {
                this._polrYTubeList.elements = results.children;
                this._polrYTubeList.state = PoLRYTubeListState.HAS_RESULTS;
            } else {
                //this._polrYTubeList.elements = [];
                //this._polrYTubeList.state = PoLRYTubeListState.NO_RESULTS;
            }
            this.requestUpdate();
        } catch (e) {
            console.error(e);
            this._polrYTubeList.state = PoLRYTubeListState.ERROR;
        }
    }

    public refresh() {
        this._getCurrentlyPlayingItems();
    }

    static styles = css``;
}
