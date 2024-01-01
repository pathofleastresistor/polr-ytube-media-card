import { css } from "lit";
import { SelectBase } from "@material/mwc-select/mwc-select-base";
import { styles } from "@material/mwc-select/mwc-select.css";
import { customElement, property } from "lit/decorators.js";

@customElement("polr-select")
export class PoLRSelect extends SelectBase {
    static override styles = [
        styles,
        css`
            :host {
                --mdc-select-idle-line-color,
                --mdc-select-hover-line-color: #ffffffff;
                --mdc-select-focused-dropdown-icon-color: var(--primary-text-color);
                --mdc-select-dropdown-icon-color: var(--primary-text-color);
            }

            .mdc-select__anchor {
                height: var(--select-height, 56px) !important;
                border-radius: var(--mdc-shape-small, 4px) !important;
                width: 100%;
            }

            .mdc-line-ripple::before, .mdc-line-ripple::after {
                border-bottom-style: none !important;
            }
        `,
    ];
}

declare global {
    interface HTMLElementTagNameMap {
        "polr-select": PoLRSelect;
    }
}
