import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import {ToastContainer, toast} from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
let isOnline = undefined
function BasicForm({fetchInvoices}) {
    const [invoiceNumber, setInvoiceNumber] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState('');
    // Function to check internet status
    const checkInternetStatus = () => {
        const onlineStatus = navigator.onLine;
        console.log(isOnline)
        console.log(onlineStatus)
        if(isOnline !== onlineStatus){
            isOnline = onlineStatus
            if (onlineStatus) {
                syncInvoices(); // Sync invoices when back online
            } else {
                toast.warning("You are offline. Any new invoices will be saved locally.");
            }
        }

    };

    // Set up scheduler message listener and internet status checker
    useEffect(() => {
        // Listen for file found events
        if (window.electron && window.electron.onFileScheduler) {
            console.log("Listening for scheduler messages...");
            window.electron.onFileScheduler((data) => {
                if (data.fileFound) {
                    toast.success(data.message);
                }else{
                    toast.info(data.message);
                }

            });
        }
        // Set up an interval to check internet status every 20 seconds
        const intervalId = setInterval(checkInternetStatus, 20000);

        // Clean up the interval on component unmount
        return () => clearInterval(intervalId);
    }, []); // Only run on mount and unmount

    const syncInvoices = async () => {
        // Fetch unsynced invoices from SQLite
        try {
            const response = await fetch('http://localhost:5000/api/unsynced-invoices');
            const unsyncedInvoices = await response.json();
            console.log(unsyncedInvoices)
            // Sync each invoice with the server
            if(unsyncedInvoices.length>0){
                let invoiceNoList = unsyncedInvoices.map(invoice=>{
                    return invoice.invoice_no
                }).join(',\n')
                console.log(invoiceNoList)
                toast.info("Back online! Syncing invoices \n"+invoiceNoList);
                for (const invoice of unsyncedInvoices) {
                    // Mark invoice as synced locally
                    await fetch(`http://localhost:5000/api/mark-synced/${invoice.invoice_no}`, {
                        method: 'PUT',
                    });
                }
                toast.success("All invoices are synced successfully.");
                fetchInvoices(); // Refresh list of invoices
            }

        } catch (error) {
            console.error("Error syncing invoices:", error);
            toast.error("Error syncing invoices.");
        }
    };


    // Function to handle form submission
    const handleSubmit = async (event) => {
    event.preventDefault();

        const newInvoice = {
            invoice_no: invoiceNumber,
        amount: parseFloat(amount),
            date,
        isSynced: navigator.onLine ? 1 : 0, // Set to 0 if offline, 1 if online
        };

        try {
            const response = await fetch('http://localhost:5000/api/bill', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newInvoice),
            });

            if (response.ok) {
                toast.success('Invoice added successfully!');
                // Clear form inputs after successful submission
                setInvoiceNumber('');
                setAmount('');
                setDate('');
                fetchInvoices();
            } else {
                toast.error('Failed to add invoice. Please try again.');
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error('Error adding invoice. Check the console for details.');
        }
    };

    return (
        <div className="form-wrapper">
            <ToastContainer/>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="text-center">
                    <Form.Label variant="info"><h1>Add Invoice</h1></Form.Label>
                </Form.Group>
                <hr/>
                <Form.Group className="mb-3">
                    <Form.Label>Invoice Number</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter Invoice"
                        value={invoiceNumber}
                        onChange={(e) => setInvoiceNumber(e.target.value)}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Amount</Form.Label>
                    <Form.Control
                        type="number"
                        placeholder="Enter Amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Date</Form.Label>
                    <Form.Control
                        type="date"
                        placeholder="Select Date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </Form.Group>
                <Button variant="primary" className="w-100" type="submit">
                    Submit
                </Button>

            </Form>8
        </div>
    );
}

export default BasicForm;
