
// *************  HOME PAGE SPECIFIC HANDLER **************
import DataHandler  from "./dataHandler.js";      // this is the home page datahandler
import PageHandler  from "./pageHandler.js";      // audio handler is shared with home and story page.

// *************  SHARED HANDLERS **************.
import Controls     from "../controls.js";        // shared controls for language, autoplay and playbackrate.


// Create the Home page and setup the listener for clicks on the titles.
// We wait for the dynamic load of the Controls html.
document.addEventListener("controlsLoaded", async () => {
    const homePage = new HomePage(); 
    await homePage.initialize();  // this will fetch data, so we wait.
});


export default class HomePage {

    constructor() { 

        // We create the DataHandler shell, but we must use async to load data. 
        // That will be done when we initialize.
        // The language will be determined by the Controls. It will read the 
        // localStorage, or use a default value.
        this.controls = new Controls; // handles language, rate and autoplay requests
        this.dataHandler = new DataHandler(this.controls.langCode);
        this.pageHandler = null;
    }

    // Asynchronous initialization. 
    async initialize() {

        await this.dataHandler.initialize();      // Wait for data to be fetched
        this.pageHandler = new PageHandler(this.dataHandler);

        // We can't build the audioHandler on the Home Page because there are no 
        // audio control element on the html so instantiation fails. We don't need
        // it in any case on the home page.
        //this.audioHandler = new AudioHandler();   

        // tell the controls where to find the handlers.
        this.controls.setHandlers(this.dataHandler, this.pageHandler, null);
    }
    
}








