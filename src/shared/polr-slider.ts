import { Slider } from "@material/web/slider/internal/slider.js";
import { styles } from "@material/web/slider/internal/slider-styles.css";
import { customElement, property } from "lit/decorators.js";

@customElement("polr-slider")
export class PoLRSlider extends Slider {
    static override styles = [styles];
}

declare global {
    interface HTMLElementTagNameMap {
        "polr-slider": PoLRSlider;
    }
}
