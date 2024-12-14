import mongoose from 'mongoose';

// Define the Page schema
const PageSchema = new mongoose.Schema({
    pagenum: Number,   // Page number,
    text: String,      // story text for page 
    image: String,     // Image file path or URL
    audio: String      // Audio file path or URL
});

// Define the main schema with id, language, and an array of pages
export const StorySchema = new mongoose.Schema({
  id: { 
    type: String, 
    required: true ,
  },
  language: { // this is a code: en, sw, etc.
    type: String, 
    required: true 
  },
  languagename: String, // this is the full name of the language: English, Swahili, etc.
  level: Number,
  title: String,
  readby: String,
  writtenby: String,
  illustrator: String,
  translator: String,

  pages: [PageSchema]  // Array of Page objects
});

// Create the model from the schema
export const Story = mongoose.model('Story', StorySchema);
export const StoryPage = mongoose.model('Page', PageSchema);

StorySchema.index({ id: 1, language: 1 }, { unique: true });

export async function saveBookData(story) {

  // destructure the Json object to story.
  const { id, title, language, level, readby, writtenby, illustrator, translator } = story;

  // map the language code to the language name
  switch (story.language) {
    case 'sw':
      story.languagename = 'Swahili';
      break;
    case 'en':
      story.languagename = 'English';
      break;
    case 'fr':
      story.languagename = 'French';
      break;
  }

  // Create the filteredData object and include story.languagename
const filteredData = { 
  id: story.id, 
  title: story.title, 
  language: story.language, 
  languagename: story.languagename,// Access the languagename directly from the story object
  level: story.level,
  readby: story.readby, 
  writtenby: story.writtenby, 
  illustrator: story.illustrator, 
  translator: story.translator
};

  const newStory = new Story(filteredData);

  savePages(story, newStory);  // push the pages onto the story

  await newStory.save()
    .then (() => {
    console.log('Saved');
  }).catch 
  ( (err) => {
    console.log(err);
  })
}


async function savePages(story,newStory) {
  for (const page of story.pages) {

    // we copy page's audio file name so we can insert the language.
    // In the Json file there is only one page record for all languages, so if
    // we insert when we add the sw lang code first, next time we add english
    // we get /sw/en/.  (not the best design)
    const audioName = page.audioFileName;

    const lang = newStory.language;
    switch (lang) {
      case 'sw':
        page.text = page.swahili.trim();
        page.image = page.imageFileName; // not language dependent, but we repeat for each language anyway.
        page.audio = putLangIn(audioName, lang) // audio is language dependent
        break;
      
      case 'en':
        page.text = page.english.trim();
        page.image = page.imageFileName;
        page.audio = putLangIn(audioName, lang)
        break;
      
        case 'fr':
        page.text = page.french.trim();
        page.image = page.imageFileName;
        page.audio = putLangIn(audioName, lang)
        break;
    }
    page.pagenum = page.pagenum;  // add the proper case for the spread.
    const { pagenum, text, image, audio, level } = page;
    const filteredData = { pagenum, text, image, audio , level};
    newStory.pages.push(new StoryPage(filteredData));
  }
}

// We insert the language into the path and into the audio file name
function putLangIn(path, lang)
{
  const paths = path.split('/');
  paths[2] = lang + '/' + paths[2];

  // Get the file name from end of path and insert the language code
  const fileIndex = paths.length -1 ;
  const fileName = paths[fileIndex].split('_');
  fileName.splice(1, 0, lang);  // splice in the language code
  paths[fileIndex] = fileName.join('_'); // rejoin the file name and put it back in the path

  return paths.join('/'); // rejoin everything and return the modified path

}
