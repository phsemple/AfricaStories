
export default class PageHandler {

    constructor(dataHandler) { // pass in the dataHandler
        this.dataHandler = dataHandler;    // access data for the pages.
        this.addEventListeners();
        this.drawPage();
    }

    addEventListeners() {

        // we delegate events from the #title-cards wrapper to the titlecard based on id in the event.
        const titleCards = document.querySelector('#title-cards');
        titleCards.addEventListener('click', event => {
            let titleCard = event.target.closest('.title-card');
            if (titleCard) {
                // Get the storyId from the data-id attribute
                const storyId = titleCard.dataset.id;

                // Get the base path (if any): Github uses basepath, local host does not.
                const basePath = window.location.pathname.includes('/AfricaStories') ? '/AfricaStories' : '';

                // Construct the URL with the storyId as a query parameter
                const currentUrl = window.location.origin; // Gets the base URL (e.g., http://127.0.0.1:8080)
                // const storyUrl = `${currentUrl}${basePath}/story.html?storyid=${storyId}`;
                const storyUrl = `/story/?storyid=${storyId}`;

                // Redirect to the constructed URL
                window.location.href = storyUrl;
            }
            
        })

    }

    // map the titles to an array then join to a long string and insert
    drawPage() {
        const titlesData = this.dataHandler.titlesData;
        const titlesHTML = titlesData.map(title =>
            `<div class=" title-card" data-id = "${title.id}">
                <img class="title-card-picture" src="${title.storyPath}"
                    alt="${title.title} Cover Image">
                <div class="title-card-title">${title.title}</div>
                <div class="title-card-level"">Level ${title.level}</div>
            </div>`).join('');
        
        const titleCards = document.querySelector('#title-cards');
        titleCards.innerHTML = titlesHTML;

    }
}



