import { html, css, nothing } from "lit";
import { TextFieldBase } from "@material/mwc-textfield/mwc-textfield-base";
import { styles } from "@material/mwc-textfield/mwc-textfield.css";
import { customElement, property } from "lit/decorators.js";

@customElement("polr-textfield")
export class PoLRTextfield extends TextFieldBase {
    // @ts-ignore
    @property({ type: Boolean }) public icon?: boolean;

    protected override renderLeadingIcon() {
        if (!this.icon) {
            return html``;
        }

        return html`<span class="mdc-textfield__icon"
            ><slot name="icon"></slot
        ></span>`;
    }

    static override styles = [
        styles,
        css`
            .mdc-text-field--outlined {
                height: var(--textfield-height, 56px) !important;
                overflow: visible;
            }
            .mdc-textfield__icon {
                --mdc-icon-size: 12px;
                padding: 8px;
            }
        `,
    ];
}

declare global {
    interface HTMLElementTagNameMap {
        "polr-textfield": PoLRTextfield;
    }
}
