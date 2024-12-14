
/* 
    This will be run by the load of the page. We will need to create a
    Story class instance. 
    Use a let variable to store the instance.
    Have a function that will return the instance for next/prev steps.
    See the fetchTest and mainFetch.js for ideas.
*/

let storyData = null;  // the json data
let storyInstance = null; // the Story class instance

 document.addEventListener("DOMContentLoaded", async () => {
    const storyID = document.querySelector('#storyid').innerText;
    await fetchStory(storyID); // fetch the story data from server

   });
    
async function fetchStory(storyId) {
    // Construct the URL with the story ID as a parameter
    //const url = `/fetch-story/${storyId}`;// Using a URL path parameter

    const url = `/public/script/${storyId}.json`;
    

    // Perform the fetch request
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
      })
      .then(data => {
          storyData = data; // storyData is module variable
          console.log('Story Data: ', storyData);
          getStoryInstance(); // use storyData to create the Story instance
        // You can also update the UI with the fetched data here
      })
      .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
    });
}

// The story instance isn't available until we can build the
// Story class instance. If it isn't build yet, we will build it.
// This is used by the HTML events to get the storyInstance.
function getStoryInstance(){
    if (storyInstance === null){
        storyInstance = new Story(storyData);
    }
    return storyInstance;
}


class Story {
    constructor(storyData) {
        this.storyID = document.querySelector('#storyid').innerText;
        this.storyArray = storyData; // this is our story with the array of pages.
        
        this.languageIndex = 0; // 0 for primary language, 1 for secondary language
        this.currentLanguage = this.storyArray.stories[this.languageIndex].languagename;
        this.primaryLanguage = this.storyArray.stories[0].languagename;
        this.secondaryLanguage = this.storyArray.stories[1].languagename;
        
        this.currentPage = 1;  // we skip the title page and go to the first page
        this.pages = this.storyArray.stories[this.languageIndex].pages;  // points to the active lang pages.
        this.togglePrevNextButtons(); // disable the previous button at first page

        this.playing = false;  // track if the text is playing.
        
        // draw the page content in the initial langauge
        this.drawInitialPage();
        this.drawLangPage();
        this.drawPage();
    }
    
    next() {  

        this.stopPlaying();
        
        this.currentPage++;
        this.togglePrevNextButtons();
        this.drawPage();
    }
    
    previous() {
        this.stopPlaying();
        this.currentPage--;
        this.togglePrevNextButtons();
        this.drawPage();
    }
  
    stopPlaying() /* if the text is playing, stop it and reset */
    {
        if (this.playing) {
            const audio = document.querySelector('#audio');
            this.playing = false;
            audio.currentTime = 0; // Set the audio back to the start
            this.playpause();
        }
    }

    // disable the next or previous buttons if we are at the first or last page
    togglePrevNextButtons() {
        const nextButton = document.querySelector('#next');
        const prevButton = document.querySelector('#previous');
        this.isFirstPage() ? prevButton.disabled = true : prevButton.disabled = false;
        this.isLastPage() ? nextButton.disabled = true : nextButton.disabled = false;
    }

    isLastPage(){
        return this.currentPage === this.pages.length - 1;
        }
    
    isFirstPage(){
        return this.currentPage === 1;
    }
    
    switchLanguage() {
        
        this.stopPlaying();
        
        // Get the dropdown element
        const dropdown = document.getElementById('language-dropdown');
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
            const illustrator = document.querySelector('#illustratedBy');
            const author = document.querySelector('#writtenBy');
            const translator = document.querySelector('#translatedBy');
            const reader = document.querySelector('#readBy');
            
            level.innerText = "Level " + this.storyArray.stories[this.languageIndex].level;
            illustrator.innerText =  this.storyArray.stories[this.languageIndex].illustrator;
            author.innerText =   this.storyArray.stories[this.languageIndex].writtenby;
            translator.innerText =  this.storyArray.stories[this.languageIndex].translator;
            reader.innerText =  this.storyArray.stories[this.languageIndex].readby;

            // Mark the selection in the dropdown and display the selected value in the paragraph
            const langCode = this.storyArray.stories[this.languageIndex].language;
            document.getElementById('language-dropdown').value = langCode;
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
            const image = document.querySelector('#image');
            const storytext = document.querySelector('#storytext');
            const audio = document.querySelector('#audio');
            const pagenum = document.querySelector('#pagenum');
                
            const page = this.pages[this.currentPage];
            pagenum.innerText = "Page " + page.pagenum + " of " + (this.pages.length - 1); // we don't count the title page
            image.src = page.image;
            audio.src = page.audio;
            storytext.innerText = page.text;
        }
        
        /* we toggle visibility on both the button and the image. We decide based on 
           the this.playing boolean, since toggling on hidden/visible causes problems
           if button is pushed at the wrong time. */
        togglePlayPause() {
            const playbutton = document.getElementById('playbutton');
            const playImg = playbutton.querySelector('img')
            const pausebutton = document.getElementById('pausebutton');
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



