(function() {
    // Wait for DOM content to be loaded if not already
    function init() {
        const sliders = document.querySelectorAll('.range-container input[type="range"]');

        sliders.forEach(slider => {
            let isDragging = false;
            let startX = 0;
            let startValue = 0;

            const tooltip = slider.parentElement.querySelector('.range-tooltip');
            const updateTooltip = () => {
                if (slider.id && slider.id.indexOf('custom-cut') !== -1 && slider.id.indexOf('roundness') === -1) {
                    if (tooltip) {
                        const val = parseFloat(slider.value);
                        tooltip.textContent = (val * 100).toFixed(1) + '%';
                    }
                }
            };

            slider.addEventListener('input', updateTooltip);
            slider.addEventListener('change', updateTooltip);
            setTimeout(updateTooltip, 0);

            const startDrag = (e) => {
                // Prevent default browser behavior (jumping to click position)
                e.preventDefault();
                
                isDragging = true;
                
                // Get starting X position (supports mouse and touch)
                startX = e.clientX || e.touches[0].clientX;
                
                // Store the current slider value so we move relative to it
                startValue = parseFloat(slider.value);
                
                slider.style.cursor = 'grabbing';
                document.body.style.cursor = 'grabbing';
            };

            const onDrag = (e) => {
                if (!isDragging) return;

                // Get current X position
                const currentX = e.clientX || (e.touches ? e.touches[0].clientX : 0);
                
                // Calculate how far we moved in pixels
                const deltaX = currentX - startX;
                
                // Get slider dimensions to map pixels to values
                const rect = slider.getBoundingClientRect();
                const rangeWidth = rect.width;
                
                // Calculate value range (max - min)
                const min = parseFloat(slider.min);
                const max = parseFloat(slider.max);
                const rangeScale = max - min;

                // Convert pixel movement to value movement
                const deltaValue = (deltaX / rangeWidth) * rangeScale;

                // Update the slider value
                let newValue = startValue + deltaValue;
                
                // Clamp value
                newValue = Math.max(min, Math.min(max, newValue));

                // Apply to slider
                slider.value = newValue;
                
                // Dispatch input event so other listeners (Page.Range, custom controls) update
                slider.dispatchEvent(new Event('input'));
            };

            const stopDrag = () => {
                if (isDragging) {
                    isDragging = false;
                    slider.style.cursor = 'grab';
                    document.body.style.cursor = '';
                    // Dispatch change event
                    slider.dispatchEvent(new Event('change'));
                }
            };

            // Attach Events to the Slider
            slider.addEventListener('mousedown', startDrag);
            slider.addEventListener('touchstart', startDrag, { passive: false });

            // Attach Events to Window (to handle dragging outside the element)
            window.addEventListener('mousemove', onDrag);
            window.addEventListener('touchmove', onDrag, { passive: false });
            
            window.addEventListener('mouseup', stopDrag);
            window.addEventListener('touchend', stopDrag);
            
            // Initialize cursor
            slider.style.cursor = 'grab';
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();