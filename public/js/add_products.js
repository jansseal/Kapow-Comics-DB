// Get the objects we need to modify
let addProductsForm = document.getElementById('add-products-form-ajax');

// Modify the objects we need
addProductsForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputProductName = document.getElementById("input-products_name");
    let inputProductPrice = document.getElementById("input-products_price");
    let inputProductType = document.getElementById("input-products_type");
    let inputSupplierId = document.getElementById("input-supplier_id");

    // Get the values from the form fields
    let ProductNameValue = inputProductName.value;
    let ProductPriceValue = inputProductPrice.value;
    let ProductTypeValue = inputProductType.value;
    let SupplierIdValue = inputSupplierId.value;


    // Put our data we want to send in a javascript object
    let data = {

        product_name: ProductNameValue,
        product_price: ProductPriceValue,
        product_type: ProductTypeValue,
        supplier_id:  SupplierIdValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-products-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);
            location.reload();

            // Clear the input fields for another transaction
            inputProductName.value = '';
            inputProductPrice.value = '';
            inputProductType.value = '';
            inputSupplierId.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from 
// Products
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("products-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let nameCell = document.createElement("TD");
    let priceCell = document.createElement("TD");
    let typeCell = document.createElement("TD");
    let supplierCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.product_id;
    nameCell.innerText = newRow.product_name;
    priceCell.innerText = newRow.product_price;
    typeCell.innerText = newRow.product_type;
    supplierCell.innerText = newRow.supplier_id;

    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteProduct(newRow.product_id);
    };
    
    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(nameCell);
    row.appendChild(priceCell);
    row.appendChild(typeCell);
    row.appendChild(supplierCell);

    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.product_id);

    // Add the row to the table
    currentTable.appendChild(row);

    // Find drop down menu, create a new option, fill data in the option (full name, id),
    // then append option to drop down menu so newly created rows via ajax will be found in it without needing a refresh
    let selectMenu = document.getElementById("input-supplier_id");
    let option = document.createElement("option");
    option.text = newRow.product_id;
    option.value = newRow.product_id;
    selectMenu.add(option);
}

