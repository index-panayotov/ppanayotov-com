// editorjs-config.ts
// Centralized Editor.js configuration for the system

import EditorJS, { EditorConfig } from "@editorjs/editorjs";

const editorJsConfig: EditorConfig = {
  /**
   * Holder ID or element for Editor.js
   * You can override this in each instance
   */
  holder: "editorjs",
  /**
   * Tools can be extended here (add plugins as needed)
   */
  tools: {},
  /**
   * Placeholder text
   */
  placeholder: "Write something...",
  /**
   * Inline toolbar
   */
  inlineToolbar: true
};

export default editorJsConfig;
