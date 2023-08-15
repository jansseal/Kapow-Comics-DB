/*
   Most of the following code has been modified from the Node.js Starter App.
   Resources:
   1. Node.js Starter App - https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main
   (Sourced on 8/13/2023)
   2. LinuxHint - Parsing Float with Two Decimal Places in JavaScript - https://linuxhint.com/parse-float-with-two-decimal-places-javascript/
   (Sourced on 8/13/2023)
*/

/*
    SETUP
*/

var express = require('express');   
var app     = express();            
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
PORT        = 36968;                 
var db = require('./database/db-connector');
const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     
const { isNull } = require('util');
app.engine('.hbs', engine({extname: ".hbs"}));  
app.set('view engine', '.hbs');                 


/*
    ROUTES
*/

// Home page
app.get('/', function(req, res)
    {
        return res.render('index')
    });

// Sales page
app.get('/sales', function(req, res)
    {
        let query1;             

        if (req.query.sale_id === undefined)
        {
        query1 = "SELECT * FROM Sales;";
        }

        else
        {
            query1 = `SELECT * FROM Sales WHERE sale_id LIKE "${req.query.sale_id}%"`
        }

        let query2 = "SELECT * FROM Customers;";

        db.pool.query(query1, function(error, rows, fields){   

            let sales = rows;

            db.pool.query(query2, (error, rows, fields) => {

                let customers = rows;

                let customermap = {}
                customers.map(customer => {
                    let id = parseInt(customer.customer_id, 10);
                    customermap[id] = customer["customer_name"];
            })

                sales = sales.map(sales => {
                    return Object.assign(sales, {customer_id: customermap[sales.customer_id]})
            })



                return res.render('sales', {data: sales, customers: customers});
        });                         
    })
});

// Sales Details page
app.get('/salesDetails', function(req, res)
    {
        let query1;             
    
        if (req.query.invoice_id === undefined) {
            query1 = "SELECT * FROM Sales_has_products;";
        } else {
            query1 = `SELECT * FROM Sales_has_products WHERE invoice_id LIKE "${req.query.invoice_id}%"`;
        }
    
        let query2 = "SELECT * FROM Products;";
        let query3 = "SELECT * FROM Sales;";
    
        db.pool.query(query1, function(error, salesDetails, fields) {    
            
            db.pool.query(query2, function(error, products, fields) {
                
                let productmap = {}
                products.map(product => {
                    let id = parseInt(product.product_id, 10);
                    productmap[id] = product["product_name"];
                });
    
                salesDetails = salesDetails.map(saleDetail => {
                    return Object.assign(saleDetail, {product_id: productmap[saleDetail.product_id]})
                });
    
                db.pool.query(query3, function(error, sales, fields) {
                    console.log(sales)
                    return res.render('salesDetails', {data: salesDetails, products: products, sales: sales});
                });
            });
        });
    });
    
// Customers page
app.get('/customers', function(req, res)
    {  
        let query1 = "SELECT * FROM Customers;";               

        if (req.query.customer_name === undefined)
        {
            query1 = "SELECT * FROM Customers;";
        }

        else
        {
            query1 = `SELECT * FROM Customers WHERE customer_name LIKE "${req.query.customer_name}%"`
        }

        db.pool.query(query1, function(error, rows, fields){    

            let customers = rows;
            res.render('customers', {data: customers});                  
        })                                                     
    }); 

// Suppliers page
app.get('/suppliers', function(req, res) {  
        let query1;             
    
        if (req.query.supplier_id === undefined) {
            query1 = "SELECT * FROM Suppliers;";
        } else {
            query1 = `SELECT * FROM Suppliers WHERE supplier_id LIKE "${req.query.supplier_id}%"`;
        }
    
        db.pool.query(query1, function(error, rows, fields) {    
            return res.render('suppliers', {data: rows}); 
        });
    });

// Products page
app.get('/products', function(req, res)
    {  
        let query1;
        if (req.query.product_name === undefined)
        {
        query1 = "SELECT * FROM Products;";
        }
        else
        {
            query1 = `SELECT * FROM Products WHERE product_name LIKE "${req.query.product_name}%"`
        }

        let query2 = "SELECT * FROM Suppliers;";
    
        db.pool.query(query1, function(error, rows, fields){
            
            let products = rows;
            
            db.pool.query(query2, (error, rows, fields) => {
                
                let suppliers = rows;
                let suppliermap = {}
                suppliers.map(supplier => {
                    let id = parseInt(supplier.supplier_id, 10);

                suppliermap[id] = supplier["supplier_name"];
             })

            products = products.map(product => {
                return Object.assign(product, {supplier_id: suppliermap[product.supplier_id]})
            })

                
                return res.render('products', {data: products, suppliers: suppliers});
            })                                                   
    })
});                                                   
    
// Adding sale details via AJAX
app.post('/add-saleDetails-ajax', function(req, res) 
    {
        let data = req.body;
        let sale_id = parseInt(data.sale_id);
        let product_id = parseInt(data.product_id);
        let unit_price = parseFloat(data.unit_price).toFixed(2);        // This line is adapted from: https://linuxhint.com/parse-float-with-two-decimal-places-javascript/
        let quantity = parseInt(data.quantity);

        console.log("Parsed values:", sale_id, product_id, unit_price, quantity)
    
        query1 = `INSERT INTO Sales_has_products (sale_id, product_id, unit_price, quantity) VALUES (${sale_id}, ${product_id}, ${unit_price}, ${quantity})`;
        db.pool.query(query1, function(error, rows, fields){
    
            if (error) {
                console.log(error);
                res.sendStatus(400);
            }
            else
            {
                query2 = `SELECT * FROM Sales_has_products;`;
                db.pool.query(query2, function(error, rows, fields){
    
                    if (error) {
                        
                        console.log(error);
                        res.sendStatus(400);
                    }
                    else
                    {
                        res.send(rows);
                    }
                })
            }
        })
    });

// Adding customer via AJAX
app.post('/add-customer-ajax', function(req, res) 
    {
        let data = req.body;
        let customer_name = data.customer_name;
        let customer_email = data.customer_email;
        let customer_phone = data.customer_phone;

        if (!customer_phone) {
            customer_phone = 'NULL';
        } else {
            customer_phone = "'" + customer_phone + "'";
        }

    console.log("Data values:", customer_name, customer_email, customer_phone)

    query1 = `INSERT INTO Customers (customer_name, customer_email, customer_phone) VALUES ('${customer_name}', '${customer_email}', ${customer_phone})`;
        db.pool.query(query1, function(error, rows, fields){
    
            if (error) {
    
                console.log(error)
                res.sendStatus(400);
            }
            else
            {
                query2 = `SELECT * FROM Customers;`;
                db.pool.query(query2, function(error, rows, fields){
    
                    if (error) {
                        console.log(error);
                        res.sendStatus(400);
                    }
                    else
                    {
                        res.send(rows);
                    }
                })
            }
        })
    });

// Adding supplier via AJAX
app.post('/add-suppliers-ajax', function(req, res) 
    {
        data = req.body;
        let supplier_name = data.supplier_name;
        let supplier_email = data.supplier_email;
        let supplier_phone = data.supplier_phone;
        let supplier_city = data.supplier_city;
        let supplier_state = data.supplier_state;
    
        query1 = `INSERT INTO Suppliers (supplier_name, supplier_email, supplier_phone, supplier_city, supplier_state) VALUES ('${supplier_name}', '${supplier_email}', '${supplier_phone}', '${supplier_city}', '${supplier_state}')`;
        db.pool.query(query1, function(error, rows, fields){
    
            if (error) {
                console.log(error);
                res.sendStatus(400);
            }
            else
            {
                query2 = `SELECT * FROM Suppliers;`;
                db.pool.query(query2, function(error, rows, fields){
    
                    if (error) {
                        console.log(error);
                        res.sendStatus(400);
                    }
                    else
                    {
                        res.send(rows);
                    }
                })
            }
        })
    });

// Adding sale via AJAX
app.post('/add-sale-ajax', function(req, res) 
    {
        let data = req.body;
        let sale_revenue = parseFloat(data.sale_revenue).toFixed(2);        // This line is adapted from: https://linuxhint.com/parse-float-with-two-decimal-places-javascript/
        let customer_id = parseInt(data.customer_id);

    console.log("Data values:", sale_revenue, customer_id)

    query1 = `INSERT INTO Sales (sale_revenue, customer_id) VALUES (${sale_revenue}, ${customer_id})`;
        db.pool.query(query1, function(error, rows, fields){
    
            if (error) {
                console.log(error);
                res.sendStatus(400);
            }
            else
            {
                query2 = `SELECT * FROM Sales;`;
                db.pool.query(query2, function(error, rows, fields){
    
                    if (error) {
                        console.log(error);
                        res.sendStatus(400);
                    }
                    else
                    {
                        res.send(rows);
                    }
                })
            }
        })
    });

// Adding product via AJAX
app.post('/add-products-ajax', function(req, res) 
    {
        let data = req.body;
        let product_name = data.product_name;
        let product_price = parseFloat(data.product_price).toFixed(2);      // This line is adapted from: https://linuxhint.com/parse-float-with-two-decimal-places-javascript/
        let product_type = data.product_type;
        let supplier_id = data.supplier_id;

        if (supplier_id === "-1") { 
            supplier_id = 'NULL';
        }

        let query1 = `INSERT INTO Products (product_name, product_price, product_type, supplier_id) VALUES ('${product_name}', ${product_price}, '${product_type}', ${supplier_id})`;

        db.pool.query(query1, function(error, rows, fields){

            if (error) {
                console.log(error);
                res.sendStatus(400);
            }
            else
            {
                query2 = `SELECT * FROM Products;`;
                db.pool.query(query2, function(error, rows, fields){

                    if (error) {
                        console.log(error);
                        res.sendStatus(400);
                    }
                    else
                    {
                        res.send(rows);
                    }
                })
            }
        })
    });

// Deleting sale details via AJAX
app.delete('/delete-saleDetails-ajax', function(req,res,next){
    let data = req.body;
    let invoice_id = parseInt(data.invoice_id);
    let deleteSaleDetails= `DELETE FROM Sales_has_products WHERE invoice_id = ?`;
  
  
          db.pool.query(deleteSaleDetails, [invoice_id], function(error, rows, fields){
              if (error) {
              console.log(error);
              res.sendStatus(400);
              }
  
              else
              {
                  db.pool.query(deleteSaleDetails, [invoice_id], function(error, rows, fields) {
  
                      if (error) {
                          console.log(error);
                          res.sendStatus(400);
                      } else {
                          res.sendStatus(204);
                      }
                  })
              }
  })});

// Deleting sale via AJAX
app.delete('/delete-sale-ajax', function(req,res,next){
    let data = req.body;
    let sale_id = parseInt(data.sale_id);
    let deleteSale = `DELETE FROM Sales WHERE sale_id = ?`;
  

          db.pool.query(deleteSale, [sale_id], function(error, rows, fields){
              if (error) {
              console.log(error);
              res.sendStatus(400);
              }
  
              else
              {
                  db.pool.query(deleteSale, [sale_id], function(error, rows, fields) {
  
                      if (error) {
                          console.log(error);
                          res.sendStatus(400);
                      } else {
                          res.sendStatus(204);
                      }
                  })
              }
  })});

// Updating invoice via AJAX
app.put('/put-invoice-ajax', function(req, res, next) {
    let data = req.body;

    let invoiceId = parseInt(data.invoice_id);
    let saleId = parseInt(data.sale_id);
    let productId = parseInt(data.product_id);
    let unitPrice = parseFloat(data.unit_price).toFixed(2);
    let quantity = parseInt(data.quantity);

    console.log("Parsed values:",invoiceId,saleId, productId, unitPrice, quantity)

    let queryUpdateSaleDetails = `UPDATE Sales_has_products 
                                  SET sale_id = ?, product_id = ?, unit_price = ?, quantity = ? 
                                  WHERE invoice_id = ?`;

    let queryFetchUpdatedDetails = `SELECT * FROM Sales_has_products WHERE invoice_id = ?`;

    db.pool.query(queryUpdateSaleDetails, [saleId, productId, unitPrice, quantity, invoiceId], function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            db.pool.query(queryFetchUpdatedDetails, [invoiceId], function(err, results, fields) {
                if (err) {
                    console.log(err);
                    res.sendStatus(400);
                } else {
                    res.send(results);
                }
            });
        }
    });
});

/*
    LISTENER
*/
  app.listen(PORT, function(){            
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});