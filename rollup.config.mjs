import nodeResolve from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import typescript2 from "rollup-plugin-typescript2";
import terser from "@rollup/plugin-terser";
import ignore from "./rollup-plugins/rollup-ignore-plugin.js";

const dev = process.env.ROLLUP_WATCH;

const IGNORED_FILES = [
    "@material/mwc-ripple/mwc-ripple.js",
    "@material/mwc-notched-outline/mwc-notched-outline.js",
    "@material/mwc-list/mwc-list.js",
    "@material/mwc-list/mwc-list-item.js",
    "@material/mwc-menu/mwc-menu-surface.js",
    "@material/mwc-menu/mwc-menu.js",
    "@material/mwc-icon/mwc-icon.js",
    "@material/mwc-tab/mwc-tab.js",
    "@material/mwc-tab-indicator/mwc-tab-indicator.js",
    "@material/mwc-tab-scroller/mwc-tab-scroller.js",
];

export default {
    input: "src/main.ts",
    output: {
        file: "polr-ytube-media-card.js",
        format: "es",
        inlineDynamicImports: true,
    },
    plugins: [
        ignore({
            files: IGNORED_FILES.map((file) => require.resolve(file)),
        }),
        nodeResolve(),
        json(),
        commonjs(),
        typescript2(),
        babel({
            babelHelpers: 'bundled',
            exclude: "node_modules/**"
        }),
        !dev && terser(),
    ],
};