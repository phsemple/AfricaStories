import PageHandler from './pageHandler.js';
import AudioHandler from './audioHandler.js';
import DataHandler from './dataHandler.js';


/* 
    This will be run by the load of the page. We will need to create a
    Story class instance. 
    Use a let variable to store the instance.
    Have a function that will return the instance for next/prev steps.
    See the fetchTest and mainFetch.js for ideas.
*/


export default class Story {

    static PageHandler = null; // class instance

    constructor(storyData) {
        
        this.storyID = storyData.id; 
        this.language = storyData.languagename;
        this.currentPage = 1; // we skip the title page at 0.
        Story.PageHandler = new PageHandler(storyData.pages);
        

        this.playing = false;  // track if the text is playing.
        
        // draw the page content in the initial langauge
        this.drawInitialPage();
        this.drawLangPage();
        this.drawPage();
    }
    
    next() {  // goto next page

        this.stopPlaying();
        
        this.currentPage++;
        this.togglePrevNextButtons();
        this.drawPage();
    }
    
    previous() { // gotto previous page
        this.stopPlaying();
        this.currentPage--;
        this.togglePrevNextButtons();
        this.drawPage();
    }
  


    switchLanguage() {
        
        this.stopPlaying();
        
        // Get the dropdown element
        const dropdown = document.getElementById('language');
        const selectedText = dropdown.options[dropdown.selectedIndex].text;
        const selectedValue = dropdown.value;

        // no change made
        if (this.currentLanguage === selectedText) {
            return;
        }

        // toggle the language index, point pages to the new language
        this.languageIndex === 0 ? this.languageIndex = 1 : this.languageIndex = 0;
        this.currentLanguage = selectedText;
        this.pages = this.storyArray.stories[this.languageIndex].pages;  // points to the active lang pages.
 
        this.drawLangPage();
        this.drawPage();

    }

    // Initial fields that don't change when the page changes, then draw the rest of the page.
    drawInitialPage() {

        const level = document.querySelector('#level');
        const illustrator = document.querySelector('#illustrator');
        const author = document.querySelector('#writer');
        const translator = document.querySelector('#translator');
        const reader = document.querySelector('#reader');
        
        level.innerText = "Level " + this.storyArray.stories[this.languageIndex].level;
        illustrator.innerText =  this.storyArray.stories[this.languageIndex].illustrator;
        author.innerText =   this.storyArray.stories[this.languageIndex].writtenby;
        translator.innerText =  this.storyArray.stories[this.languageIndex].translator;
        reader.innerText =  this.storyArray.stories[this.languageIndex].readby;

        // Mark the selection in the dropdown and display the selected value in the paragraph
        const langCode = this.storyArray.stories[this.languageIndex].language;
        document.getElementById('language').value = langCode;
        // document.getElementById('selectedLanguage').textContent = `Selected Language: ${this.currentLanguage} (${langCode})`;

        this.drawLangPage();
        this.drawPage();
    }
    
    // fields oustide of the page that change when the language changes
    drawLangPage() {
        const title = document.querySelector('#title');
        title.innerText = this.storyArray.stories[this.languageIndex].title;
    }
    
    
        // We set the new page values into the DOM when the page or the language changes
    drawPage() {
        const image = document.querySelector('#picture');
        const storytext = document.querySelector('#storytext');
        const audio = document.querySelector('#audio');
        const pagenum = document.querySelector('#page-num');
            
        try {
            const currentPage = Story.PagingHandler.currentPage;
            const page =this.story.pages[currentPage];
            pagenum.innerText = String(page.pagenum); 
            Story.PagingHandler.togglePrevNextButtons(); // enable/disable if for first/last page.

            image.src =  page.image;
            // audio.src = page.audio;
            storytext.innerText = page.text;
        }
        catch (error)
        {
            console.log('DrawPage', error);
        }
    }
    
    /* we toggle visibility on both the button and the image. We decide based on 
        the this.playing boolean, since toggling on hidden/visible causes problems
        if button is pushed at the wrong time. */
    togglePlayPause() {
        const playbutton = document.getElementById('play');
        const playImg = playbutton.querySelector('img')
        const pausebutton = document.getElementById('pause');
        const pauseImg = pausebutton.querySelector('img')
        
        if (this.playing) {
            playbutton.classList.remove('visible');
            playbutton.classList.add('hidden');
            pausebutton.classList.remove('hidden');
            pausebutton.classList.add('visible');

            playImg.classList.remove('visible');
            playImg.classList.add('hidden');
            pauseImg.classList.remove('hidden');
            pauseImg.classList.add('visible');
        } else {
            playbutton.classList.remove('hidden');
            playbutton.classList.add('visible');
            pausebutton.classList.remove('visible');
            pausebutton.classList.add('hidden');

            playImg.classList.remove('hidden');
            playImg.classList.add('visible');
            pauseImg.classList.remove('visible');
            pauseImg.classList.add('hidden');
        }
    }

    playpause() {
        const p = document.getElementById('audio');
        if (p.paused) {
            p.play();
            this.playing = true;
        } else {
            p.pause();
            this.playing = false;
        }
        this.togglePlayPause();
    }

    /* toggle the playpause when onended is triggered */
    pageEnded()
    {   
        this.playing = false;
        this.togglePlayPause();
    }

    autoPlay() {
        const autoplay = document.getElementById('autoplay');
    }

    forward()
    {
        const forwardbutton = document.getElementById('forward');
        const forwardImg = forwardbutton.querySelector('img')
    }

    back()
    {
        const backbutton = document.getElementById('back');
        const backImg = backbutton.querySelector('img')
    }

} /* END Story Class */

// document.addEventListener('play', function(e) {
//     var audios = document.getElementsByTagName('audio');
//     for (var i = 0, len = audios.length; i < len; i++) {
//         if (audios[i] != e.target) {
//             audios[i].currentTime = 0;
//             audios[i].pause()
//         }
//     }
// }, true);


function adjustslider() {
    const slider = document.getElementById('playbackspeed');
    const audio = document.querySelector('audio');
    audio.playbackRate = slider.value;
    const value = document.querySelector('#playback-value');
    value.textContent = slider.value;
}

function normalspeed() {
    tooltip = window.slider_tooltip;
    slider = document.getElementById('audio_slider');
    var audios = document.getElementsByTagName('audio');
    for (var i = 0, len = audios.length; i < len; i++) {
        audios[i].playbackRate = 1
    }
    slider.value = 1;
    tooltip.setAttribute('data-tooltip', 'Reading speed: 1×')
}



