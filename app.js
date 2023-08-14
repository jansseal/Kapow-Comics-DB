/*
    SETUP
*/
var express = require('express');   // We are using the express library for the web server
var app     = express();            // We need to instantiate an express object to interact with the server in our code
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
PORT        = 36967;                 // Set a port number at the top so it's easy to change in the future
var db = require('./database/db-connector');
const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
const { isNull } = require('util');
app.engine('.hbs', engine({extname: ".hbs"}));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.


/*
    ROUTES
*/

app.get('/', function(req, res)
    {
        return res.render('index')
    });

app.get('/sales', function(req, res)
    {
        let query1;             // Define our query

        // If there is no query string, we just perform a basic SELECT
        if (req.query.sale_id === undefined)
        {
        query1 = "SELECT * FROM Sales;";
        }

        else
        {
            query1 = `SELECT * FROM Sales WHERE sale_id LIKE "${req.query.sale_id}%"`
        }

        let query2 = "SELECT * FROM Customers;";

        db.pool.query(query1, function(error, rows, fields){    // Execute the query

            let sales = rows;

            db.pool.query(query2, (error, rows, fields) => {

                let customers = rows;

                let customermap = {}
                customers.map(customer => {
                    let id = parseInt(customer.customer_id, 10);
                    customermap[id] = customer["customer_name"];
            })

            // Overwrite the homeworld ID with the name of the planet in the people object
                sales = sales.map(sales => {
                    return Object.assign(sales, {customer_id: customermap[sales.customer_id]})
            })



                return res.render('sales', {data: sales, customers: customers});
        });                         
    })
});

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
    

app.get('/customers', function(req, res)
    {  
        let query1 = "SELECT * FROM Customers;";               // Define our query

        // If there is no query string, we just perform a basic SELECT
        if (req.query.customer_name === undefined)
        {
            query1 = "SELECT * FROM Customers;";
        }

        // If there is a query string, we assume this is a search, and return desired results
        else
        {
            query1 = `SELECT * FROM Customers WHERE customer_name LIKE "${req.query.customer_name}%"`
        }

        db.pool.query(query1, function(error, rows, fields){    // Execute the query

            let customers = rows;
            res.render('customers', {data: customers});                  // Render the customers.hbs file, and also send the renderer
        })                                                      // an object where 'data' is equal to the 'rows' we
    }); 


app.get('/suppliers', function(req, res) {  
        let query1;             // Define our query
    
        // If there is no query string, we just perform a basic SELECT
        if (req.query.supplier_id === undefined) {
            query1 = "SELECT * FROM Suppliers;";
        } else {
            query1 = `SELECT * FROM Suppliers WHERE supplier_id LIKE "${req.query.supplier_id}%"`;
        }
    
        db.pool.query(query1, function(error, rows, fields) {    // Execute the query
            return res.render('suppliers', {data: rows}); // Use the 'suppliers' template
        });
    });

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

        // Query 2 is the same in both cases
        let query2 = "SELECT * FROM Suppliers;";
    
        // Run the 1st query
        db.pool.query(query1, function(error, rows, fields){
            
            // Save the people
            let products = rows;
            
            // Run the second query
            db.pool.query(query2, (error, rows, fields) => {
                
                // Save the planets
                let suppliers = rows;
            // element of an array.
                let suppliermap = {}
                suppliers.map(supplier => {
                    let id = parseInt(supplier.supplier_id, 10);

                suppliermap[id] = supplier["supplier_name"];
             })

            // Overwrite the homeworld ID with the name of the planet in the people object
            products = products.map(product => {
                return Object.assign(product, {supplier_id: suppliermap[product.supplier_id]})
            })

            // END OF NEW CODE
                
                return res.render('products', {data: products, suppliers: suppliers});
            })                                                   // an object where 'data' is equal to the 'rows' we
    })
});                                                         // received back from the query
    
         
                                                       

app.post('/add-saleDetails-ajax', function(req, res) 
    {
        // Capture the incoming data and parse it back to a JS object
        let data = req.body;
        let sale_id = parseInt(data.sale_id);
        let product_id = parseInt(data.product_id);
        let unit_price = parseInt(data.unit_price);
        let quantity = parseInt(data.quantity);

        console.log("Parsed values:", sale_id, product_id, unit_price, quantity)
    
        // Create the query and run it on the database
        query1 = `INSERT INTO Sales_has_products (sale_id, product_id, unit_price, quantity) VALUES (${sale_id}, ${product_id}, ${unit_price}, ${quantity})`;
        db.pool.query(query1, function(error, rows, fields){
    
            // Check to see if there was an error
            if (error) {
    
                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error)
                res.sendStatus(400);
            }
            else
            {
                // If there was no error, perform a SELECT * on bsg_people
                query2 = `SELECT * FROM Sales_has_products;`;
                db.pool.query(query2, function(error, rows, fields){
    
                    // If there was an error on the second query, send a 400
                    if (error) {
                        
                        // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                        console.log(error);
                        res.sendStatus(400);
                    }
                    // If all went well, send the results of the query back.
                    else
                    {
                        res.send(rows);
                    }
                })
            }
        })
    });

app.post('/add-customer-ajax', function(req, res) 
    {
        // Capture the incoming data and parse it back to a JS object
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

    // Create the query and run it on the database
    query1 = `INSERT INTO Customers (customer_name, customer_email, customer_phone) VALUES ('${customer_name}', '${customer_email}', ${customer_phone})`;
        db.pool.query(query1, function(error, rows, fields){
    
            // Check to see if there was an error
            if (error) {
    
                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error)
                res.sendStatus(400);
            }
            else
            {
                // If there was no error, perform a SELECT * on bsg_people
                query2 = `SELECT * FROM Customers;`;
                db.pool.query(query2, function(error, rows, fields){
    
                    // If there was an error on the second query, send a 400
                    if (error) {
                        
                        // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                        console.log(error);
                        res.sendStatus(400);
                    }
                    // If all went well, send the results of the query back.
                    else
                    {
                        res.send(rows);
                    }
                })
            }
        })
    });

    app.post('/add-suppliers-ajax', function(req, res) 
    {
    // Capture the incoming data and parse it back to a JS objectlet 
        data = req.body;
        let supplier_name = data.supplier_name;
        let supplier_email = data.supplier_email;
        let supplier_phone = data.supplier_phone;
        let supplier_city = data.supplier_city;
        let supplier_state = data.supplier_state;
    
        // Create the query and run it on the database
        query1 = `INSERT INTO Suppliers (supplier_name, supplier_email, supplier_phone, supplier_city, supplier_state) VALUES ('${supplier_name}', '${supplier_email}', '${supplier_phone}', '${supplier_city}', '${supplier_state}')`;
        db.pool.query(query1, function(error, rows, fields){
    
            // Check to see if there was an error
            if (error) {
    
                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error)
                res.sendStatus(400);
            }
            else
            {
                // If there was no error, perform a SELECT * on bsg_people
                query2 = `SELECT * FROM Suppliers;`;
                db.pool.query(query2, function(error, rows, fields){
    
                    // If there was an error on the second query, send a 400
                    if (error) {
                        
                        // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                        console.log(error);
                        res.sendStatus(400);
                    }
                    // If all went well, send the results of the query back.
                    else
                    {
                        res.send(rows);
                    }
                })
            }
        })
    });

app.post('/add-sale-ajax', function(req, res) 
    {
        // Capture the incoming data and parse it back to a JS object
        let data = req.body;
        let sale_revenue = parseInt(data.sale_revenue);
        let customer_id = parseInt(data.customer_id);

    console.log("Data values:", sale_revenue, customer_id)

    // Create the query and run it on the database
    query1 = `INSERT INTO Sales (sale_revenue, customer_id) VALUES (${sale_revenue}, ${customer_id})`;
        db.pool.query(query1, function(error, rows, fields){
    
            // Check to see if there was an error
            if (error) {
    
                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error)
                res.sendStatus(400);
            }
            else
            {
                // If there was no error, perform a SELECT * on Sales
                query2 = `SELECT * FROM Sales;`;
                db.pool.query(query2, function(error, rows, fields){
    
                    // If there was an error on the second query, send a 400
                    if (error) {
                        
                        // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                        console.log(error);
                        res.sendStatus(400);
                    }
                    // If all went well, send the results of the query back.
                    else
                    {
                        res.send(rows);
                    }
                })
            }
        })
    });

app.post('/add-products-ajax', function(req, res) 
    {
        // Capture the incoming data and parse it back to a JS object
        let data = req.body;
        let product_name = data.product_name;
        let product_price = parseInt(data.product_price);
        let product_type = data.product_type;
        let supplier_id = data.supplier_id;

        if (supplier_id === "-1") { 
            supplier_id = 'NULL';
        }

        // Create the query and run it on the database
        let query1 = `INSERT INTO Products (product_name, product_price, product_type, supplier_id) VALUES ('${product_name}', ${product_price}, '${product_type}', ${supplier_id})`;

        db.pool.query(query1, function(error, rows, fields){

            // Check to see if there was an error
            if (error) {

                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error)
                res.sendStatus(400);
            }
            else
            {
                // If there was no error, perform a SELECT * on bsg_people
                query2 = `SELECT * FROM Products;`;
                db.pool.query(query2, function(error, rows, fields){

                    // If there was an error on the second query, send a 400
                    if (error) {

                        // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                        console.log(error);
                        res.sendStatus(400);
                    }
                    // If all went well, send the results of the query back.
                    else
                    {
                        res.send(rows);
                    }
                })
            }
        })
    });

app.delete('/delete-saleDetails-ajax', function(req,res,next){
    let data = req.body;
    let invoice_id = parseInt(data.invoice_id);
    let deleteSaleDetails= `DELETE FROM Sales_has_products WHERE invoice_id = ?`;
  
  
          // Run the 1st query
          db.pool.query(deleteSaleDetails, [invoice_id], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
  
              else
              {
                  // Run the second query
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

  app.delete('/delete-customer-ajax', function(req,res,next){
    let data = req.body;
    let customer_id = parseInt(data.customer_id);
    let deleteCustomer = `DELETE FROM Customers WHERE customer_id = ?`;
  
  
          // Run the 1st query
          db.pool.query(deleteCustomer, [customer_id], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
  
              else
              {
                  // Run the second query
                  db.pool.query(deleteCustomer, [customer_id], function(error, rows, fields) {
  
                      if (error) {
                          console.log(error);
                          res.sendStatus(400);
                      } else {
                          res.sendStatus(204);
                      }
                  })
              }
  })});
  
  app.put('/put-invoice-ajax', function(req, res, next) {
    let data = req.body;

    let invoiceId = parseInt(data.invoice_id);
    let saleId = parseInt(data.sale_id);
    let productId = parseInt(data.product_id);
    let unitPrice = parseInt(data.unit_price);
    let quantity = parseInt(data.quantity);

    console.log("Parsed values:",invoiceId,saleId, productId, unitPrice, quantity)

    // Query to update the Sales_has_products table based on the invoice_id
    let queryUpdateSaleDetails = `UPDATE Sales_has_products 
                                  SET sale_id = ?, product_id = ?, unit_price = ?, quantity = ? 
                                  WHERE invoice_id = ?`;

    // Query to fetch the updated details based on invoice_id
    let queryFetchUpdatedDetails = `SELECT * FROM Sales_has_products WHERE invoice_id = ?`;

    // Run the update query
    db.pool.query(queryUpdateSaleDetails, [saleId, productId, unitPrice, quantity, invoiceId], function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            // If the update was successful, fetch the updated row
            db.pool.query(queryFetchUpdatedDetails, [invoiceId], function(err, results, fields) {
                if (err) {
                    console.log(err);
                    res.sendStatus(400);
                } else {
                    // Before sending the result, map the product_id to product name
                    let productmap = {};
                    let queryGetProducts = "SELECT * FROM Products;";
                    db.pool.query(queryGetProducts, (error, products, fields) => {
                        if(error) {
                            console.log(error);
                            res.sendStatus(400);
                        } else {
                            products.map(product => {
                                let id = parseInt(product.product_id, 10);
                                productmap[id] = product["product_name"];
                            });

                            results = results.map(result => {
                                return Object.assign(result, {product_id: productmap[result.product_id]})
                            });
                            res.send(results);
                        }
                    });
                }
            });
        }
    });
});

/*
    LISTENER
*/
  app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});