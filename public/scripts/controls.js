// Handle menu for language, readback rate and autoplay

import AudioHandler from "./audioHandler.js";
import PageHandler from "./pageHandler.js";

const languages = [
    { code: 'sw', language: 'Swahili' },
    { code: 'en', language: 'English' },
    { code: 'fr', language: 'French' },
];

export default class Controls {

    constructor( dataHandler, audioHandler, pageHandler) {

        this.dataHandler = dataHandler;  // we will reload data if language changes.
        this.audioHandler = audioHandler; // we will set playback rate if it changes.
        this.pageHandler = pageHandler; 

        // get/set the drop down for language
        this.dropdownLanguage = document.getElementById('language')
        this.langCode = this.dropdownLanguage.value.toLowerCase();  // two character code
        this.language = languages.find(lang => lang.code === this.langCode).language;
        this.dropdownLanguage.text = this.language;   // set the dropdown menu

        // get checkbox for autoplay
        this.checkboxAutoplay = document.getElementById('autoplay');
        this.setAutoplay();

        // get playback rate dropdow.
        this.dropdownRate = document.getElementById('rate');
        this.setPlaybackRate(this.dropdownRate.value);
  
        this.addEventHandlers();

    }

    addEventHandlers() {

        this.checkboxAutoplay.addEventListener('change', this.toggleAutoplay.bind(this));
        this.dropdownRate.addEventListener('change',  this.setPlaybackRate.bind(this));
        this.dropdownLanguage.addEventListener('change',  this.switchLanguage.bind(this));

    }

    toggleAutoplay()
    {
        // we see this after the change
        if (this.checkboxAutoplay.checked) {
            this.checkboxAutoplay.checked = true;
        }
        else {
            this.checkboxAutoplay.checked = false; 
        }
        this.setAutoplay(); 
    }
    
    setAutoplay() {
        this.audioHandler.setAutoplay(this.checkboxAutoplay.checked);
    }

    setPlaybackRate() {
        const rate = this.dropdownRate.value;
        this.audioHandler.setPlaybackRate(rate);
    }

    async switchLanguage() {
        
        // Get the dropdown value
        const dropdown = document.getElementById('language');
        const toLanguage = dropdown.options[dropdown.selectedIndex].value.toLowerCase();
    
        this.audioHandler.stopPlaying(); // shut down if playing
          
        this.dataHandler.setLanguage(toLanguage);   // change the language setting.  
        await this.dataHandler.initialize();        // initializes the data to the new language.
        this.pageHandler.drawInitialPage();         // title and credits. They don't change
        this.pageHandler.drawCurrentPage();         // draw the new page.
    
    }
}

