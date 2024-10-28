// scheduler.js
const fs = require('fs');
const path = require('path');

// Set the folder path to monitor for files
const folderPath = path.join(__dirname, '..', 'data'); // Adjust the path as needed

// Function to check for files with today's date
function checkForTodaysFiles() {
    const today = new Date().toISOString().split('T')[0];
    console.log(`Searching for files with today's date: ${today}`);
    fs.readdir(folderPath, (err, files) => {
        files.forEach((file) => {
            if (file.includes(today)) {
                console.log(`file found : ${file}`);
                process.send({ message: `Today's File found : ${file}` , fileFound : true });
            }else{
                process.send({ message: `${today} : Searching files` , fileFound : false  });
            }
        });
    });
}

// Run the file check every minute
setInterval(checkForTodaysFiles, 30000); // 300000 ms = 30 sec

// Log when the scheduler starts
console.log("File-checking scheduler started, monitoring folder:", folderPath);

