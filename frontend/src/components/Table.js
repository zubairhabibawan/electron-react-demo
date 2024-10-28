import Table from 'react-bootstrap/Table';

function BasicTable({ invoices, onInvoiceClick }) {
    return (
        <div className="table-wrapper">
            <h1>Invoice List</h1>
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>Invoice Number</th>
                    <th>Amount</th>
                    <th>Date</th>
                </tr>
                </thead>
                <tbody>
                {invoices.length > 0 ? (
                    invoices.map((invoice) => (
                        <tr key={invoice.invoice_no} onClick={() => onInvoiceClick(invoice.invoice_no)}>
                            <td>{invoice.invoice_no}</td>
                            <td>{invoice.amount}</td>
                            <td>{invoice.date}</td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="3">No invoices available</td>
                    </tr>
                )}
                </tbody>
            </Table>
        </div>
    );
}

export default BasicTable;
