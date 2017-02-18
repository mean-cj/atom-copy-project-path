"use babel";
import {$, CompositeDisposable} from "atom";
import path from "path";

module.exports = new class {

  constructor() {
    this.config = {};
  }

  activate() {
    this.subscriptions = new CompositeDisposable();
    this.subscriptions.add(atom.commands.add("atom-workspace", {
      "copy-project-relative-path": (e) => this.copyProjectRelativePath(e),
      "copy-full-path": (e) => this.copyFullPath(e),
      "get-path": (e) => this.getPath(e),
      "get-path:forlang": (e) => this.getPathForLang(e)
    }));
  }




  deactivate() {
    this.subscriptions.dispose();
  }

  getTargetEditorPath(e) {
    var elTarget;
    if (e.target.classList.contains("title")) {
      elTarget = e.target;
    } else {
      for (let i = 0; i < 100; i++) {
        const el = e.target.parentElement;
        if (el && el.classList.contains("tab")) {
          elTarget = el.querySelector(".title");
        }
      }
    }
    if (elTarget) {
      return elTarget.dataset.path;
    }
    return atom.workspace.getActiveTextEditor().getPath();
  }

  getProjectRelativePath(p) {
    [projectPath, relativePath] = atom.project.relativizePath(p);
    return relativePath;
  }

  copyProjectRelativePath(e) {
    atom.clipboard.write(this.getProjectRelativePath(this.getTargetEditorPath(e)));
  }

  copyFullPath(e) {
    atom.clipboard.write(this.getTargetEditorPath(e));
  }

	getPath(e) {
		var editor = atom.workspace.getActiveTextEditor();
		var filepath = this.getProjectRelativePath(this.getTargetEditorPath(e));
//		var item = atom.workspace.getActivePaneItem();
//		var filePath = item.getPath();
		//filePath = path.dirname(filePath);
		editor.insertText(filepath);
	}

	getPathForLang(e) {
		var editor = atom.workspace.getActiveTextEditor();
		var filepath = this.getProjectRelativePath(this.getTargetEditorPath(e));

		filepath = filepath.toLowerCase().replace(/\\/g,'/').replace(/.*(controllers|views)\//g,'').replace(/(controller\.php|\.blade\.php)/g,'');
		editor.insertText("@lang(\""+filepath+".\")");
	}

}
