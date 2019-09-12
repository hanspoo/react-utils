"use babel";

import ReactUtilsView from "./react-utils-view";
import { CompositeDisposable } from "atom";

import { destructure } from "./utils";

export default {
  reactUtilsView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.reactUtilsView = new ReactUtilsView(state.reactUtilsViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.reactUtilsView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(
      atom.commands.add("atom-workspace", {
        "react-utils:toggle": () => this.toggle(),
        "react-utils:class-to-functional": () => this.classToFunctional(),
        "react-utils:destructure-props": () => this.destructureProps()
      })
    );
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.reactUtilsView.destroy();
  },

  serialize() {
    return {
      reactUtilsViewState: this.reactUtilsView.serialize()
    };
  },

  toggle() {
    console.log("ReactUtils was toggled!");
    return this.modalPanel.isVisible()
      ? this.modalPanel.hide()
      : this.modalPanel.show();
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
      editor.insertNewlineBelow();
      editor.insertText(destructure(selection));
    }
  }
};
