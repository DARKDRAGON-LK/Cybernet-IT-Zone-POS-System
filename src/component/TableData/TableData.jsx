import React, { useState, useEffect } from 'react';
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
} from '@material-ui/core';
import Popup from './Popup';

const useStyles = makeStyles((theme) => ({
    tableContainer: {
      margin: theme.spacing(2),
    },
    tableHead: {
      backgroundColor: theme.palette.type === 'dark' ? '#424242' : '#f5f5f5',
    },
    tableHeadCell: {
      color: theme.palette.type === 'dark' ? '#fff' : '#000',
    },
    tableRow: {
      cursor: 'pointer',
    },
    table: {
        minWidth: 650,
      },
      button: {
        margin: theme.spacing(1),
      },
     }));

const TableData = () => {
  const classes = useStyles();
  const [rows, setRows] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [open, setOpen] = useState(false);

  // fetch data from SQL database
  useEffect(() => {
    fetch('/api/data')
      .then((response) => response.json())
      .then((data) => setRows(data))
      .catch((error) => console.log(error));
  }, []);

  // handle row click
  const handleRowClick = (row) => {
    setSelectedRow(row);
    setOpen(true);
  };

  // handle popup close
  const handlePopupClose = () => {
    setSelectedRow(null);
    setOpen(false);
  };

  return (
    <div>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>ItemOrder_No</TableCell>
              <TableCell>Supplier_ID</TableCell>
              <TableCell>Category_ID</TableCell>
              <TableCell>Product_Code</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Edit</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.ItemOrder_No} onClick={() => handleRowClick(row)}>
                <TableCell component="th" scope="row">
                  {row.ItemOrder_No}
                </TableCell>
                <TableCell>{row.Supplier_ID}</TableCell>
                <TableCell>{row.Category_ID}</TableCell>
                <TableCell>{row.Product_Code}</TableCell>
                <TableCell>{row.Date}</TableCell>
                <TableCell>{row.Quantity}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    onClick={() => handleRowClick(row)}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Popup row={selectedRow} open={open} onClose={handlePopupClose} />
    </div>
  );
};

export default TableData;
