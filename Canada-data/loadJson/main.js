// Import the fs module
import mongoose from 'mongoose';
import { promises as fs} from 'fs';
import path from 'path'
import url from 'url'
import { StorySchema } from './stories.js'
import { saveBook } from './loadIndex.js'

const uri = "mongodb://localhost/stories";
mongoose.connect(uri).then(() => {
  console.log("connected");
});

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const indexFile = path.join(__dirname, 'data', 'indexData.json');
const pageFile = path.join(__dirname, 'data', 'booksData.json');
const creditsFile = path.join(__dirname, 'data', 'credits.json');

// Function to read and parse the JSON file
async function readJsonFile(filePath) {
  try {
    // Read the file
    const data = await fs.readFile(filePath, 'utf8');

    // Parse the JSON data into an array of objects
    const jsonArray = JSON.parse(data);

    // Log the result
    return jsonArray;
  } catch (error) {
    console.error('Error reading or parsing JSON file:', error);
  }
}

// Example usage
let indexArray = await readJsonFile(indexFile, 'utf8');
let pageArray = await readJsonFile(pageFile, 'utf8');
let creditsArray = await readJsonFile(creditsFile, 'utf8')

// Sort the pages by id.
 pageArray = pageArray.sort((a, b) =>
{
  return a.id - b.id 
  
});
console.log(`{PageArray: ${pageArray[0]}`)

// sort the credits by id.
creditsArray = creditsArray.sort((a, b) => {
    if (a.id === b.id) {
        // If `id` is the same, then compare by `name`
        return a.lang.localeCompare(b.lang);
    } else {
        // Otherwise, compare by `id`
        return a.id - b.id;
    }
});
console.log(`{CreditsArray: ${creditsArray[0]}`);

// save the books.
await saveBook(pageArray, creditsArray);

mongoose.disconnect();

