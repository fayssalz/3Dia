(function() {
    // This script intercepts Page.Range.addObserver to implement conditional lazy updates.
    // It must be loaded AFTER page.min.js and BEFORE main.min.js.

    if (typeof Page === 'undefined' || !Page.Range) {
        console.error("Page.Range not found. Ensure page.min.js is loaded before smart-slider-observer.js");
        return;
    }

    const originalAddObserver = Page.Range.addObserver;
    const originalAddLazyObserver = Page.Range.addLazyObserver;
    const GEOMETRY_ONLY_CHECKBOX_ID = "only-normals-checkbox-id";

    // Override the addObserver function
    Page.Range.addObserver = function(elementId, callback) {
        // Check if the slider is one of the custom cut controls
        if (elementId && elementId.indexOf('custom-cut') !== -1) {
            
            // Wrapper for the 'input' event (continuous update during drag)
            const inputWrapper = function(value) {
                let isGeometryOnly = false;
                try {
                    isGeometryOnly = Page.Checkbox.isChecked(GEOMETRY_ONLY_CHECKBOX_ID);
                } catch (e) {
                    // Ignore errors if checkbox is missing or not initialized
                }

                // Only update continuously if "Geometry only" is checked (fast rendering)
                if (isGeometryOnly) {
                    callback(value);
                }
            };

            // Wrapper for the 'change' event (update on release)
            const changeWrapper = function(value) {
                let isGeometryOnly = false;
                try {
                    isGeometryOnly = Page.Checkbox.isChecked(GEOMETRY_ONLY_CHECKBOX_ID);
                } catch (e) {}

                // Update on release if "Geometry only" is NOT checked (slow rendering)
                if (!isGeometryOnly) {
                    callback(value);
                }
            };

            // Register the wrappers
            originalAddObserver(elementId, inputWrapper);
            originalAddLazyObserver(elementId, changeWrapper);

        } else {
            // For all other sliders, use the default behavior
            originalAddObserver(elementId, callback);
        }
    };
})();