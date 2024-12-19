/* TODO: remove this after capture of json files 
   Use this to download all my data from canada to a separate json file.
*/


document.getElementById('download-btn').addEventListener('click', function() {
    // Example array
    const myArray = storyData;

    const id = storyData.stories[0].id;
    
    // Convert array to JSON string
    const jsonString = JSON.stringify(myArray, null, 2); // null and 2 for pretty print
    
    // Create a Blob object representing the data as a JSON file
    const blob = new Blob([jsonString], { type: 'application/json' });
    
    // Create a link element
    const link = document.createElement('a');
    
    // Create an object URL for the Blob
    const url = URL.createObjectURL(blob);
    
    // Set the download attribute with a filename
    const fileName = `${id}.json`
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    
    // Programmatically click the link to trigger the download
    link.click();
    
    // Clean up the URL object
    URL.revokeObjectURL(url);
  });




