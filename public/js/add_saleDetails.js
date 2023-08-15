/*
   Most of the following code has been modified from the Node.js Starter App.
   Resources:
   1. Node.js Starter App - https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main
   (Sourced on 8/13/2023)
   2. LinuxHint - Parsing Float with Two Decimal Places in JavaScript - https://linuxhint.com/parse-float-with-two-decimal-places-javascript/
   (Sourced on 8/13/2023)
*/

// Get the form element for adding sale details
let addSaleDetailsForm = document.getElementById('add-saleDetails-form-ajax');

// Listen for form submission
addSaleDetailsForm.addEventListener("submit", function (e) {
    
    e.preventDefault(); // Prevent default form submission behavior

    // Get input fields
    let inputSaleID = document.getElementById("input-sale_id");
    let inputProductID = document.getElementById("input-product_id");
    let inputPrice = document.getElementById("input-price");
    let inputQuantity = document.getElementById("input-quantity");

    // Get input values
    let saleIDValue = inputSaleID.value;
    let productIDValue = inputProductID.value;
    let priceValue = inputPrice.value;
    let quantityValue = inputQuantity.value;


    // Create a data object
    let data = {
        sale_id: saleIDValue,
        product_id: productIDValue,
        unit_price: priceValue,
        quantity: quantityValue
    }
    
    // Setup an AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-saleDetails-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Define how to handle an AJAX response
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new sale details data to the table
            addRowToTable(xhttp.response);
            location.reload();

            // Clear input fields for another entry
            inputSaleID.value = '';
            inputProductID.value = '';
            inputPrice.value = '';
            inputQuantity.value = '';
            
            console.log('Page has been reloaded');
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and data
    xhttp.send(JSON.stringify(data));

})


// Function to add a row to the table
addRowToTable = (data) => {

    // Get a reference to the table
    let currentTable = document.getElementById("salesDetails-table");

    // Calculate the new row index
    let newRowIndex = currentTable.rows.length;

    // Parse the response data
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create row elements and cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let sidCell = document.createElement("TD");
    let pidCell = document.createElement("TD");
    let priceCell = document.createElement("TD");
    let quantityCell = document.createElement("TD");
    let deleteCell = document.createElement("TD");

    // Fill cells with data
    idCell.innerText = newRow.invoice_id;
    sidCell.innerText = newRow.sale_id;
    pidCell.innerText = newRow.product_id;
    priceCell.innerText = newRow.unit_price.toFixed(2); // This line is adapted from https://linuxhint.com/parse-float-with-two-decimal-places-javascript/
    quantityCell.innerText = newRow.quantity;

    // Create delete button
    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteSaleDetails(newRow.invoice_id);
    };
    
    // Append cells to row 
    row.appendChild(idCell);
    row.appendChild(sidCell);
    row.appendChild(pidCell);
    row.appendChild(priceCell);
    row.appendChild(quantityCell);
    row.appendChild(deleteCell);

    // Set row attribute
    row.setAttribute('data-value', newRow.invoice_id);

    // Append row to the table
    currentTable.appendChild(row);

    // Update dropdown menu
    let selectMenu = document.getElementById("input-invoice_id-update");
    let option = document.createElement("option");
    option.text = newRow.invoice_id;
    option.value = newRow.invoice_id;
    selectMenu.add(option);
}

