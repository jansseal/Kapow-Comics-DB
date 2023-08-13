// Code on this page is a work in progress. We are somewhat confused regarding the editing process. Code is sourced directly from: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%208%20-%20Dynamically%20Updating%20Data


// Get the objects we need to modify
let updatesalesDetailsForm = document.getElementById('update-invoice-form-ajax');

// Modify the objects we need
updatesalesDetailsForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputInvoiceId = document.getElementById("input-invoice_id-update");
    let inputSaleId = document.getElementById("input-sale_id-update");
    let inputProductId = document.getElementById("input-product_id-update");
    let inputPrice = document.getElementById("input-price-update");
    let inputQuantity = document.getElementById("input-quantity-update");

    console.log("Raw form values:", inputPrice.value, inputQuantity.value);


    // Get the values from the form fields
    let InvoiceIdValue = inputInvoiceId.value;
    let SaleIdValue = inputSaleId.value;
    let ProductIdValue = inputProductId.value;
    let InputPriceValue = inputPrice.value;
    let InputQuantityValue = inputQuantity.value;
    
    // currently the database table for bsg_people does not allow updating values to NULL
    // so we must abort if being bassed NULL for homeworld

    if (isNaN(InvoiceIdValue)) 
    {
        return;
    }
    if (isNaN(SaleIdValue)) 
    {
        return;
    }
    if (isNaN(ProductIdValue)) 
    {
        return;
    }
    if (isNaN(InputPriceValue)) 
    {
        return;
    }
    if (isNaN(InputQuantityValue)) 
    {
        return;
    }

    console.log(InvoiceIdValue,SaleIdValue, ProductIdValue, InputPriceValue, InputQuantityValue)


    // Put our data we want to send in a javascript object
    let data = {
        invoice_id: InvoiceIdValue,
        sale_id: SaleIdValue,
        product_id: ProductIdValue,
        input_price: InputPriceValue,
        quantity: InputQuantityValue

    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-invoice-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, InvoiceIdValue);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})

function updateRow(data, invoiceID){
    // Assuming that the backend sends a JSON string, we'll parse it
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("salesDetails-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       if (table.rows[i].getAttribute("data-value") == invoiceID) {

            // Get the location of the row where we found the matching invoice ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Update each cell with the parsed data
            updateRowIndex.getElementsByTagName("td")[1].innerHTML = parsedData.sale_id;
            updateRowIndex.getElementsByTagName("td")[2].innerHTML = parsedData.product_id;
            updateRowIndex.getElementsByTagName("td")[3].innerHTML = parsedData.input_price;
            updateRowIndex.getElementsByTagName("td")[4].innerHTML = parsedData.quantity;
       }
    }
}

