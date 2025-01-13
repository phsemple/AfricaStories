

const HOME_PAGE_NAME = '/index.html';

const languages = [
    { code: 'sw', language: 'Swahili' },
    { code: 'en', language: 'English' },
    { code: 'fr', language: 'French' },
];

export default class Controls {

    constructor() {

        // The handlers will be set after we build the menu options.
        this.dataHandler = null;
        this.audioHandler = null; 
        this.pageHandler = null; 

        this.currentPage = document.body.id;


        // get elements and set defaults.
        this.homeButton = document.getElementById('home')
        this.dropdownLanguage = document.getElementById('language')
        this.langCode = 'sw';
        this.language = 'Swahili';
        this.checkboxAutoplay = document.getElementById('autoplay');
        this.autoplay = 'false';
        this.dropdownRate = document.getElementById('rate');
        this.playbackRate = "1.00";
        this.initializeControlsMenu();  // read localStorage and set menu

        this.addEventHandlers();

    }

    // set control field from local storage
    initializeControlsMenu() {

        // hide the home button if on the home page.
        this.homeButton.style.visibility = this.currentPage === 'titles-page' ? 'hidden' : 'visible';
 
        // We set the controls to either localStorage or the default settings.
        const langCode = localStorage.getItem('language');
        this.langCode = langCode === null ? this.langCode : langCode;
        this.dropdownLanguage.value = this.langCode;
        this.language = this.dropdownLanguage.options[this.dropdownLanguage.selectedIndex].text;
           
        const autoplay = localStorage.getItem('autoplay');
        this.autoplay = autoplay === null ? this.autoplay : autoplay;
        this.checkboxAutoplay.checked = this.autoplay === 'true';
     
        const playbackRate = localStorage.getItem('playbackRate');
        this.playbackRate = playbackRate === null ? this.playbackRate : playbackRate;
        this.dropdownRate.value = this.playbackRate;

    }

    // the handlers will be set by the main program afer the menu is set.
    //
    // We cannot use the audioHandler on the Home Page, but we want to allow
    // them to set the menus. If we are on the home page the audioHandler is
    // Null. If they change the Playback Rate or the AutoPlay we will record
    // that in localStorage. It will be read when we go the story.
    setHandlers(dataHandler, pageHandler, audioHandler) {
        this.dataHandler = dataHandler;  // we will reload data if language changes.
        this.pageHandler = pageHandler;
        
        this.audioHandler = audioHandler; // we will set autoplay and playback rate.

        if (this.audioHandler !== null) { // home page has null audioHandler
            this.audioHandler.setAutoplay(this.checkboxAutoplay.checked);
            this.audioHandler.setPlaybackRate(this.dropdownRate.value);
        }
    }

    addEventHandlers() {
        this.homeButton.addEventListener('click', this.home.bind(this));
        this.checkboxAutoplay.addEventListener('change', this.toggleAutoplay.bind(this));
        this.dropdownRate.addEventListener('change',  this.setPlaybackRate.bind(this));
        this.dropdownLanguage.addEventListener('change',  this.switchLanguage.bind(this));
    }

    // ******* Event Handler *************

    home()
    {
        if (this.currentPage === 'titles-page') {
            return;  // don't do anything. We are on the home page.
        }

        // set a base if we are on the website.
        const basePath = window.location.pathname.includes('/AfricaStories') ? '/AfricaStories' : '';
        const homeUrl = `${window.location.origin}${basePath}${HOME_PAGE_NAME}`; 


        console.log('Redirecting to:', homeUrl); // Log the URL
        window.location.replace( homeUrl);

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

        if (this.audioHandler !== null) { // home page has null audioHandler.
            this.audioHandler.setAutoplay(this.checkboxAutoplay.checked);
        }

        localStorage.setItem('autoplay', this.checkboxAutoplay.checked); //persist the setting
    }
    
    setPlaybackRate() { // tell the audio handler
        const rate = this.dropdownRate.value;

        if (this.audioHandler !== null) { // home page has null audioHandler.
            this.audioHandler.setPlaybackRate(rate);
        }

        localStorage.setItem('playbackRate', rate); //persist the setting
    }


    // tell everybody that things have changed.
    async switchLanguage() {
        
        // Get the dropdown value
        const toLanguage = this.dropdownLanguage.options[this.dropdownLanguage.selectedIndex].value.toLowerCase();
        localStorage.setItem('language', toLanguage);
    
        if (this.audioHandler !== null) { // home page has null audioHandler.
            this.audioHandler.stopPlaying(); // shut down if playing
        }
          
        this.dataHandler.setLanguage(toLanguage);   // change the language setting.  
        await this.dataHandler.initialize();        // initializes the data to the new language.

        this.pageHandler.drawPage(); 
    }
}

