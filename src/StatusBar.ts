import { debounce } from "obsidian";
import RemoveMarkdown from "remove-markdown";
import {syllable} from "syllable"
import {flesch} from 'flesch'
import { getWordCount, getSentenceCount } from "./utils";

export default class StatusBar {
  private statusBarEl: HTMLElement;
  public debounceStatusBarUpdate;

  constructor(statusBarEl: HTMLElement) {
    this.statusBarEl = statusBarEl;
    this.debounceStatusBarUpdate = debounce(
      (text: string) => this.updateStatusBar(text),
      20,
      false
    );

    this.statusBarEl.classList.add("mod-clickable");
    this.statusBarEl.setAttribute("aria-label", "!!!");
    this.statusBarEl.setAttribute("aria-label-position", "top");
    this.statusBarEl.addEventListener("click", (ev: MouseEvent) =>
      this.onClick(ev)
    );
  }

  onClick(ev: MouseEvent) {
    ev;
  }

  displayText(text: string) {
    this.statusBarEl.setText(text);
  }

  async updateStatusBar(text: string) {
    const plainText = RemoveMarkdown(text, {
      stripListLeaders: true , // strip list leaders (default: true)
      listUnicodeChar: '',     // char to insert instead of stripped list leaders (default: '')
      gfm: true,                // support GitHub-Flavored Markdown (default: true)
      useImgAltText: true      // replace images with alt-text, if present (default: true)
    });

    const syllables = syllable(plainText)
    const words = getWordCount(plainText)
    const sentences = getSentenceCount(plainText)
    const fleschCount = flesch({sentence: sentences, word: words, syllable: syllables})
    const rounded = Math.round(fleschCount * 100) / 100

    let output = ''
    switch (true) {
      case (90 <= rounded):
        output = rounded + ', or "very easy to read"'
        break;
      case (80 <= rounded):
        output = rounded + ', or "easy to read"'
        break;
      case (70 <= rounded):
        output = rounded + ', or "fairly easy to read"'
        break;
      case (60 <= rounded):
        output = rounded + ', or "plain English"'
        break;  
      case (50 <= rounded):
        output = rounded + ', or "fairly difficult to read"'
        break;
      case (30 <= rounded):
        output = rounded + ', or "difficult to read"'
        break;
      case (10 <= rounded):
        output = rounded + ', or "very difficult to read"'
        break;      
    }
    this.displayText(output);
  }
}
