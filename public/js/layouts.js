(function (window, document) {

    // Expose as `Pure.trackLayoutDownload()`
    (window.Pure || (window.Pure = {})).trackLayoutDownload = trackLayoutDownload;

    var HAS_DOWNLOAD_ATTR = 'download' in document.createElement('a');

    function trackLayoutDownload(layoutName) {
        var ga   = window.ga,
            link = this;

        // Quit early if Google Analytics isn't on the page.
        if (!ga) { return; }

        // Fire off the GA ping to track the download event.
        ga('send', 'event', 'layouts', 'download', layoutName);

        // If the browser does not support the HTML5 `download` attribute give
        // the GA ping some time to complete before starting the download.
        if (!HAS_DOWNLOAD_ATTR) {
            setTimeout(function () {
                window.location.href = link.href;
            }, 100);

            // Prevent default.
            return false;
        }
    }

}(this, this.document));
