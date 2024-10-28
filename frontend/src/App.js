import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from './components/Form';
import Table from './components/Table';
import Modal from './components/Modal';
import { useEffect, useState } from "react";

function App() {
    const [invoices, setInvoices] = useState([]);
    const [selectedInvoiceDetails, setSelectedInvoiceDetails] = useState({
        invoice_no:''
    }); // State to hold invoice details

    // Function to fetch all invoices
    const closeModal = () => {
        setSelectedInvoiceDetails({
            invoice_no: ''
        })
    };
    const fetchInvoices = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/bills');
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            setInvoices(data);
        } catch (error) {
            console.error("Error fetching invoices:", error);
            setInvoices([]);
        }
    };

    useEffect(() => {
        fetchInvoices();
    }, []);

    // Function to fetch and print invoice details
    const handleInvoiceClick = async (invoiceNo) => {
        try {
            const response = await fetch(`http://localhost:5000/api/bill/${invoiceNo}`);
            if (response.ok) {
                const data = await response.json();
                setSelectedInvoiceDetails(data);
            } else {
                console.error("Failed to fetch invoice details");
            }
        } catch (error) {
            console.error("Error fetching invoice:", error);
        }
    };

    // Function to print the invoice details
    const printInvoice = () => {
        const printContents = document.getElementById('printableInvoice').innerHTML;
        const originalContents = document.body.innerHTML;

        document.body.innerHTML = printContents;
        window.print();
        document.body.innerHTML = originalContents;

        // Restore the React app
        window.location.reload();
    };

    return (
        <div className="App">
            <Form fetchInvoices={fetchInvoices} />
            <Table invoices={invoices} onInvoiceClick={handleInvoiceClick} />
            x<Modal data={selectedInvoiceDetails} printInvoice={printInvoice} closeModal={closeModal} />
            <div>
                {selectedInvoiceDetails && (
                    <div id="printableInvoice" style={{ display: 'none' }}>
                        <h2>Invoice Details</h2>
                        <p><strong>Invoice Number:</strong> {selectedInvoiceDetails.invoice_no}</p>
                        <p><strong>Amount:</strong> ${selectedInvoiceDetails.amount}</p>
                        <p><strong>Date:</strong> {selectedInvoiceDetails.date}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
