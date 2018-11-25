class App {

  onUserSelect() {
    // we want the tooltip to show once the user
    // stops selecting
    document.onselectionchange = () => {
      document.onmouseup = () => {
        // Get user selection
        this.getSelectionDetails();
      }
    }
  }

  getSelectionDetails() {
    const selection = window.getSelection();
    // getting rid of whitespace at start & end of selection
    const selectionText = selection.toString().trim();
    if(!selectionText) return;
    // do something with selection
  }

  init() {
    this.onUserSelect();
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
});