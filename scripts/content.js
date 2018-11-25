class App {

  onUserSelect() {
    // we want the tooltip to show once the user
    // stops selecting
    document.onselectionchange = () => {
      document.onmouseup = () => {
        // Get user selection
      }
    }
  }

  init() {
    this.onUserSelect();
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
});