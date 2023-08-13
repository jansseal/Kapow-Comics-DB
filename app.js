/*
    SETUP
*/
var express = require('express');   // We are using the express library for the web server
var app     = express();            // We need to instantiate an express object to interact with the server in our code
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
PORT        = 36999;                 // Set a port number at the top so it's easy to change in the future
var db = require('./database/db-connector');
const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
app.engine('.hbs', engine({extname: ".hbs"}));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.


/*
    ROUTES
*/


app.get('/', function(req, res)
    {
        let query1;             // Define our query

        // If there is no query string, we just perform a basic SELECT
        if (req.query.invoice_id === undefined)
        {
        query1 = "SELECT * FROM Sales_has_products;";
        }

        else
        {
            query1 = `SELECT * FROM Sales_has_products WHERE invoice_id LIKE "${req.query.invoice_id}%"`
        }

        let query2 = "SELECT * FROM Products;";

        db.pool.query(query1, function(error, rows, fields){    // Execute the query

            let salesDetails = rows;

            db.pool.query(query2, (error, rows, fields) => {

                let products = rows;

                let productmap = {}
                products.map(product => {
                    let id = parseInt(product.product_id, 10);
                    productmap[id] = product["product_name"];
            })

            // Overwrite the homeworld ID with the name of the planet in the people object
                salesDetails = salesDetails.map(salesDetails => {
                    return Object.assign(salesDetails, {product_id: productmap[salesDetails.product_id]})
            })



                return res.render('salesDetails', {data: salesDetails, products: products});
        });                         
    })
});                                                    
                                                       

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

/*
    LISTENER
*/

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




  app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});