import React from 'react'
import './Invoice.css'
import Logo from "./images/logo.png";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {
    Card,
    CardContent,
    CardActions,
    Typography,
    Button,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Select,
    MenuItem
} from "@material-ui/core";
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import PrintIcon from '@mui/icons-material/Print';
import handleInvoiceClose from '../sales/Sales';

const Invoice = ({ data }) => {
    console.log(data);
    const handleInvoicePrint = (invoiceNumber) => {
        html2canvas(document.querySelector("#invoice")).then((canvas) => {
            const pdf = new jsPDF();
            const imgData = canvas.toDataURL('image/png');
            pdf.addImage(imgData, 'PNG', 0, 0);
            pdf.save(`invoice_${invoiceNumber}.pdf`);
            window.print();
        });
    };

    const handleInvoiceDownload = (invoiceNumber) => {
        html2canvas(document.querySelector("#invoice")).then((canvas) => {
            const pdf = new jsPDF();
            const imgData = canvas.toDataURL('image/png');
            pdf.addImage(imgData, 'PNG', 0, 0);
            pdf.save(`invoice_${invoiceNumber}.pdf`);
        });
    };
    return (
        <>
            <DialogContent>
                <div className="body">
                    <div className="invoice-box" id="invoice">
                        <table>
                            <tbody>
                                <tr className="top">
                                    <td colSpan={120}>
                                        <table>
                                            <tbody>
                                                <tr>
                                                    <td className="title1">
                                                        <img src={Logo} alt="Company logo" style={{ width: '70%', maxWidth: '300px', height: '150px' }} />
                                                    </td>
                                                    <td style={{ paddingLeft: '20px' }}>
                                                        Invoice #: {data.invoiceNumber}<br />
                                                        Date: {data.date}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                                <tr className="information">
                                    <td colSpan={110}>
                                        <table>
                                            <tbody>
                                                <tr>
                                                    <td>
                                                        No:43,<br />Imaduwa Road,<br />Ahangama
                                                    </td>
                                                    <td className="rightone">
                                                        Cashier<br />
                                                        {data.cashier}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                                <tr className="heading1" style={{ fontWeight: "bold" }}>
                                    <td>Payment Method</td>
                                    <td />
                                    <td />
                                    <td>Payment ID #</td>
                                </tr>
                                <tr className="details">
                                    <td>{data.paymentMethod}</td>
                                    <td />
                                    <td />
                                    <td>{data.paymentId}</td>
                                </tr>
                                <tr className="heading1" style={{ fontWeight: "bold" }}>
                                    <td>Product Code</td>
                                    <td align='left'>Name</td>
                                    <td>Quantity</td>
                                    <td>Price</td>
                                </tr>
                                {/* Render the items from the 'data' array */}
                                {data.items.map((item) => (
                                    <tr className="item">
                                        <td>{item.productcode}</td>
                                        <td align='left'>{item.name}</td>
                                        <td align='middle'>{item.quantity}</td>
                                        <td>{item.price.toLocaleString('en-IN', { style: 'currency', currency: 'LKR' })}</td>
                                    </tr>
                                ))}
                                <tr className="total">
                                    <td />
                                    <td />
                                    <td align='right'>Total:</td>
                                    <td>{data.total.toLocaleString('en-IN', { style: 'currency', currency: 'LKR' })}</td>
                                </tr>
                                <tr className="total">
                                    <td />
                                    <td />
                                    <td align='right'>Discount:</td>
                                    <td>{data.discount.toLocaleString('en-IN', { style: 'currency', currency: 'LKR' })}</td>
                                </tr>
                                <tr className="total">
                                    <td />
                                    <td />
                                    <td align='right'>Paid: :</td>
                                    <td>{data.paid.toLocaleString('en-IN', { style: 'currency', currency: 'LKR' })}</td>
                                </tr>
                            </tbody>
                        </table>
                        <p><br />Thank you for your purchase.<br />Please return this invoice when your are claming Warranty</p>
                    </div>
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => handleInvoiceDownload(data.invoiceNumber)} color="primary">
                    <CloudDownloadIcon /> Download Invoice
                </Button>
                <Button onClick={() => handleInvoicePrint(data.invoiceNumber)} color="primary">
                    <PrintIcon /> Print Invoice
                </Button>
            </DialogActions>
        </>
    )
}

export default Invoice
