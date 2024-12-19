
import Story from './storyPage.js';

let storyData = null;  // the json data
let storyInstance = null; // the Story class instance

document.addEventListener("DOMContentLoaded", async () => {

    // Get the full URL
    const urlParams = new URLSearchParams(window.location.search);
    const storyId = urlParams.get('storyId');

    try {
        await fetchStory(storyId); // fetch the story data from server
        storyInstance = new Story(storyData); // storyInstance is const at top of file.
    }
    catch (error) {
        console.error('failed to initialize story', error);
    }

});

   
async function fetchStory(storyId) {
    //const url = `/fetch-story/${storyId}`;// Using a URL path parameter
    const url = `/public/data/${storyId}.json`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Network Response NOT OK" + response.statusText);
        }

        const data = await response.json();
        storyData = data;
        console.log('Story Data: ', storyData);
        return storyData;

    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        throw error; // Re-throw error for the caller to handle
    }
   
}