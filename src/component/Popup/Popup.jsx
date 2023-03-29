import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Typography,
  Grid,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(2),
  },
}));

const Popup = ({ row, open, onClose }) => {
  const classes = useStyles();

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Edit Row</DialogTitle>
      <DialogContent>
        <DialogContentText>
          To edit this row, please update the fields below and click 'Save'.
        </DialogContentText>
        <div className={classes.root}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6">ItemOrder_No:</Typography>
              <Typography variant="body1">{row ? row.ItemOrder_No : ''}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6">Supplier_ID:</Typography>
              <Typography variant="body1">{row ? row.Supplier_ID : ''}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6">Category_ID:</Typography>
              <Typography variant="body1">{row ? row.Category_ID : ''}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6">Product_Code:</Typography>
              <Typography variant="body1">{row ? row.Product_Code : ''}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6">Date:</Typography>
              <Typography variant="body1">{row ? row.Date : ''}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6">Quantity:</Typography>
              <Typography variant="body1">{row ? row.Quantity : ''}</Typography>
            </Grid>
          </Grid>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Popup;
