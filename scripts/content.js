const API_KEY = 'd1a139c7-2cc9-4efb-99cd-5c339d14d200';

const getRequestUrl = word =>
  `https://www.dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=${API_KEY}`;

// setting non-changing options
tippy.setDefaults({
  // tooltip will be shown "manually"
  trigger: 'manual',
  // show tooltip immediately once the instance is created
  showOnInit: true,
  // don't hide tooltip when its reference is clicked
  hideOnClick: false,
  // showing arrow pointing to tooltip's reference
  arrow: true,
  // tooltip is interactive (clickable/hover'able')
  interactive: true
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
        // if we have a current selection, abort
        if (this.currentTooltip) return;

        // Get user selection
        this.currentTooltip = this.getSelectionDetails();

        // if no currentTooltip, abort
        if (!this.currentTooltip) return;
        // show tooltip with selection text
        this.showLookupButtonTooltip();
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
      // we check if there is a current selection
      if (this.currentTooltip && !this.isTooltip(event.target)) {
        this.currentTooltip._tippy.hide();
      }
    };
  }

  showLookupButtonTooltip() {
    const content = this.createLookupButton();

    tippy(this.currentTooltip, {
      content,
      // we destroy the tippy after it fully transitioned out
      onHidden(tip) {
        tip.destroy();
      },
      // we remove reference to the tippy at the start of transitioning
      onHide: () => {
        this.currentTooltip = null;
      }
    });
  }

  showDefinitionTooltip(reference) {
    tippy(reference, {
      content: 'Loading',
      onMount: () => {
        this.currentTooltip._tippy.hide();
        // setting the defintion tooltip as the current selection
        this.currentTooltip = reference;
      },
      async onShow(tip) {
        try {
          const response = await fetch(getRequestUrl(reference.text));
          const data = await response.json();
          if (tip.state.isVisible) {
            tip.setContent(data[0].shortdef.join(' '));
          }
        } catch (e) {
          tip.setContent('Oops! Not found');
        }
      },
      onHidden(tip) {
        tip.destroy();
      },
      onHide: () => {
        this.currentTooltip = null;
      }
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
    };

    return virtualReference;
  }

  /**
   * @description creates the lookup button to insert in tooltip
   * @param {string} selectionText - the selection text
   * @returns lookup button Node
   */
  createLookupButton() {
    const lookupButton = document.createElement('button');
    lookupButton.className = 'tippy-lookup-button';
    lookupButton.textContent = 'lookup?';
    lookupButton.addEventListener(
      'click',
      this.handleLookupClick.bind(this, this.currentTooltip),
      false
    );
    return lookupButton;
  }

  handleLookupClick(reference) {
    const virtualReference = {
      getBoundingClientRect: reference.getBoundingClientRect,
      clientHeight: reference.clientHeight,
      clientWidth: reference.clientWidth,
      text: reference.text
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
