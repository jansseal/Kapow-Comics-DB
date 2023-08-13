// Get the objects we need to modify
let addSaleDetailsForm = document.getElementById('add-saleDetails-form-ajax');

// Modify the objects we need
addSaleDetailsForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputSaleID = document.getElementById("input-sale_id");
    let inputProductID = document.getElementById("input-product_id");
    let inputPrice = document.getElementById("input-price");
    let inputQuantity = document.getElementById("input-quantity");

    // Get the values from the form fields
    let saleIDValue = inputSaleID.value;
    let productIDValue = inputProductID.value;
    let priceValue = inputPrice.value;
    let quantityValue = inputQuantity.value;


    // Put our data we want to send in a javascript object
    let data = {
        sale_id: saleIDValue,
        product_id: productIDValue,
        unit_price: priceValue,
        quantity: quantityValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-saleDetails-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputSaleID.value = '';
            inputProductID.value = '';
            inputPrice.value = '';
            inputQuantity.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from 
// Sales_has_products
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("salesDetails-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let sidCell = document.createElement("TD");
    let pidCell = document.createElement("TD");
    let priceCell = document.createElement("TD");
    let quantityCell = document.createElement("TD");
    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.invoice_id;
    sidCell.innerText = newRow.sale_id;
    pidCell.innerText = newRow.product_id;
    priceCell.innerText = newRow.unit_price;
    quantityCell.innerText = newRow.quantity;

    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteSaleDetails(newRow.invoice_id);
    };
    
    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(sidCell);
    row.appendChild(pidCell);
    row.appendChild(priceCell);
    row.appendChild(quantityCell);

    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.invoice_id);

    // Add the row to the table
    currentTable.appendChild(row);

    // Find drop down menu, create a new option, fill data in the option (full name, id),
    // then append option to drop down menu so newly created rows via ajax will be found in it without needing a refresh
    let selectMenu = document.getElementById("mySelect");
    let option = document.createElement("option");
    option.text = newRow.invoice_id;
    option.value = newRow.invoice_id;
    selectMenu.add(option);
}

