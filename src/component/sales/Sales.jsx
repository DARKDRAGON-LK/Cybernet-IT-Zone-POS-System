import React, { useState, useEffect, useContext } from "react";
import Navbar from "../navbar/Navbar";
import Sidebar from "../sideBar/Sidebar";
import "../sales/Sales.css";
import { BsSearch } from "react-icons/bs";
import DeleteIcon from '@material-ui/icons/Delete';
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
import { makeStyles } from "@material-ui/core/styles";
import axios from 'axios';
import { ListItem } from "@mui/material";
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import { green, yellow } from "@mui/material/colors";
import { AuthContext } from '../AuthProvider/AuthProvider';
import Loader from '../Preloader/Loader';
import Invoice from "../Innoice/Invoice";
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import PrintIcon from '@mui/icons-material/Print';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
    marginBottom: 10,
  },
  media: {
    height: 140,
  },
});
const Sales = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [discount, setDiscount] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [invoiceopen, setInvoiceOpen] = useState(false);
  const [payOpen, setPayOpen] = useState(false);
  const [openerror, setopenerror] = useState(false);
  const [opensucc, setopensucc] = useState(false);
  const [listItems, setListItems] = useState([]);
  const [LastID, setLastID] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [totalPay, setTotalPay] = useState(0);
  const [LastPayID, setLastPayID] = useState(0);
  const [PaymentType, setPaymentType] = useState('');
  const [truelast, settruelast] = useState(0);
  const [EmpID, setEmpID] = useState("");
  const { user } = useContext(AuthContext);

  const itemslists = listItems.map(item => ({
    productcode: item.productcode,
    name: item.description,
    quantity: item.quantity,
    price: item.quantity * item.price,
  }));

  const initialInvoiceData = {
    invoiceNumber: LastID,
    date: new Date().toISOString().slice(0, 10),
    cashier: EmpID.EMP_ID,
    paymentMethod: PaymentType,
    paymentId: LastPayID,
    items: itemslists,
    total: totalAmount,
    discount: totalDiscount,
    paid: totalPay
  };
  useEffect(() => {
    axios.get('http://localhost:5000/api/salesproducts')
      .then(response => {
        const data = response.data;
        const filteredData = data.filter((item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setSearchResults(filteredData);
      })
      .catch(error => {
        console.log(error);
      });
  }, [searchTerm]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/sales/lastid')
      .then(response => setLastID(response.data))
      .catch(error => console.error(error));
  }, []);

  useEffect(() => {
    axios.get('http://localhost:5000/api/sales/truelastid')
      .then(response => settruelast(response.data))
      .catch(error => console.error(error));
  }, []);

  useEffect(() => {
    const Username = user;
    axios.post('http://localhost:5000/api/empid', { Username })
      .then(response => {
        setEmpID(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, [user]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/payment/lastid')
      .then(response => setLastPayID(response.data))
      .catch(error => console.error(error));
  }, []);

  const handleAddItemClick = (item) => {
    setSelectedItem(item);
    setQuantity(1);
    setDiscount(0);
    setDialogOpen(true);
  };

  const handleQuantityChange = (event) => {
    setQuantity(parseInt(event.target.value));
  };

  const handlePaymentTypeChange = (event) => {
    setPaymentType(event.target.value);
  };

  const handleDiscountChange = (event) => {
    setDiscount(parseInt(event.target.value));
  };

  const handlePayClick = () => {
    console.log(listItems);
    listItems.length > 0 ? (
      setPayOpen(true)
    ) : (
      setopenerror(true)
    )
  };

  const handleAddToList = () => {
    const newItem = {
      id: selectedItem.id,
      productcode: selectedItem.productcode,
      description: selectedItem.Description,
      name: selectedItem.name,
      price: selectedItem.price,
      quantity,
      discount,
    };
    setListItems([...listItems, newItem]);

    const itemAmount = selectedItem.price * quantity;
    const itemDiscount = (itemAmount * discount) / 100;
    const itemPay = itemAmount - itemDiscount;
    setTotalAmount(totalAmount + itemAmount);
    setTotalDiscount(totalDiscount + itemDiscount);
    setTotalPay(totalPay + itemPay);
    console.log(totalPay);
    handleDialogClose();
  };

  const handleRemoveFromList = (id) => {
    const updatedListItems = listItems.filter((item) => item.id !== id);
    setListItems(updatedListItems);

    const removedItem = listItems.find((item) => item.id === id);
    const itemAmount = removedItem.price * removedItem.quantity;
    const itemDiscount = (itemAmount * removedItem.discount) / 100;
    const itemPay = itemAmount - itemDiscount;
    setTotalAmount(totalAmount - itemAmount);
    setTotalDiscount(totalDiscount - itemDiscount);
    setTotalPay(totalPay - itemPay);
  };
  const handleDialogClose = () => {
    setSelectedItem(null);
    setDialogOpen(false);
  };

  const handleCloseError = () => {
    setopenerror(false);
  };
  const handleClosesucc = () => {
    setopensucc(false);
    window.location.reload();
  };

  const handleInvoiceClose = () => {
    setInvoiceOpen(false);
    window.location.reload();
  };

  const handleviewInvoice = () => {
    setopensucc(false);
    setInvoiceOpen(true);
  };

  const handlePayDialogClose = () => {
    setSelectedItem(null);
    setPayOpen(false);
  };
  const handlePaySubmit = (event) => {
    event.preventDefault();
    addDataPayment();
    addDataInvoce();
    addInvoiceItem();
    setPayOpen(false);
    setopensucc(true);
  };

  const addDataPayment = () => {
    const paymentData = {
      Payment_ID: LastPayID,
      Payment_Type: PaymentType,
    };
    axios.post('http://localhost:5000/api/payment/add', paymentData)
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.error(error);
      });
  };
  const today = new Date().toISOString().slice(0, 10);
  const addDataInvoce = () => {
    const InvoceData = {
      Invoice_No: LastID,
      Payment_ID: LastPayID,
      EMP_ID: EmpID.EMP_ID,
      Date: new Date().toISOString().slice(0, 10),
      Total: totalPay,
    };
    axios.post('http://localhost:5000/api/invoice/add', InvoceData)
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.error(error);
      });
  };
  const addInvoiceItem = () => {
    Promise.all(
      listItems.map(async (item) => {
        const ItemData = {
          Invoice_No: truelast,
          Product_Code: item.productcode,
          Quantity: item.quantity,
        };
        console.log(ItemData);
        try {
          const response = await axios
            .post("http://localhost:5000/api/invoiceitem/add", ItemData);
          console.log(response);
        } catch (error) {
          console.error(error);
        }
      })
    ).then(() => {
      console.log("All items added successfully");
    });
  };


  const classes = useStyles();
  if (!user) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontSize: '1.2rem' }}>
        <div className="loderarea">
          <div className="preloader"><Loader />
            <p className="Hedding">You must be logged in to view this page.</p></div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="mainframesale">
        <div className="topbar">
          <Navbar />
        </div>

        <div className="frame2sale">
          <div className="sidebar">
            <Sidebar />
          </div>
          <div className="middleframe">
            <div className="itemSearch">
              <div className="searchcontainer">
                <input
                  width="350px"
                  className="searcharea"
                  type="text"
                  placeholder="Search.."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div><br /></div>
                <Dialog
                  open={invoiceopen}
                  onClose={handleInvoiceClose}
                  PaperProps={{ style: { width: '800px', maxWidth: '90%', height: "900px" } }}
                >
                  <DialogTitle>Invoice</DialogTitle>
                  <DialogContent>
                    <Invoice data={initialInvoiceData} id="invoice" />
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleInvoiceClose} style={{ color: "red" }}>
                      Close
                    </Button>
                  </DialogActions>
                </Dialog>

                <Dialog open={dialogOpen} onClose={handleDialogClose}>
                  <DialogTitle>Add Item to Order</DialogTitle>
                  <DialogContent>
                    <Typography>{selectedItem && selectedItem.name}</Typography>
                    <TextField
                      label="Quantity"
                      variant="outlined"
                      value={quantity}
                      onChange={handleQuantityChange}
                      style={{ marginBottom: '1rem', marginTop: '1rem' }}
                      fullWidth
                    />
                    <br />
                    <TextField
                      label="Discount %"
                      variant="outlined"
                      value={discount}
                      onChange={handleDiscountChange}
                      style={{ marginBottom: '1rem' }}
                      fullWidth
                    />
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleDialogClose} color="primary">
                      Cancel
                    </Button>
                    <Button onClick={handleAddToList} color="primary">
                      Add
                    </Button>
                  </DialogActions>
                </Dialog>
                <Dialog open={payOpen} onClose={handlePayDialogClose}>
                  <DialogTitle>Add Payment</DialogTitle>
                  <DialogContent>
                    <Typography>{selectedItem && selectedItem.name}</Typography>
                    <TextField
                      label="Payment ID"
                      disabled
                      variant="outlined"
                      value={LastPayID}
                      style={{ marginBottom: '1rem', marginTop: '1rem' }}
                      fullWidth
                    />
                    <br />
                    <Select
                      label="Payment type"
                      variant="outlined"
                      value={PaymentType}
                      onChange={handlePaymentTypeChange}
                      style={{ marginBottom: '1rem' }}
                      fullWidth
                    >
                      <MenuItem value="Cash"><LocalAtmIcon style={{ color: 'green' }} /> Cash</MenuItem>
                      <MenuItem value="Card"><CreditCardIcon style={{ color: 'brown' }} /> Card</MenuItem>
                    </Select>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handlePayDialogClose} color="primary">
                      Cancel
                    </Button>
                    <Button id="handlePaySubmit" onClick={handlePaySubmit} color="primary">
                      Pay
                    </Button>
                  </DialogActions>
                </Dialog>
              </div>
              <Dialog open={openerror} onClose={handleCloseError}>
                <DialogTitle>You need to add items</DialogTitle>
                <DialogContent>
                  <Typography>Please add items to your order.</Typography>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseError} color="primary">
                    OK
                  </Button>
                </DialogActions>
              </Dialog>
              <Dialog open={opensucc} onClose={handleClosesucc}>
                <DialogTitle>Success</DialogTitle>
                <DialogContent>
                  <Typography><CheckCircleOutlineIcon style={{ color: "green", fontSize: 50 }} />Order Successfuly</Typography>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClosesucc} color="primary">
                    OK
                  </Button>
                  <Button onClick={handleviewInvoice} color="primary">
                    View Invoice
                  </Button>
                </DialogActions>
              </Dialog>
            </div>
            <div className="cardcontainer">
              {searchResults.map((item) => (
                <Card className={classes.root} key={item.id}>
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                      {item.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                      Price: Rs.{item.price}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      color="primary"
                      onClick={() => handleAddItemClick(item)} >
                      Add
                    </Button>
                  </CardActions>
                </Card>
              ))}
            </div>
          </div>

          <div className="salesarea1">
            <div className="itemadding">
              <div className="itemsection">
                <Typography variant="h6" style={{ color: "white" }}>Order #{LastID}</Typography>
                {listItems.map((item) => (
                  <Card className={classes.root} key={item.id}>
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="h2">
                        {item.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" component="p">
                        Price: {item.price} | Quantity: {item.quantity} | Discount:{" "}
                        {item.discount}%
                      </Typography>
                      <CardActions style={{ cursor: "pointer" }}>
                        <DeleteIcon style={{ color: 'red' }} onClick={() => handleRemoveFromList(item.id)} />
                      </CardActions>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>


            <div className="calculation">
              <div className="amount">
                <h4>Amount : Rs.{totalAmount}</h4>
                <div></div>
              </div>
              <div className="discount">
                <h4>Discount : Rs.{totalDiscount}</h4>
                <div></div>
              </div>

              <div className="pay">
                <h4>Pay  : Rs.{totalPay} </h4>
              </div>
              <div className="paybuttton" onClick={handlePayClick}>
                <div className="paybuttontext"><h4>Pay </h4></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Sales;

