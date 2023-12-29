import { SelectBase } from "@material/mwc-select/mwc-select-base";
import { styles } from "@material/mwc-select/mwc-select.css";
import { customElement, property } from "lit/decorators.js";

@customElement("polr-select")
export class PoLRSelect extends SelectBase {
    static override styles = [styles];
}

declare global {
    interface HTMLElementTagNameMap {
        "polr-select": PoLRSelect;
    }
}
