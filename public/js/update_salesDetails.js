/*
   Most of the following code has been modified from the Node.js Starter App.
   Resources:
   1. Node.js Starter App - https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main
   (Sourced on 8/13/2023)
*/

// Function to handle updating a sale's details using AJAX
let updatesalesDetailsForm = document.getElementById('update-invoice-form-ajax');

updatesalesDetailsForm.addEventListener("submit", function (e) {
   
    e.preventDefault(); // Prevent default form submission behavior

    // Get input values from the form
    let inputInvoiceId = document.getElementById("input-invoice_id-update");
    let inputSaleId = document.getElementById("input-sale_id-update");
    let inputProductId = document.getElementById("input-product_id-update");
    let inputPrice = document.getElementById("input-price-update");
    let inputQuantity = document.getElementById("input-quantity-update");

    // Parse and validate input values
    let InvoiceIdValue = parseInt(inputInvoiceId.value);
    let SaleIdValue = parseInt(inputSaleId.value);
    let ProductIdValue = parseInt(inputProductId.value);
    let UnitPriceValue = parseFloat(inputPrice.value);
    let InputQuantityValue = parseInt(inputQuantity.value);
    
    // Validation checks for NaN values
    if (isNaN(InvoiceIdValue)) 
    {
        console.log("Invalid invoice ID input value.");
        return;
    }
    if (isNaN(SaleIdValue)) 
    {
        console.log("Invalid sale ID input value.");
        return;
    }
    if (isNaN(ProductIdValue)) 
    {
        console.log("Invalid product ID input value.");
        return;
    }
    if (isNaN(UnitPriceValue)) 
    {
        console.log("Invalid unit price input value.");
        return;
    }
    if (isNaN(InputQuantityValue)) 
    {
        console.log("Invalid quantity input value.");
        return;
    }

    // Prepare data for AJAX request
    let data = {
        invoice_id: InvoiceIdValue,
        sale_id: SaleIdValue,
        product_id: ProductIdValue,
        unit_price: UnitPriceValue,
        quantity: InputQuantityValue

    }
    
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-invoice-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // AJAX response handling
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            // Update the row and reload the page
            updateRow(xhttp.response, InvoiceIdValue);
            location.reload();
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    xhttp.send(JSON.stringify(data));

})

// Function to update the row in the salesDetails table
function updateRow(data, invoiceID){

    let parsedData = JSON.parse(data);
    let table = document.getElementById("salesDetails-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       if (table.rows[i].getAttribute("data-value") == invoiceID) {
            // Update the row with new data
            let updateRowIndex = table.getElementsByTagName("tr")[i];
            updateRowIndex.getElementsByTagName("td")[1].innerHTML = parsedData[0].sale_id;
            updateRowIndex.getElementsByTagName("td")[2].innerHTML = parsedData[0].product_id;
            updateRowIndex.getElementsByTagName("td")[3].innerHTML = parsedData[0].unit_price;
            updateRowIndex.getElementsByTagName("td")[4].innerHTML = parsedData[0].quantity;                      
       }
    }
}

// Function to delete a row from the salesDetails table
function deleteRow(invoiceID){

    let table = document.getElementById("salesDetails-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       if (table.rows[i].getAttribute("data-value") == invoiceID) {
            // Delete the row and update the dropdown menu
            table.deleteRow(i);
            deleteDropDownMenu(invoiceID);
            break;
       }
    }
}

// Function to remove an option from the dropdown menu
function deleteDropDownMenu(invoiceID){

  let selectMenu = document.getElementById("input-invoice_id-update");
  
  for (let i = 0; i < selectMenu.length; i++){
    if (Number(selectMenu.options[i].value) === Number(invoiceID)){
      selectMenu[i].remove();
      break;
    } 
  }
}

