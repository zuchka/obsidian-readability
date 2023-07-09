import { Plugin, WorkspaceLeaf } from "obsidian";
import StatusBar from "./StatusBar";
import type { EditorView } from "@codemirror/view";
import { editorPlugin } from "./EditorPlugin";

export default class Readability extends Plugin {
  public statusBar: StatusBar;

  async onunload(): Promise<void> {
    this.statusBar = null;
  }

  async onload() {
    // Handle Status Bar
    let statusBarEl = this.addStatusBarItem();
    this.statusBar = new StatusBar(statusBarEl);

    // Handle the Editor Plugin
    this.registerEditorExtension(editorPlugin);

    this.app.workspace.onLayoutReady(() => {
      this.giveEditorPlugin(this.app.workspace.getMostRecentLeaf());
    });

    this.registerEvent(
      this.app.workspace.on(
        "active-leaf-change",
        async (leaf: WorkspaceLeaf) => {
          this.giveEditorPlugin(leaf);
          if (leaf.view.getViewType() !== "markdown") {
            this.statusBar.updateStatusBar('');
          }

        }
      )
    );
  }

  giveEditorPlugin(leaf: WorkspaceLeaf): void {
    //@ts-expect-error, not typed
    const editor = leaf?.view?.editor;
    if (editor) {
      const editorView = editor.cm as EditorView;
      const editorPlug = editorView.plugin(editorPlugin);
      editorPlug.addPlugin(this);
      //@ts-expect-error, not typed
      const data: string = leaf.view.data;
      this.statusBar.updateStatusBar(data);
    }
  }
}
