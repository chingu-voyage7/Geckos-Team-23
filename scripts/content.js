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
        // if we have a current selection, abort
        if(this.currentSelection) return;

        // Get user selection
        this.currentSelection = this.getSelectionDetails();

        // if no currentSelection, abort
        if(!this.currentSelection) return;
        // show tooltip with selection text
        this.showTooltip();
      }
    }
  }

  onUserUnselect() {
    // we hide the tooltip on mousedown
    // because if we did it on click
    // it'll hide immediately, since click event
    // also triggers the mouseup event where we
    // show the tooltip
    document.onmousedown = event => {
      // we check if there is a current selection
      if(this.currentSelection && !this.isTooltip(event.target)) {
        this.currentSelection._tippy.hide();
        this.currentSelection = null;
      }
    }
  }

  showTooltip() {
    const content = createLookupButton(
      this.currentSelection.text);

    tippy(this.currentSelection, {
      content
    });
  }

  /**
   * check if given node is tooltip itself or its child
   */
  isTooltip(node) {
    return this.currentSelection
      ._tippy.popper.contains(node);
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

    this.onUserUnselect();
  }
}

const app = new App();
app.init();

/*=========== Utils ============*/

/**
 * @description creates the lookup button to insert in tooltip
 * @param {string} selectionText - the selection text
 * @returns lookup button Node
 */
function  createLookupButton(selectionText) {
  const lookupButton = document.createElement('button');
  lookupButton.className = 'tippy-lookup-button';
  lookupButton.textContent = 'lookup?';
  lookupButton.addEventListener('click', event => {
    // Do something on lookup button click

  }, false);
  return lookupButton;
}
