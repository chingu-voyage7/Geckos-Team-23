// setting non-changing options
tippy.setDefaults({
  // tooltip will be shown "manually"
  trigger: "manual",
  // show tooltip immediately once the instance is created
  showOnInit: true,
  // don't hide tooltip when its reference is clicked
  hideOnClick: false,
  // showing arrow pointing to tooltip's reference
  arrow: true,
  // tooltip is interactive (clickable/hover'able')
  interactive: true,
});

class App {

  constructor() {
    this.currentSelection = null;
  }

  onUserSelect() {
    // we want the tooltip to show once the user
    // stops selecting
    document.onselectionchange = () => {
      document.onmouseup = () => {
        // Get user selection
        this.currentSelection = this.getSelectionDetails();

        // if no currentSelection, abort
        if(!this.currentSelection) return;
        // Do something with currentSelection
      }
    }
  }

  getSelectionDetails() {
    const selection = window.getSelection();
    // getting rid of whitespace at start & end of selection
    const selectionText = selection.toString().trim();
    if(!selectionText) return;
    // get selection virtual reference

    const selectionRange = selection.getRangeAt(0);

    // getBoundingClientRect will trigger the browser
    // to calculate style and layout, a bit of performance bottleneck
    // read about here:
    // https://gist.github.com/paulirish/5d52fb081b3570c81e3a
    const selectionRect = selectionRange.getBoundingClientRect();

    const virtualReference = {
      getBoundingClientRect() {
        return selectionRect;
      },
      clientHeight: selectionRect.height,
      clientWidth: selectionRect.width,
      text: selectionText
    }

    return virtualReference;
  }

  init() {
    this.onUserSelect();
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
});