(function() {
    // This script intercepts Page.Range.addObserver for Custom Cut sliders
    // to enable LIVE rendering during drag with a time-based debounce.
    // This avoids hammering the GPU with shader recompilations.

    if (typeof Page === 'undefined' || !Page.Range) {
        console.error("Page.Range not found.");
        return;
    }

    const originalAddObserver = Page.Range.addObserver;
    
    // Debounce interval (ms) — limits rebuilds to ~12/sec during drag.
    // Tuned for smooth feel without overwhelming the GPU shader compiler.
    const DEBOUNCE_MS = 8;

    const paramMap = {
        'custom-cut-crown-height-range-id': 'customCutCrownHeight',
        'custom-cut-crown-table-range-id': 'customCutCrownTable',
        'custom-cut-crown-ratio-range-id': 'customCutCrownRatio',
        'custom-cut-girdle-thickness-range-id': 'customCutGirdleThickness',
        'custom-cut-girdle-roundness-range-id': 'customCutGirdleRoundess',
        'custom-cut-pavillion-height-range-id': 'customCutPavillionHeight',
        'custom-cut-pavillion-ratio-range-id': 'customCutPavillionRati'
    };

    // Shared debounce timer across all custom-cut sliders
    let debounceTimer = null;
    let latestCallback = null;
    let latestValue = 0;

    // Override the addObserver function
    Page.Range.addObserver = function(elementId, callback) {
        
        // If it's a "Custom Cut" slider, use live rendering with debounce
        if (paramMap[elementId]) {
            const slider = document.getElementById(elementId);
            
            if (slider) {
                // INPUT event (DRAG) — debounced rebuild
                slider.addEventListener('input', function() {
                    latestCallback = callback;
                    latestValue = parseFloat(this.value);

                    // Reset the debounce timer on each input
                    if (debounceTimer !== null) {
                        clearTimeout(debounceTimer);
                    }
                    debounceTimer = setTimeout(function() {
                        debounceTimer = null;
                        latestCallback(latestValue);
                    }, DEBOUNCE_MS);
                });

                // CHANGE event (DROP) — immediate final flush
                slider.addEventListener('change', function() {
                    // Cancel any pending debounce
                    if (debounceTimer !== null) {
                        clearTimeout(debounceTimer);
                        debounceTimer = null;
                    }
                    callback(parseFloat(this.value));
                });
            }
        } else {
            // Standard behavior for other sliders
            originalAddObserver(elementId, callback);
        }
    };
})();