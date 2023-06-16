const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require("bcrypt");

const app = express();
const port = 5000;
const saltRounds = Your Salt Round Number;

app.use(cors());
app.use(bodyParser.json());

// create mysql connection
let connection;

function handleDisconnect() {
  connection = mysql.createConnection({
    host: 'Your MySQL Server IP',
    user: 'Your User',
    password: 'Your Password
    database: 'Your Database Name'
  });
  connection.connect((err) => {
    if (err) {
      console.error('Error connecting to database: ' + err.stack);
      setTimeout(handleDisconnect, 2000);
    } else {
      console.log('Connected to database as ID ' + connection.threadId);
    }
  });

 // connect to mysql database
  connection.on('error', (err) => {
    console.error('Database error: ' + err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      handleDisconnect();
    } else {
      throw err;
    }
  });
}

handleDisconnect();

//////////////////////// BACKEND OF LOGIN ////////////////////////

app.post("/login", (req, res) => {
  const Username = req.body.Username;
  const Password = req.body.Password;
  connection.query(
    "SELECT Username,Password FROM Employee WHERE Username = ?;",
    Username,
    (err, result) => {
      if (err) {
        res.send({ err: err });
      }
      if (result.length > 0) {
        bcrypt.compare(Password, result[0].Password, (error, response) => {
          if (response) {
            res.send(result[0]);
          } else {
            res.send({ message: "Wrong username/password combination!" });
          }
        });
      } else {
        res.send({ message: "User doesn't exist" });
      }
    }
  );
});

//////////////////////// BACKEND OF DASHBOARD ////////////////////////

// fetch recent transactions from database
app.get('/api/recenttransactions', (req, res) => {
  const sql = 'SELECT i.Invoice_No, i.EMP_ID, i.Date, p.Payment_Type, i.Total FROM Invoice i JOIN Payment p ON i.Payment_ID = p.Payment_ID ORDER BY i.Date DESC LIMIT 5';
  connection.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      const data = results.map(result => ({
        ...result,
        Date: new Date(result.Date + 'Z').toISOString().slice(0, 10)
      }));
      res.json(data);
    }
  });
});

// fetch sales for chart from database
app.get('/api/chart/sales', (req, res) => {
  const sql = 'SELECT i.Date,SUM(s.Quantity) AS Sales FROM Invoice i JOIN invoice_Items s ON i.Invoice_No = s.Invoice_No GROUP BY i.Date ORDER BY i.Date';
  connection.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      const data = results.map(result => ({
        ...result,
        Date: new Date(result.Date + 'Z').toISOString().slice(0, 10)
      }));
      res.json(data);
    }
  });
});

// fetch income data for chart from database
app.get('/api/chart/income', (req, res) => {
  const sql = 'SELECT Date, SUM(Total) AS Income FROM Invoice GROUP BY Date ORDER BY Date';
  connection.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      const data = results.map(result => ({
        ...result,
        Date: new Date(result.Date + 'Z').toISOString().slice(0, 10)
      }));
      res.json(data);
    }
  });
});

//////////////////////// BACKEND OF SALES ////////////////////////

// fetch item orders from database
app.get('/api/salesproducts', (req, res) => {
  const sql = 'SELECT id, Product_Code AS productcode , Name AS name, Price AS price, Description FROM Product';
  connection.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(results);
    }
  });
});

// fetch employeeid from database
app.post('/api/empid', (req, res) => {
  const { Username } = req.body;
  connection.query('SELECT EMP_ID FROM Employee WHERE Username = ?', [Username], (err, results) => {
    if (err) {
      console.error(err);
      res.sendStatus(500);
    } else {
      res.send(results[0]);
    }
  });
});
// get last inserted ID + 1 of Invocie from database
app.get('/api/sales/lastid', (req, res) => {
  const sql = 'SELECT MAX(Invoice_No) AS LastID FROM Invoice';
  connection.query(sql, (err, result) => {
    if (err) throw err;
    res.json(result[0].LastID+1);
  });
});

// get last inserted ID of Invocie from database
app.get('/api/sales/truelastid', (req, res) => {
  const sql = 'SELECT MAX(Invoice_No) AS LastID FROM Invoice';
  connection.query(sql, (err, result) => {
    if (err) throw err;
    res.json(result[0].LastID+1);
  });
});

// get last inserted ID of payment from database
app.get('/api/payment/lastid', (req, res) => {
  const sql = 'SELECT MAX(Payment_ID) AS LastID FROM Payment';
  connection.query(sql, (err, result) => {
    if (err) throw err;
    res.json(result[0].LastID+1);
  });
});

// add new invoice to database
app.post('/api/invoice/add', (req, res) => {
  const { Invoice_No,Payment_ID,EMP_ID,Date,Total } = req.body;
  const sql = 'INSERT INTO Invoice (Invoice_No,Payment_ID,EMP_ID,Date,Total) VALUES (?,?,?,?,?)';
  connection.query(sql, [Invoice_No,Payment_ID,EMP_ID,Date,Total], (err, result) => {
    if (err) throw err;
    res.json({ message: 'Invoice added successfully.' });
  });
});

// add new payment to database
app.post('/api/payment/add', (req, res) => {
  const { Payment_ID,Payment_Type } = req.body;
  const sql = 'INSERT INTO Payment (Payment_ID,Payment_Type) VALUES (?,?)';
  connection.query(sql, [Payment_ID,Payment_Type], (err, result) => {
    if (err) throw err;
    res.json({ message: 'Payment successfully.' });
  });
});

// add new payment to database
app.post('/api/invoiceitem/add', (req, res) => {
  const { Invoice_No, Product_Code, Quantity } = req.body;

  // insert the invoice item into the invoice_items table
  const insertQuery = 'INSERT INTO invoice_Items (Invoice_No, Product_Code, Quantity) VALUES (?, ?, ?)';
  connection.query(insertQuery, [Invoice_No, Product_Code, Quantity], (insertErr, insertResult) => {
    if (insertErr) throw insertErr;

    // get the current quantity of the product from the stock table
    const stockQuery = 'SELECT Quantity FROM Stock WHERE Product_Code = ?';
    connection.query(stockQuery, [Product_Code], (stockErr, stockResult) => {
      if (stockErr) throw stockErr;

      const currentQuantity = stockResult[0].Quantity;
      const newQuantity = currentQuantity - Quantity;

      // update the stock table with the new quantity
      const updateQuery = 'UPDATE Stock SET Quantity = ? WHERE Product_Code = ?';
      connection.query(updateQuery, [newQuantity, Product_Code], (updateErr, updateResult) => {
        if (updateErr) throw updateErr;

        res.json({ message: 'Order added successfully.' });
      });
    });
  });
});

//////////////////////// BACKEND OF PRODUCT ////////////////////////

// fetch product from database
app.get('/api/products', (req, res) => {
  const sql = 'SELECT p.id,p.Category_ID, p.Product_Code, p.Name, c.Name AS Category, p.Cost, p.Price, s.Quantity, p.Description FROM Product p JOIN Category c ON p.Category_ID = c.Category_ID JOIN Stock s ON p.Product_Code = s.Product_Code';
  connection.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(results);
    }
  });
});

// fetch Category tpyes from database
app.get('/api/category/type', (req, res) => {
  const sql = 'SELECT * FROM Category';
  connection.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(results);
    }
  });
});

// add new product to database
app.post('/api/product/add', (req, res) => {
  const { id,Product_Code,Category_ID, Name, Cost, Price, Description } = req.body;
  const quantity = 0; // set quantity to 0
  const sql = 'INSERT INTO Product (id,Product_Code,Category_ID, Name, Cost, Price, Description) VALUES (?,?, ?, ?, ?, ?,?)';
  connection.query(sql, [id,Product_Code,Category_ID, Name, Cost, Price, Description], (err, result) => {
    if (err) throw err;
    const stock_sql = 'INSERT INTO Stock (Product_Code, Quantity, Category_ID) VALUES (?, ?, ?)';
    connection.query(stock_sql, [Product_Code, quantity, Category_ID], (err, result) => {
      if (err) throw err;
      res.json({ message: 'Product added successfully.' });
    });
  });
});


//edit product
app.post('/api/product/edit', (req, res) => {
    const { Product_Code,Category_ID, Name, Cost, Price, Description } = req.body;
    const id = req.body.Product_Code
    const sql = "UPDATE Product SET Product_Code = ?, Category_ID = ?, Name = ?, Cost = ?, Price = ?, Description = ?  WHERE Product_Code = '"+id+"'";
    connection.query(sql, [Product_Code,Category_ID, Name, Cost, Price, Description], (err, result) => {
      if (err) throw err;
      res.json({ message: 'Product edited successfully.' });
    });
  });

// get last inserted ID of item order from database
app.get('/api/product/lastid', (req, res) => {
  const sql = 'SELECT MAX(id) AS LastID FROM Product';
  connection.query(sql, (err, result) => {
    if (err) throw err;
    res.json(result[0].LastID+1);
  });
});

// data delete

app.delete('/api/product/delete/:id', (req, res) => {
  const Product_Code = req.params.id;
  const sql = `DELETE FROM Product WHERE Product_Code = ?`;
  connection.query(sql, Product_Code, (error, results) => {
    if (error) throw error;
    const stock_sql = `DELETE FROM Stock WHERE Product_Code = ?`;
    connection.query(stock_sql, Product_Code, (error, results) => {
      if (error) throw error;
      
      res.json({ message: 'Product and stock record deleted successfully.' });
    });
  });
});

//////////////////////// BACKEND OF PURCHESE ////////////////////////

// fetch item orders from database
app.get('/api/itemorders', (req, res) => {
    const sql = 'SELECT * FROM Item_Order ORDER BY ItemOrder_No DESC LIMIT 25';
    connection.query(sql, (err, results) => {
      if (err) throw err;
      const data = results.map(result => ({
        ...result,
        Date: new Date(result.Date + 'Z').toISOString().slice(0, 10)
      }));
      res.json(data);
    });
  });

// add new item order to database
app.post('/api/itemorders', (req, res) => {
  const { ItemOrder_No,Supplier_ID, Category_ID, Product_Code, Date, Quantity } = req.body;
  const sql = 'INSERT INTO Item_Order (ItemOrder_No,Supplier_ID, Category_ID, Product_Code, Date, Quantity) VALUES (?,?,?,?,?,?)';
  const selectSql = 'SELECT Quantity FROM Stock WHERE Product_Code = ?';
  const updateSql = 'UPDATE Stock SET Quantity = ? WHERE Product_Code = ?';

  connection.beginTransaction((err) => {
    if (err) throw err;
    connection.query(sql, [ItemOrder_No, Supplier_ID, Category_ID, Product_Code, Date, Quantity], (err, result) => {
      if (err) {
        connection.rollback(() => {
          throw err;
        });
      }
      connection.query(selectSql, [Product_Code], (err, result) => {
        if (err) {
          connection.rollback(() => {
            throw err;
          });
        }
        const currentStockQuantity = result[0].Quantity;
        const newStockQuantity = currentStockQuantity + Quantity;
        connection.query(updateSql, [newStockQuantity, Product_Code], (err, result) => {
          if (err) {
            connection.rollback(() => {
              throw err;
            });
          }

          connection.commit((err) => {
            if (err) {
              connection.rollback(() => {
                throw err;
              });
            }
            res.json({ message: 'Item order added successfully.' });
          });
        });
      });
    });
  });
});

//edit item order
app.post('/api/itemordersedit', (req, res) => {
    const { ItemOrder_No,Supplier_ID, Category_ID, Product_Code, Date, Quantity } = req.body;
    const id = req.body.ItemOrder_No
    const sql = "UPDATE Item_Order SET ItemOrder_No = ?, Supplier_ID = ?, Category_ID = ?, Product_Code = ?, Date = ?, Quantity = ?  WHERE ItemOrder_No = '"+id+"'";
    connection.query(sql, [ItemOrder_No,Supplier_ID, Category_ID, Product_Code, Date, Quantity], (err, result) => {
      if (err) throw err;
      res.json({ message: 'Item order edited successfully.' });
    });
  });

// get last inserted ID of item order from database
app.get('/api/itemorders/lastid', (req, res) => {
  const sql = 'SELECT MAX(ItemOrder_No) AS LastID FROM Item_Order';
  connection.query(sql, (err, result) => {
    if (err) throw err;
    res.json(result[0].LastID+1);
  });
});

// data delete

app.delete('/api/itemordersdelete/:id', (req, res) => {
    const itemId = req.params.id;
    const sql = `DELETE FROM Item_Order WHERE ItemOrder_No = ?`;
  
    connection.query(sql, itemId, (error, results) => {
      if (error) throw error;
      res.json({ message: 'Item order delete successfully.' });
    });
  });

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
