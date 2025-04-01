
export default class DataHandler {

    constructor(storyId, language) {
        this.storyData = null; // Placeholder for story data
        this.storyId = storyId;
        this.language = language;
    }

     // Initialize story data
    async initialize() {
        try {
            this.storyData = await DataHandler.fetchStory(this.storyId, this.language);
        } catch (error) {
            console.error('Failed to initialize DataHandler:', error);
        }
    }

    // this will be called if they change language
    setLanguage(language) {
        this.language = language;
    }

    // Static method to fetch the story data
    static async fetchStory(storyId, language) {
        const url = `/data/${language}/${storyId}.json`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Network Response NOT OK: " + response.statusText);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
            throw error;
        }
    }
}
