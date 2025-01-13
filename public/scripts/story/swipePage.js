
// Event handler for right/left swipe. The previousPage/nextPage are callback to Page Handling.
export default function setupPageSwipe( previousPage, nextPage ) {

    let startX = 0;
    let startY = 0;
    let isSwiping = false;

    // Minimum distance threshold to consider it a swipe
    const minSwipeDistance = 50;

    document.addEventListener('touchstart', (e) => {
        // Record the starting position of the touch
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        isSwiping = true;
    });

    document.addEventListener('touchmove', (e) => {
        if (!isSwiping) return;

        const currentX = e.touches[0].clientX;
        const currentY = e.touches[0].clientY;

        // Check if the movement is more horizontal than vertical
        if (Math.abs(currentX - startX) > Math.abs(currentY - startY)) {
            e.preventDefault(); // Prevent scrolling during horizontal swipe
        }
    });

    document.addEventListener('touchend', (e) => {
        if (!isSwiping) return;
        isSwiping = false;

        const endX = e.changedTouches[0].clientX;
        const distanceX = endX - startX;

        if (Math.abs(distanceX) >= minSwipeDistance) {
            if (distanceX > 0) {
                previousPage();
            } else {
                nextPage();
            }
        }
    });
    
}
