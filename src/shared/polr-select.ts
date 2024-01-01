import { css } from "lit";
import { SelectBase } from "@material/mwc-select/mwc-select-base";
import { styles } from "@material/mwc-select/mwc-select.css";
import { customElement, property } from "lit/decorators.js";

@customElement("polr-select")
export class PoLRSelect extends SelectBase {
    static override styles = [
        styles,
        css`
            .mdc-select__anchor {
                height: var(--select-height, 56px) !important;
                width: 100%;
            }
        `,
    ];
}

declare global {
    interface HTMLElementTagNameMap {
        "polr-select": PoLRSelect;
    }
}
