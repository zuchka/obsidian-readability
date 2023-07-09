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

    if (
      (tr.isUserEvent("select") || userEventTypeUndefined) &&
      tr.newSelection.ranges[0].from !== tr.newSelection.ranges[0].to
    ) {
      let text = "";
      const selection = tr.newSelection.main;
      const textIter = tr.newDoc.iterRange(selection.from, selection.to);
      while (!textIter.done) {
        text = text + textIter.next().value;
      }
      this.plugin.statusBar.debounceStatusBarUpdate(text);
    } else if (
      tr.isUserEvent("input") ||
      tr.isUserEvent("delete") ||
      tr.isUserEvent("move") ||
      tr.isUserEvent("undo") ||
      tr.isUserEvent("redo") ||
      tr.isUserEvent("select")
    ) {
      const textIter = tr.newDoc.iter();
      let text = "";
      while (!textIter.done) {
        text = text + textIter.next().value;
      }

      this.plugin.statusBar.debounceStatusBarUpdate(text);
    }
  }

  addPlugin(plugin: Readability) {
    this.plugin = plugin;
    this.hasPlugin = true;
  }

  destroy() {}
}

export const editorPlugin = ViewPlugin.fromClass(EditorPlugin);
