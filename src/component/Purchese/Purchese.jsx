import React, { useState, useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Grid,
} from '@material-ui/core';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { orange, blue, red } from '@material-ui/core/colors';
import { BsSearch } from "react-icons/bs";
import Navbar from "../navbar/Navbar";
import Sidebar from "../sideBar/Sidebar";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { AuthContext } from '../AuthProvider/AuthProvider';
import Loader from '../Preloader/Loader';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: blue[500],
    },
    secondary: {
      main: red[500],
    },
  },
});

const initialFormData = {
  ItemOrder_No: '',
  Supplier_ID: '',
  Category_ID: '',
  Product_Code: '',
  Date: '',
  Quantity: '',
};

const fdt1 = {
  Supplier_ID: '',
  Category_ID: '',
  Product_Code: '',
  Date: '',
  Quantity: '',
};

function Purchese() {
  const classes = useStyles();
  const [data, setData] = useState([]);
  const [LastID, setLastID] = useState(0);
  const [rowID, setrowID] = useState(0);
  const [open, setOpen] = useState(false);
  const [openedit, setOpenedit] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const { user } = useContext(AuthContext);

  const handleClickOpen = (row) => {
    setFormData(row);
    console.log(row);
    setOpenedit(true);
    console.log(rowID);
  };



  const handleClickOpenEdit = () => {
    const newFormData = { ...fdt1, ItemOrder_No: LastID };
    console.log(newFormData);
    setFormData(newFormData);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseedit = () => {
    setOpenedit(false);
  };

  const handleFormChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/itemorders', formData);
      setData([...data, response.data]);
      setFormData(initialFormData);
      alert(response.data.message);
      handleClose();
      window.location.reload();
    } catch (error) {
      alert(error);
    }
  };

  const handleSubmitEdit = async (id) => {
    try {
      const response = await axios.post(`http://localhost:5000/api/itemordersedit`, formData);
      setData([...data, response.data]);
      setFormData(initialFormData);
      alert(response.data.message);
      handleClose();
    } catch (error) {
      alert(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/itemordersdelete/${id}`);
      setData(data.filter((row) => row.ItemOrder_No !== id));
      alert(response.data.message);
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    axios.get('http://localhost:5000/api/itemorders')
      .then(response => setData(response.data))
      .catch(error => console.error(error));
    console.log(data);
  }, []);

  useEffect(() => {
    axios.get('http://localhost:5000/api/itemorders/lastid')
      .then(response => setLastID(response.data))
      .catch(error => console.error(error));
  }, []);

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
    if (user !== "Admin") {
      return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontSize: '1.2rem' }}>
          <div className="loderarea">
            <div className="preloader"><Loader />
              <p className="Hedding">You Dont have Permission to view this page.</p></div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="mainframe">
          <div className="navbar">
            <Navbar />
          </div>
          <div className="frame2">
            <div>
              <Sidebar />
            </div>
            <div className="frame3">
              <div className="secondNavbar">
                {/* <div className="searchSection">
              <div className="searchbar">
                <input
                  className="textInput"
                  type="text"
                  placeholder="Search..."
                />
                <div className="searchIcon">
                  <BsSearch />
                </div>
              </div>
            </div> */}
              </div>

              <div className="content1" style={{ padding: 20, margin: 10 }}>
                <div className="laptopconteiner">
                  <ThemeProvider theme={theme}>
                    <Grid container alignItems="center">
                      <Grid item xs={6} align="left">
                        <Typography variant="h5" component="h1" color="textPrimary">
                          Recent Item Purchases
                        </Typography>
                      </Grid>
                      <Grid item xs={6} align="right">
                        <Button
                          variant="contained"
                          className={classes.addButton}
                          onClick={handleClickOpenEdit}
                          startIcon={<AddIcon />}
                        >
                          New Item Order
                        </Button>
                      </Grid>
                    </Grid>
                    <br />
                    <Dialog open={openedit} onClose={handleClose}>
                      <form onSubmit={handleSubmitEdit}>
                        <DialogTitle>Edit Item Order</DialogTitle>
                        <DialogContent>
                          <TextField
                            autoFocus
                            margin="dense"
                            id="ItemOrder_No"
                            name="ItemOrder_No"
                            label="Item Order No"
                            type="number"
                            value={formData.ItemOrder_No}
                            onChange={handleFormChange}
                            fullWidth
                            disabled
                          />
                          <TextField
                            margin="dense"
                            id="Supplier_ID"
                            name="Supplier_ID"
                            label="Supplier ID"
                            type="text"
                            value={formData.Supplier_ID}
                            onChange={handleFormChange}
                            fullWidth
                          />
                          <TextField
                            margin="dense"
                            id="Category_ID"
                            name="Category_ID"
                            label="Category ID"
                            type="text"
                            value={formData.Category_ID}
                            onChange={handleFormChange}
                            fullWidth
                          />
                          <TextField
                            margin="dense"
                            id="Product_Code"
                            name="Product_Code"
                            label="Product Code"
                            value={formData.Product_Code}
                            onChange={handleFormChange}
                            fullWidth
                          />
                          <TextField
                            margin="dense"
                            id="Date"
                            name="Date"
                            label="Date"
                            type="date"
                            value={formData.Date}
                            onChange={handleFormChange}
                            fullWidth
                          />
                          <TextField
                            margin="dense"
                            id="Quantity"
                            name="Quantity"
                            label="Quantity"
                            type="number"
                            value={formData.Quantity}
                            onChange={handleFormChange}
                            fullWidth
                          />
                        </DialogContent>
                        <DialogActions>
                          <Button onClick={handleCloseedit} color="secondary">
                            Cancel
                          </Button>
                          <Button type="submit" color="primary">
                            Edit
                          </Button>
                        </DialogActions>
                      </form>
                    </Dialog>
                    <Dialog open={open} onClose={handleClose}>
                      <form onSubmit={handleSubmit}>
                        <DialogTitle>Add Item Order</DialogTitle>
                        <DialogContent>
                          <TextField
                            autoFocus
                            margin="dense"
                            id="ItemOrder_No"
                            name="ItemOrder_No"
                            label="Item Order No"
                            type="number"
                            value={formData.ItemOrder_No}
                            onChange={handleFormChange}
                            fullWidth
                            disabled
                          />
                          <TextField
                            margin="dense"
                            id="Supplier_ID"
                            name="Supplier_ID"
                            label="Supplier ID"
                            type="text"
                            value={formData.Supplier_ID}
                            onChange={handleFormChange}
                            fullWidth
                          />
                          <TextField
                            margin="dense"
                            id="Category_ID"
                            name="Category_ID"
                            label="Category ID"
                            type="text"
                            value={formData.Category_ID}
                            onChange={handleFormChange}
                            fullWidth
                          />
                          <TextField
                            margin="dense"
                            id="Product_Code"
                            name="Product_Code"
                            label="Product Code"
                            value={formData.Product_Code}
                            onChange={handleFormChange}
                            fullWidth
                          />
                          <TextField
                            margin="dense"
                            id="Date"
                            name="Date"
                            label="Date"
                            type="date"
                            value={formData.Date}
                            onChange={handleFormChange}
                            fullWidth
                          />
                          <TextField
                            margin="dense"
                            id="Quantity"
                            name="Quantity"
                            label="Quantity"
                            type="number"
                            value={formData.Quantity}
                            onChange={handleFormChange}
                            fullWidth
                          />
                        </DialogContent>
                        <DialogActions>
                          <Button onClick={handleClose} color="secondary">
                            Cancel
                          </Button>
                          <Button type="submit" color="primary">
                            Add
                          </Button>
                        </DialogActions>
                      </form>
                    </Dialog>
                    <TableContainer component={Paper}>
                      <Table className={classes.table} aria-label="simple table">
                        <TableHead>
                          <TableRow>
                            <TableCell>Item Order No</TableCell>
                            <TableCell>Supplier ID</TableCell>
                            <TableCell>Category ID</TableCell>
                            <TableCell>Product Code</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Quantity</TableCell>
                            <TableCell>Action</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {data.map((row) => (
                            <TableRow key={row.ItemOrder_No}>
                              <TableCell>{row.ItemOrder_No}</TableCell>
                              <TableCell>{row.Supplier_ID}</TableCell>
                              <TableCell>{row.Category_ID}</TableCell>
                              <TableCell>{row.Product_Code}</TableCell>
                              <TableCell>{row.Date}</TableCell>
                              <TableCell>{row.Quantity}</TableCell>
                              <TableCell>
                                <Grid container spacing={1} alignItems="left" sx={{ '& button': { m: 1 } }}>
                                  <Grid item>
                                    <Button
                                      color="primary"
                                      className={classes.editButton}
                                      onClick={() => handleClickOpen(row)}>
                                      <EditIcon />
                                    </Button>
                                  </Grid>
                                  <Grid item>
                                    <Button
                                      color="Secondary"
                                      className={classes.deleteButton} onClick={() => handleDelete(row.ItemOrder_No)}>
                                      <DeleteIcon />
                                    </Button>
                                  </Grid>
                                </Grid>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </ThemeProvider>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
}

export default Purchese;