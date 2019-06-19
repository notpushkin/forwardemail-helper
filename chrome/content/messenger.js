const ForwardemailHelper = {
  formatAuthor(author) {
    let match;
    if (match = /^<(.*)>$/.exec(author)) {
      return match[1];
    } else if (match = /^([^\s*])\s?</.exec(author)) {
      return match[1];
    } else {
      return author;
    }
  },

  handler: {
    getCellText: function(row, col) {
      const correspondentCol = (
        document.getElementById("threadTree")
        .columns["correspondentCol"]
        );
      const hdr = gDBView.getMsgHdrAt(row);
      if (/<no-reply@forwardemail.net>?/.test(hdr.mime2DecodedAuthor)) {
        return ForwardemailHelper.formatAuthor(
          hdr.getStringProperty("replyTo")
        );
      } else {
        return gDBView.getCellText(row, correspondentCol);
      }
    },
    getSortStringForRow: hdr => hdr.mime2DecodedAuthor,
    isString: () => true,

    getCellProperties: function(row, col, props) {},
    getRowProperties: function(row, props) {},
    getImageSrc: (row, col) => null,
    getSortLongForRow: hdr => 0
  },

  dbObserver: {
    // Components.interfaces.nsIObserver
    observe(aMsgFolder, aTopic, aData) {
      gDBView.addColumnHandler(
        "forwardemailHelperCol",
        ForwardemailHelper.handler
      );
    }
  },

  onLoad() {
    Services.obs.addObserver(
      ForwardemailHelper.dbObserver,
      "MsgCreateDBView",
      false
    );
  }
};


window.addEventListener("load", ForwardemailHelper.onLoad, false);
