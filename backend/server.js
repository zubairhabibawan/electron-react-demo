const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const cors = require('cors');
const path = require('path');
const port = 5000;
app.use(cors());
app.use(express.json());

// Connect to SQLite database
const dbPath = path.join(__dirname, 'invoices.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Error opening database: " + err.message);
    } else {
        console.log("Connected to the SQLite database.");
    }
});

// Create invoices table if not exists
db.run(`CREATE TABLE IF NOT EXISTS invoices (invoice_no TEXT, amount REAL, date TEXT , isSynced BOOLEAN DEFAULT 0)`);

// API to create a bill
app.post('/api/bill', (req, res) => {
    const { amount, date, invoice_no } = req.body;
    db.run(
        `INSERT INTO invoices(invoice_no, amount, date) VALUES(?, ?, ?)`,
        [invoice_no, amount, date],
        function (err) {
            if (err) return console.log(err.message);
            res.json({ id: this.lastID });
        }
    );
});
// API to get a unsynced-invoices
app.get('/api/unsynced-invoices', (req, res) => {
    db.all(`SELECT * FROM invoices WHERE isSynced = 0`, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

app.put('/api/mark-synced/:invoice_no', (req, res) => {
    const { invoice_no } = req.params;
    console.log(`Marking invoice ${invoice_no} as synced`); // Add this log
    db.run(`UPDATE invoices SET isSynced = 1 WHERE invoice_no = ?`, [invoice_no], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: "Invoice marked as synced", invoice_no });
    });
});


// API to get a specific invoice by invoice_no
app.get('/api/bill/:invoice_no', (req, res) => {
    const { invoice_no } = req.params;

    db.get(`SELECT * FROM invoices WHERE invoice_no = ?`, [invoice_no], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (row) {
            res.json(row);
        } else {
            res.status(404).json({ error: "Invoice not found" });
        }
    });
});

// API to get all bills
app.get('/api/bills', (req, res) => {
    db.all(`SELECT * FROM invoices`, [], (err, rows) => {
        if (err) return console.error(err.message);
        res.json(rows);
    });
});

// Test API to confirm server status
app.get('/api/test', (req, res) => {
    res.json({ message: "Server is working!" });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
