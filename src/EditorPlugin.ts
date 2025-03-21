import { Transaction } from "@codemirror/state";
import {
  ViewUpdate,
  PluginValue,
  EditorView,
  ViewPlugin,
} from "@codemirror/view";
import type Readability from "src/main";

class EditorPlugin implements PluginValue {
  hasPlugin: boolean;
  view: EditorView;
  private plugin: Readability;

  constructor(view: EditorView) {
    this.view = view;
    this.hasPlugin = false;
  }

  update(update: ViewUpdate): void {
    if (!this.hasPlugin) {
      return;
    }

    const tr = update.transactions[0];

    if (!tr) {
      return;
    }

    const userEventTypeUndefined =
      tr.annotation(Transaction.userEvent) === undefined;

    try {
      if (
        (tr.isUserEvent("select") || userEventTypeUndefined) &&
        tr.newSelection.ranges[0].from !== tr.newSelection.ranges[0].to
      ) {
        // Handle selected text
        const selection = tr.newSelection.main;
        const text = tr.newDoc.sliceString(selection.from, selection.to);
        this.plugin.statusBar.debounceStatusBarUpdate(text);
      } else if (
        tr.isUserEvent("input") ||
        tr.isUserEvent("delete") ||
        tr.isUserEvent("move") ||
        tr.isUserEvent("undo") ||
        tr.isUserEvent("redo") ||
        tr.isUserEvent("select")
      ) {
        // Handle full document
        const text = tr.newDoc.toString();
        this.plugin.statusBar.debounceStatusBarUpdate(text);
      }
    } catch (error) {
      console.error('Error processing editor update:', error);
      this.plugin.statusBar.displayText('r9y: error processing text');
    }
  }

  addPlugin(plugin: Readability) {
    this.plugin = plugin;
    this.hasPlugin = true;
  }

  destroy() {}
}

export const editorPlugin = ViewPlugin.fromClass(EditorPlugin);
