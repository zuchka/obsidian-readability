import { debounce } from "obsidian";
import RemoveMarkdown from "remove-markdown";
import {syllable} from "syllable"
import {flesch} from 'flesch'
import { getWordCount, getSentenceCount, formatFRE } from "./utils";

const MAX_PROCESSABLE_LENGTH = 10 * 1024 * 1024; // 10MB limit

export default class StatusBar {
  private statusBarEl: HTMLElement;
  public debounceStatusBarUpdate;

  constructor(statusBarEl: HTMLElement) {
    this.statusBarEl = statusBarEl;
    this.debounceStatusBarUpdate = debounce(
      (text: string) => this.updateStatusBar(text),
      50, // Increased debounce time for larger texts
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
    // Only check for extreme cases that could crash the browser
    if (text.length > MAX_PROCESSABLE_LENGTH) {
      this.displayText('r9y: text exceeds 10MB limit');
      return;
    }

    try {
      // Show processing indicator for large texts
      if (text.length > 1000000) { // 1MB
        this.displayText('r9y: processing large text...');
      }

      const plainText = RemoveMarkdown(text, {
        stripListLeaders: true,
        listUnicodeChar: '',
        gfm: true,
        useImgAltText: true
      });

      const syllables = syllable(plainText);
      const words = getWordCount(plainText);
      const sentences = getSentenceCount(plainText);
      
      // Adjust limits for much larger texts
      if (words > 500000 || sentences > 50000) { // ~1000 pages of text
        this.displayText('r9y: text exceeds processing limits (>500k words)');
        return;
      }

      const fleschCount = flesch({sentence: sentences, word: words, syllable: syllables});
      const output = formatFRE(fleschCount);
      
      this.displayText(output);
    } catch (error) {
      console.error('Error processing text:', error);
      this.displayText('r9y: error processing text');
    }
  }
}
