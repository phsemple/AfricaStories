import { saveBookData } from './stories.js'


function findCredits(credits, id, lang) {
    return credits.find( (item) => item.id === id && item.lang === lang);
}

// We are operating on the pages here. Each page record has all three languages, so we 
// loop throught the page and create a database record for each language. 
// This means we must adjust the language field and the title and audio file names 
// to reflect the language of the database page record.
export async function saveBook(bookArray, creditsArray) {

    const langs = ['sw', 'en', 'fr'];
    for (const lang of langs) {
        for (const story of bookArray) {
            // transform to get language
            story.language = lang;
            const page = story.pages[0];

            // put the credits into the record.
            const credits = findCredits(creditsArray, story.id, lang);
            story.writtenby = credits.writtenby.trim();
            story.readby = credits.readby.trim();
            story.translator = credits.translator ? credits.translator.trim() : null;
            story.illustrator = credits.illustrator.trim();
            
            switch (lang) { // set the title to the proper lang from page 0;
                case 'sw':
                    story.title = page.swahili.trim();
                    break;
                case 'en':
                    story.title = page.english.trim();
                    break;
                case 'fr':
                    story.title = page.french.trim();
                    break;
            }

            // During this call the story audio file must have the language code inserted into the path.
            await saveBookData(story);

        

        }
    } 
}