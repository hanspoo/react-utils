"use babel";

import { CompositeDisposable } from "atom";

import { destructure } from "./utils";

export default {
  subscriptions: null,

  activate(state) {
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(
      atom.commands.add("atom-workspace", {
        "react-utils:class-to-functional": () => this.classToFunctional(),
        "react-utils:destructure-props": () => this.destructureProps()
      })
    );
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  classToFunctional() {
    let editor;

    if ((editor = atom.workspace.getActiveTextEditor())) {
      let selection = editor.getSelectedText();
      const parts = selection
        .replace(/\n/g, "")
        .match(/class (\w+) .*return \((.*?)\)/);
      if (!parts) {
        alert("Formato inválido");
        return;
      }
      editor.insertText(`
        ${selection}

        const ${parts[1]} = (props) => (
          ${parts[2]}
        );
        export default ${parts[1]};
      `);
    }
  },

  destructureProps() {
    let editor;
    console.log("En destructureProps");

    if ((editor = atom.workspace.getActiveTextEditor())) {
      let selection = editor.getSelectedText();
      // editor.insertNewlineBelow();
      const destr = destructure(selection);
      editor.insertText(`
        ${selection}
        
        ${destr}
        `);
    }
  }
};
