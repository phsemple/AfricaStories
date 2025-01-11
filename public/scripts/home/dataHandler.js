
// Home Page Data Handler
export default class DataHandler {

    constructor( language) {
        this.titlesData = null; // Placeholder for story data
        this.language = language.toLowerCase();
    }

     // Initialize story data
    async initialize() {
        try {
            this.titlesData = await DataHandler.fetchTitles(this.language);
        } catch (error) {
            console.error('Failed to initialize DataHandler:', error);
        }
    }

    // this will be called if they change language
    setLanguage(language) {
        this.language = language;
    }

    // Static method to fetch the titles file for the home page data
    static async fetchTitles( language) {
        const url = `public/data/${language}/titles.json`;

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
