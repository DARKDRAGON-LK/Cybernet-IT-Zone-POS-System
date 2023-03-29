import React, { useState, useEffect, useContext } from "react";
import { BsSearch } from "react-icons/bs";
import Slider from "react-slick";
import Navbar from "../navbar/Navbar";
import Sidebar from "../sideBar/Sidebar";
import "./Product.css";
import { sliderdata } from "../Sliders/Sliderdata";
import { MdDelete, MdModeEdit } from "react-icons/md";
import { AuthContext } from '../AuthProvider/AuthProvider';
import Loader from '../Preloader/Loader';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
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
  MenuItem,
  Grid,
  FormControl,
  InputLabel
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import axios from 'axios';
import AddIcon from '@mui/icons-material/Add';

const classes = makeStyles({
  root: {
    maxWidth: 345,
    marginBottom: 10,
    width: 150
  },
  media: {
    height: 140,
  },
});
const initialFormData = {
  id: '',
  Product_Code: '',
  Category_ID: '',
  Name: '',
  Cost: '',
  Price: '',
  Description: '',
};

function Product() {

  const { user } = useContext(AuthContext);
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [catid, setCatid] = useState(0);
  const [formData, setFormData] = useState(initialFormData);
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [openedit, setOpenedit] = useState(false);
  const [LastID, setLastID] = useState(0);

  const handleClickOpen = (row) => {
    setFormData(row);
    console.log(formData);
    setOpenedit(true);
  };

  console.log(formData);
  const handleClickOpenEdit = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setFormData(initialFormData);
    setOpen(false);
  };

  const handleCloseedit = () => {
    setFormData(initialFormData);
    setOpenedit(false);
  };

  const handleFormChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/product/add', formData);
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
    setFormData({ ...formData, id: LastID });
    try {
      const response = await axios.post(`http://localhost:5000/api/product/edit`, formData);
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
      const response = await axios.delete(`http://localhost:5000/api/product/delete/${id}`);
      setData(data.filter((row) => row.ItemOrder_No !== id));
      alert(response.data.message);
    } catch (error) {
      alert(error);
    }
    window.location.reload();
  };

  useEffect(() => {
    axios.get('http://localhost:5000/api/itemorders/lastid')
      .then(response => setLastID(response.data),setFormData({ ...formData, id: LastID }))
      .catch(error => console.error(error));
  }, []);

  useEffect(() => {
    axios.get('http://localhost:5000/api/category/type')
      .then(response => setCategories(response.data))
      .catch(error => console.error(error));
  }, []);

  useEffect(() => {
    axios.get('http://localhost:5000/api/products')
      .then(response => {
        const data = response.data;
        let filteredData = data.filter((item) =>
          item.Name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        if (selectedCategory !== "") {
          filteredData = filteredData.filter((item) =>
            item.Category === selectedCategory
          );
        }
        setSearchResults(filteredData);
      })
      .catch(error => {
        console.log(error);
      });
  }, [searchTerm, selectedCategory]);


  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  initialFormData.id = LastID;
  console.log(initialFormData.id);

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
              <div className="searchSection">
                <div className="searchbar">
                  <input
                    width="350px"
                    className="searcharea"
                    type="text"
                    placeholder="Search.."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <Grid container alignItems="center">
                <Grid item xs={6} align="left">
                  <FilterAltIcon style={{ color: 'white', margin: 10 }} />
                  <Select
                    labelId="category-select-label"
                    id="category-select"
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                    placeholder="Select Category"
                    style={{ margin: 30, width: 150, color: 'white' }}
                  >
                    <MenuItem value="">All categories</MenuItem>
                    {categories.map((category) => (
                      <MenuItem key={category.id} value={category.Name}>
                        {category.Description}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
                <Grid item xs={6} align="right">
                  <Button
                    variant="contained"
                    color="primary"
                    disabled={user !== "Admin"}
                    startIcon={<AddIcon />}
                    onClick={handleClickOpenEdit}
                  >
                    Add Product
                  </Button>
                </Grid>
              </Grid>
            </div>
            <Dialog open={openedit} onClose={handleClose}>
              <form onSubmit={handleSubmitEdit}>
                <DialogTitle>Edit Product</DialogTitle>
                <DialogContent>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="Product_Code"
                    name="Product_Code"
                    label="Product_Code"
                    type="text"
                    value={formData.Product_Code}
                    onChange={handleFormChange}
                    fullWidth
                    disabled={user !== "Admin"}
                  />
                  <Select
                    margin="dense"
                    id="Category_ID"
                    name="Category_ID"
                    label="Category ID"
                    value={formData.Category_ID}
                    onChange={handleFormChange}
                    fullWidth
                    disabled={user !== "Admin"}
                  >
                    {categories.map((category) => (
                      <MenuItem key={category.Category_ID} value={category.Category_ID}>
                        {category.Description}
                      </MenuItem>
                    ))}
                  </Select>
                  <TextField
                    margin="Name"
                    id="Name"
                    name="Name"
                    label="Name"
                    type="text"
                    value={formData.Name}
                    onChange={handleFormChange}
                    fullWidth
                    disabled={user !== "Admin"}
                  />
                  <TextField
                    margin="dense"
                    id="Cost"
                    name="Cost"
                    label="Cost"
                    value={formData.Cost}
                    onChange={handleFormChange}
                    fullWidth
                    disabled={user !== "Admin"}
                  />
                  <TextField
                    margin="dense"
                    id="Price"
                    name="Price"
                    label="Price"
                    value={formData.Price}
                    onChange={handleFormChange}
                    fullWidth
                    disabled={user !== "Admin"}
                  />
                  <TextField
                    margin="dense"
                    id="Description"
                    name="Description"
                    label="Description"
                    type="text"
                    value={formData.Description}
                    onChange={handleFormChange}
                    fullWidth
                    disabled={user !== "Admin"}
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseedit} color="secondary">
                    Cancel
                  </Button>
                  <Button type="submit" color="primary" disabled={user !== "Admin"}>
                    Edit
                  </Button>
                </DialogActions>
              </form>
            </Dialog>
            <Dialog open={open} onClose={handleClose}>
              <form onSubmit={handleSubmit}>
                <DialogTitle>Add  Product</DialogTitle>
                <DialogContent>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="Product_Code"
                    name="Product_Code"
                    label="Product_Code"
                    type="text"
                    value={formData.Product_Code}
                    onChange={handleFormChange}
                    fullWidth
                  />
                  <Select
                    margin="dense"
                    id="Category_ID"
                    name="Category_ID"
                    label="Category ID"
                    value={formData.Category_ID}
                    onChange={handleFormChange}
                    fullWidth
                  >
                    {categories.map((category) => (
                      <MenuItem key={category.Category_ID} value={category.Category_ID}>
                        {category.Description}
                      </MenuItem>
                    ))}
                  </Select>
                  <TextField
                    margin="Name"
                    id="Name"
                    name="Name"
                    label="Name"
                    type="text"
                    value={formData.Name}
                    onChange={handleFormChange}
                    fullWidth
                  />
                  <TextField
                    margin="dense"
                    id="Cost"
                    name="Cost"
                    label="Cost"
                    value={formData.Cost}
                    onChange={handleFormChange}
                    fullWidth
                  />
                  <TextField
                    margin="dense"
                    id="Price"
                    name="Price"
                    label="Price"
                    value={formData.Price}
                    onChange={handleFormChange}
                    fullWidth
                  />
                  <TextField
                    margin="dense"
                    id="Description"
                    name="Description"
                    label="Description"
                    type="text"
                    value={formData.Description}
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
            <div className="contentaa">
              <div className="cardcontainer1">
                {searchResults.map((item) => (
                  <Card className={classes.root} key={item.id} style={{ maxWidth: 350, gap: 30 }}>
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="h2">
                        {item.Name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" component="p">
                        Product Code: {item.Product_Code}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" component="p">
                        Category: {item.Category}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" component="p">
                        Cost: Rs.{item.Cost}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        component="p"
                        style={{ fontWeight: "bold" }}
                      >
                        Price: Rs.{item.Price}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" component="p">
                        Item Left: {item.Quantity > 0 ? item.Quantity : 'Out of stock'}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button
                        size="small"
                        color="primary"
                        onClick={() => handleClickOpen(item)}
                      >
                        View
                      </Button>
                      {user === "Admin" && (
                        <>
                          <Button size="small" color="primary" onClick={() => handleClickOpen(item)}>
                            Edit
                          </Button>
                          <Button size="small" style={{ color: "red" }} onClick={() => handleDelete(item.Product_Code)} >
                            Delete
                          </Button>
                        </>
                      )}
                    </CardActions>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Product;