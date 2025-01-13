import setupPageSwipe from './swipePage.js' // Handle left/right page turning.

// Page Handler for the Story Page. 
export default class PageHandler
{
    constructor(dataHandler, audioHandler) { // pass in the dataHandler

        this.dataHandler = dataHandler;    // access data for the pages.
        this.audioHandler = audioHandler;  // we stop audio whenever page changes.

        this.lastPage = dataHandler.storyData.pages.length - 1; 
        this.currentPage = 1;

        const pageCount = document.querySelector("#page-count"); 
        const pageNum = document.querySelector("#page-num"); 
        
        pageCount.innerText = this.lastPage;
        pageNum.innerText = this.currentPage;

        setupPageSwipe(this.previousPage.bind(this), this.nextPage.bind(this)); // setup swipe for text screens
        
        this.drawPage();  // first time in we draw the whole page.

        this.addEventListeners();

    }

    addEventListeners() {

        try {
            const nextButton = document.querySelector("#next");
            nextButton.addEventListener('click', this.nextPage.bind(this));

            const previousButton = document.querySelector("#previous");
            previousButton.addEventListener('click', this.previousPage.bind(this))                   
        }
        catch (error)
        {
            console.log("PageHandler.addEventListeners:  Failed to bind Events", error)
        }

    }

    getCurrentPage()
    {
        return this.currentPage;
    }

    // draw the all the data on the page.
    drawPage() {
        this.drawInitialPage();
        this.drawCurrentPage();
    }

     // Initial fields that don't change when the page changes, then draw the rest of the page.
    drawInitialPage() {

        const title = document.querySelector('#title');
        const level = document.querySelector('#level');
        const illustrator = document.querySelector('#illustrator');
        const author = document.querySelector('#writer');
        const translator = document.querySelector('#translator');
        const reader = document.querySelector('#reader');
        

        title.innerText = this.dataHandler.storyData.title;
        level.innerText = "Level " + this.dataHandler.storyData.level;
        illustrator.innerText =  this.dataHandler.storyData.illustrator;
        author.innerText = this.dataHandler.storyData.writtenby;
        translator.innerText =  this.dataHandler.storyData.translator;
        reader.innerText =  this.dataHandler.storyData.readby;

        // document.getElementById('selectedLanguage').textContent = `Selected Language: ${this.currentLanguage} (${langCode})`;
    }
    
    // Draw the fields that change when they turn a page.
    drawCurrentPage() {
        const image = document.querySelector('#picture');
        const storytext = document.querySelector('#storytext');
        const audio = document.querySelector('#audio');
        const pagenum = document.querySelector('#page-num');
            
        try {
            const page =this.dataHandler.storyData.pages[this.currentPage];
            pagenum.innerText = String(page.pagenum); 
            this.togglePrevNextButtons(); // enable/disable if for first/last page.

            image.src =  page.imageSrc;
            audio.src = page.audioSrc;
            storytext.innerText = page.text;
        }
        catch (error)
        {
            console.log('DrawPage', error);
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
        return this.currentPage === this.lastPage;
        }
    
    isFirstPage(){
        return this.currentPage === 1;
    }

    nextPage()
    {
        // disallows swipe right
        if (this.isLastPage()){
            return;
        }

        this.audioHandler.stopPlaying();
        this.currentPage++;
        this.drawCurrentPage();
    }
    
    previousPage() {

        // disallows swipe left
        if (this.isFirstPage()){
            return;
        }
        this.audioHandler.stopPlaying();
        this.currentPage--;
        this.drawCurrentPage();
    }



}
