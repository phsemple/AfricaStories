// ********************** SHARED HTML CODE ***************************
// Load the partial file: controls.HTML into the home and story pages.

document.addEventListener('DOMContentLoaded', async () => {

    await fetch('public/partials/controls.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load controls.html');
            }
            return response.text();
        })
        .then(data => {
            document.getElementById('controls-container').innerHTML = data;
        })
        .catch(error => {
            console.error('Error loading controls:', error);
        });
    
        document.dispatchEvent(new Event('controlsLoaded')); // let others know.
});