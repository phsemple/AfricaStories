
export default class PagingHandler
{
    // Get all the pagingNum Nodes into a list. We will align
    // these with an array of page numbers. this node list will not change.
    static pagingNums = document.querySelectorAll('.paging-num');
    static ellipse = document.querySelector('.paging-ellipse');
    
    constructor(pages) {
        //
        // Initial Page display is : 1 2 3 4 5 ... 16
        // last number is total pages, ... indicates pages between.
        // If we shift to have 12 13 14 15 16, then no ellipse will show.
        // when they select the 4th/5th position, we will shift forward and place
        // the 4th position at the 2nd position.
        //     3 4 5 6 7 ... 16
        // if they select the 1st positon (5 in this case) we will shift back
        //     5 6 7 8 9 ... 16
        // and place the 1st position in 4th position.
        //     2 3 4 5 6 ... 16
        //
        PagingHandler.ellipse.innerText = '. . . ';
        this.maxPagesOnLine = 5; // max page numbers to show each time
        this.pageArray  = [...Array(pages).keys()]; // create an array of page numbers 1 2 3 ... 
        this.currentPage = 1; // title page is 0, we bypass that.
        this.lastPage = this.pageArray.length - 1;
        this.pageOffset = 1;  // this is the 1st number on the paging bar.

        this.addEventListeners();

        this.drawPageBar();
    }

    addEventListeners() {

        try {
            const nextButton = document.querySelector("#next");
            nextButton.addEventListener('click', this.nextPage());

            const previousButton = document.querySelector("#previous");
            nextButton.addEventListener('click', this.previousPage())                   
        }
        catch (error)
        {
            console.log("Failed to bind Events", error)
        }

    }

    drawPageBar() {

        // Get an array from our current offset to the end of the array or until maxPageOnLine index
        const pageValues = this.pageArray.slice(this.pageOffset, this.pageOffset+this.maxPagesOnLine);
        try {

            // we skip the title at index 0, so we start at one and look at 5+1 positions.
            // We slice from whatever is the first item showing on the page and get up to the
            // index of the maxPagesOnLine value from the offset.

            for (let index = 0; index < this.maxPagesOnLine; index++) {
                if (index >= pageValues.length) { // hide empty divs
                    PagingHandler.pagingNums[index].style.visibility = 'hidden';
                }
                else {
                    PagingHandler.pagingNums[index].style.visibility = 'visible';
                    PagingHandler.pagingNums[index].innerText = pageValues[index];
                }
            }
        }
        catch (error)
        {
            console.error('Error Initializing Page Handler: drawPageBar()', error);
            throw error; 
        }

        try {
        // if we need the ellipse, we also need to make the end item be the
        // page count. See if the last page value we used is not the last page.
            if (pageValues[pageValues.length - 1] < this.pageArray[this.pageArray.length - 1]) {
                PagingHandler.ellipse.style.visibility = 'visible';
                PagingHandler.pagingNums[PagingHandler.pagingNums.length - 1].innerText = this.pageArray[this.pageArray.length - 1];
            }
            else {
                PagingHandler.ellipse.style.visibility = 'hidden'; // hide the ellipse
            }
        }
        catch (error)
        {
            console.error('Error Setting ellipse on Page Handler: drawPageBar()', error);
            throw error; 
        }

        this.togglePrevNextButtons();
        this.selectCurrentPage();
    }

   // disable the next or previous buttons if we are at the first or last page
    togglePrevNextButtons() {
        const nextButton = document.querySelector('#next');
        const prevButton = document.querySelector('#previous');
        this.isFirstPage() ? prevButton.disabled = true : prevButton.disabled = false;
        this.isLastPage() ? nextButton.disabled = true : nextButton.disabled = false;
    }


    // change the currentPage to the new current Page.
    changePage(toPage) {
        // deselect current page 
        this.deselectCurrentPage();
        this.currentPage = toPage;
        this.selectCurrentPage();
    }
    
    selectCurrentPage()
    {
        const target = Array.from(PagingHandler.pagingNums).find(element => element.innerText.trim() === String(this.currentPage));
        target.classList.add('selected');
    }

    deselectCurrentPage()
    {
        const target = Array.from(PagingHandler.pagingNums).find(element => element.innerText.trim() === String(this.currentPage));
        target.classList.remove('selected');
    }

    isLastPage(){
        return this.currentPage === this.lastPage;
        }
    
    isFirstPage(){
        return this.currentPage === 1;
    }

    nextPage()
    {
        this.adjustPaging(this.currentPage + 1);   
    }

    previousPage()
    {
        this.adjustPaging(this.currentPage - 1); 
    }

    // if a new page is chosen that requires us to redraw 
    // the bar, this is the routine that does it.
    adjustPaging(toPage)
    {

        // Never Redraw: We have less than maxPagesOnLine pages in story, so we just changePage. We never redraw.
        // (this is assumes we have disabled previous/next buttons if at ends of page bar.)
        if (this.pageArray.length <= this.maxPagesOnLine)
        {
            this.changePage(toPage)
            return;
        }

        // Are we stepping back off the bar?
        if (toPage < this.pageArray[0])
        {
            this.redrawPaging(toPage, this.maxPagesOnLine-1); // put the page at position 2nd from end of bar.
            return;
        }

        // find our page in the array. 
        index = this.PageValues.findIndex(pageNum => pageNum === toPage);
        const adjustIndexAt = this.maxPagesOnLine - 1; 
        if (index > -1 && index < adjustIndexAt) // we are in the boundaries, we don't redraw
        {
            this.changePage(toPage);
            return;
        }

        // They either clicked on the last index, or they did a next to the last index.
        // In both cases we step them back to the 2nd position (index=1)
         this.redrawPaging(toPage, 2); // put the page at position 2nd from end of bar.

    }

    redrawPaging(toPage, position)
    {
        this.deselectCurrentPage(); // clear our selection

        // setting pageOffset and the current page allows drawPageBar to adjust everything.
        this.pageOffset = toPage - (position - 1); // first page number in bar
        this.currentPage = toPage;
        this.drawPageBar();
    }


}
