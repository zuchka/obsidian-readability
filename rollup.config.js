import typescript from "@rollup/plugin-typescript";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";

export default {
  input: "src/main.ts",
  output: {
    dir: "./",
    sourcemap: "inline",
    format: "cjs",
    exports: "default",
  },
  external: [
    "obsidian",
    "electron",
    "codemirror",
    "@codemirror/autocomplete",
    "@codemirror/closebrackets",
    "@codemirror/collab",
    "@codemirror/commands",
    "@codemirror/comment",
    "@codemirror/fold",
    "@codemirror/gutter",
    "@codemirror/highlight",
    "@codemirror/history",
    "@codemirror/language",
    "@codemirror/lint",
    "@codemirror/matchbrackets",
    "@codemirror/panel",
    "@codemirror/rangeset",
    "@codemirror/rectangular-selection",
    "@codemirror/search",
    "@codemirror/state",
    "@codemirror/stream-parser",
    "@codemirror/text",
    "@codemirror/tooltip",
    "@codemirror/view",
    "@lezer/common",
    "@lezer/lr",
  ],
  plugins: [
    typescript(),
    nodeResolve({ browser: true }),
    commonjs(),
    json(),
  ],
};
