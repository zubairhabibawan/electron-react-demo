const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Define the path for the SQLite database file
const dbPath = path.resolve(__dirname, 'invoices.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Error opening database: " + err.message);
    } else {
        console.log("Connected to SQLite database.");
    }
});

// Create the invoices table if it doesn't exist and insert dummy data
db.serialize(() => {
    // Create invoices table
    db.run(
        `CREATE TABLE IF NOT EXISTS invoices (
       invoice_no TEXT PRIMARY KEY,
       amount REAL,
       date TEXT ,
       isSynced BOOLEAN DEFAULT 0
     )`,
        (err) => {
            if (err) {
                console.log("Table creation error: " + err.message);
            } else {
                console.log("Invoices table created or already exists.");
            }
        }
    );

    // Insert dummy data into invoices table
    const insert = `INSERT INTO invoices (invoice_no, amount, date,isSynced) VALUES (?, ?, ?,?)`;
    db.run(insert, ["1", 100.50, "2024-10-01",0]);
    db.run(insert, ["2", 250.75, "2024-10-15",0]);
    db.run(insert, ["3", 180.20, "2024-10-20",0]);
    db.run(insert, ["4", 300.00, "2024-10-25",0]);
    db.run(insert, ["5", 125.50, "2024-10-26",0]);

    console.log("Inserted dummy data into invoices table.");
});

// Close the database connection
db.close((err) => {
    if (err) {
        console.error(err.message);
    }
    console.log("Database connection closed.");
});
