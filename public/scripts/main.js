
// import Story from './storyPage.js';
import DataHandler from "./dataHandler.js";
import PageHandler from "./pageHandler.js";
import AudioHandler from "./audioHandler.js";
import Controls from "./controls.js"; // controls for language, autoplay and playbackrate.

let story = null;

// Run the initializations after loaded.
document.addEventListener("DOMContentLoaded", async () => {

    // Get the full URL
    const urlParams = new URLSearchParams(window.location.search);
    const storyId = urlParams.get('storyId');
    const language = urlParams.get('language');
    
    story = new Story(storyId, language);  // start at page 1
    await story.initialize();  // this will fetch data, so we wait.

});


export default class Story {

    constructor(storyId, langCode) { 

        this.storyId = storyId;

        // We create the DataHandler shell, but we must us async to load data. 
        // That will be done when we initialize.
        this.dataHandler = new DataHandler(this.storyId, langCode);
        this.pageHandler = null; // handling page drawing and paging.
        this.audioHandler = null; // sound and such.
        this.controls = null; // handles language, rate and autoplay requests
    }

    // Asynchronous initialization. 
    async initialize() {
        await this.dataHandler.initialize(); // Wait for data to be fetched
        this.audioHandler = new AudioHandler();
        this.pageHandler = new PageHandler(this.dataHandler, this.audioHandler);
        this.controls = new Controls(this.dataHandler,this.audioHandler, this.pageHandler)
    }
    
}




