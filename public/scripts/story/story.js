// ********** STORY PAGE SPECIFIC HANDLERS ***************
import DataHandler  from "./dataHandler.js";
import PageHandler from "./pageHandler.js";

// ***************** SHARED HANDLERS *********************
import AudioHandler from "../audioHandler.js";
import Controls from "../controls.js";     // controls for language, autoplay and playbackrate.

let storyId = null;

// We wait for our dynamic HTML to load before we can build out the handler classes
document.addEventListener("controlsLoaded", async () => {
    // Get the full URL
    const urlParams = new URLSearchParams(window.location.search);
    
    // Normalize the parameters to allow case-insensitivity
    const params = {};
    urlParams.forEach((value, key) => {
        params[key.toLowerCase()] = value;
    });

    storyId = params['storyid']; // This will work regardless of case
    
    const story = new Story(storyId);
    await story.initialize();  // this will fetch data, so we wait.
});

export default class Story {

    constructor(storyId, langCode) { 

        this.storyId = storyId;

        // We create the DataHandler shell, but we must use async to load data. 
        // That will be done when we initialize.
        this.controls = new Controls; // handles language, rate and autoplay requests
        this.dataHandler = new DataHandler(this.storyId, this.controls.langCode);
        this.pageHandler = null; // handling page drawing and paging.
        this.audioHandler = null; // sound and such.
    }

    // Asynchronous initialization. 
    async initialize() {
        await this.dataHandler.initialize(); // Wait for data to be fetched
        this.audioHandler = new AudioHandler();
        this.pageHandler = new PageHandler(this.dataHandler, this.audioHandler);

        // tell the controls where to find the handlers.
        this.controls.setHandlers(this.dataHandler,  this.pageHandler,this.audioHandler);
    }
    
}




