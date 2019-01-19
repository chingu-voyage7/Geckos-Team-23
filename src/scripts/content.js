// setting default options for tippy.js tooltip
tippy.setDefaults({
  trigger: "manual",
  showOnInit: true,
  hideOnClick: false,
  arrow: true,
  interactive: true,
});

class App {
  constructor() {
    this.currentTooltip = null;
  }

  onUserSelect() {
    // we want the tooltip to show once the user
    // stops selecting
    document.onselectionchange = () => {
      document.onmouseup = () => {
        // if we have a current tooltip, abort
        if (this.currentTooltip) return;

        // Get user selection
        this.currentTooltip = this.getSelectionDetails();

        // if no currentTooltip, abort
        if (!this.currentTooltip) return;
        // show lookup tooltip with selection text
        this.showLookupTooltip();
      };
    };
  }

  onUserUnselect() {
    // we hide the tooltip on mousedown
    // because if we did it on click
    // it'll hide immediately, since click event
    // also triggers the mouseup event where we
    // show the tooltip
    document.onmousedown = event => {
      // we check if there is a current tooltip
      if (this.currentTooltip && !this.isTooltip(event.target)) {
        this.currentTooltip._tippy.hide();
      }
    };
  }

  showLookupTooltip() {
    const content = this.createLookupButton(this.currentTooltip.text);

    tippy(this.currentTooltip, {
      content,
      theme: "material",
      // destroy tippy after it fully transitions out
      onHidden(tip) {
        tip.destroy();
      },
      // remove reference to the tippy at the start of transitioning
      onHide: () => {
        this.currentTooltip = null;
      },
    });
  }

  showDefinitionTooltip(reference) {
    tippy(reference, {
      content: "Loading",
      theme: "material",
      onMount: () => {
        this.currentTooltip._tippy.hide();
        // setting the defintion tooltip as the current tooltip
        this.currentTooltip = reference;
      },
      async onShow(tip) {
        chrome.runtime.sendMessage({ word: tip.reference.text }, response => {
          tip.setContent(response.response);
        });
      },
      onHidden(tip) {
        tip.destroy();
      },
      onHide: () => {
        this.currentTooltip = null;
      },
    });
  }

  /**
   * check if given node is tooltip itself or its child
   */
  isTooltip(node) {
    return this.currentTooltip._tippy.popper.contains(node);
  }

  getSelectionDetails() {
    const selection = window.getSelection();
    // getting rid of whitespace at start & end of selection
    const selectionText = selection.toString().trim();
    if (!selectionText) return;
    // get selection virtual reference

    const selectionRange = selection.getRangeAt(0);

    //get current selelction 
    const selectionRect = selectionRange.getBoundingClientRect();

    const virtualReference = {
      getBoundingClientRect() {
        return selectionRect;
      },
      clientHeight: selectionRect.height,
      clientWidth: selectionRect.width,
      text: selectionText,
    };

    return virtualReference;
  }

  /**
   * @description creates the lookup button to insert in tooltip
   * @param {string} selectionText - the selection text
   * @returns lookup button Node
   */
  createLookupButton(selectionText) {
    const lookupButton = document.createElement("button");
    lookupButton.className = "tippy-lookup-button";
    lookupButton.textContent = "lookup?";
    lookupButton.addEventListener(
      "click",
      this.handleLookupClick.bind(this, this.currentTooltip),
      false,
    );
    return lookupButton;
  }

  handleLookupClick(reference) {
    const virtualReference = {
      getBoundingClientRect: reference.getBoundingClientRect,
      clientHeight: reference.clientHeight,
      clientWidth: reference.clientWidth,
      text: reference.text,
    };
    this.showDefinitionTooltip(virtualReference);
  }

  init() {
    this.onUserSelect();

    this.onUserUnselect();
  }
}

const app = new App();
app.init();
