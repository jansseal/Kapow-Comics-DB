/*
   Most of the following code has been modified from the Node.js Starter App.
   Resources:
   1. Node.js Starter App - https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main
   2. LinuxHint - Parsing Float with Two Decimal Places in JavaScript - https://linuxhint.com/parse-float-with-two-decimal-places-javascript/
*/

// Get the form element for adding products
let addProductsForm = document.getElementById('add-products-form-ajax');

// Listen for form submission
addProductsForm.addEventListener("submit", function (e) {
    
    e.preventDefault(); // Prevent default form submission behavior

    // Get input fields
    let inputProductName = document.getElementById("input-products_name");
    let inputProductPrice = document.getElementById("input-products_price");
    let inputProductType = document.getElementById("input-products_type");
    let inputSupplierId = document.getElementById("input-supplier_id");

    // Get input values
    let ProductNameValue = inputProductName.value;
    let ProductPriceValue = inputProductPrice.value;
    let ProductTypeValue = inputProductType.value;
    let SupplierIdValue = inputSupplierId.value;

    // Create a data object
    let data = {

        product_name: ProductNameValue,
        product_price: ProductPriceValue,
        product_type: ProductTypeValue,
        supplier_id:  SupplierIdValue
    }
    
    // Setup an AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-products-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Define how to handle AJAX response
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new product data to the table
            addRowToTable(xhttp.response);
            location.reload();

            // Clear input fields for another entry
            inputProductName.value = '';
            inputProductPrice.value = '';
            inputProductType.value = '';
            inputSupplierId.value = '';
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
    let currentTable = document.getElementById("products-table");

    // Calculate the new row index
    let newRowIndex = currentTable.rows.length;

    // Parse the response data
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create row elements and cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let nameCell = document.createElement("TD");
    let priceCell = document.createElement("TD");
    let typeCell = document.createElement("TD");
    let supplierCell = document.createElement("TD");

    idCell.innerText = newRow.product_id;
    nameCell.innerText = newRow.product_name;
    priceCell.innerText = newRow.product_price.toFixed(2);  // This line is adapted from https://linuxhint.com/parse-float-with-two-decimal-places-javascript/
    typeCell.innerText = newRow.product_type;
    supplierCell.innerText = newRow.supplier_id;

    // Append cells to row
    row.appendChild(idCell);
    row.appendChild(nameCell);
    row.appendChild(priceCell);
    row.appendChild(typeCell);
    row.appendChild(supplierCell);

    // Set row attribute
    row.setAttribute('data-value', newRow.product_id);

    // Append row to the table
    currentTable.appendChild(row);

    // Update dropdown menu
    let selectMenu = document.getElementById("input-supplier_id");
    let option = document.createElement("option");
    option.text = newRow.product_id;
    option.value = newRow.product_id;
    selectMenu.add(option);
}

