// Get the objects we need to modify
let addSuppliersForm = document.getElementById('add-suppliers-form-ajax');

// Modify the objects we need
addSuppliersForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputSupplierName = document.getElementById("input-supplier_name");
    let inputSupplierEmail = document.getElementById("input-supplier_email");
    let inputSupplierPhone = document.getElementById("input-supplier_phone");
    let inputSupplierCity = document.getElementById("input-supplier_city");
    let inputSupplierState = document.getElementById("input-supplier_state");

    // Get the values from the form fields
    let SupplierNameValue = inputSupplierName.value;
    let SupplierEmailValue = inputSupplierEmail.value;
    let SupplierPhoneValue = inputSupplierPhone.value;
    let SupplierCityValue = inputSupplierCity.value;
    let SupplierStateValue = inputSupplierState.value;

    // Put our data we want to send in a javascript object
    let data = {
        supplier_name: SupplierNameValue,
        supplier_email: SupplierEmailValue,
        supplier_phone: SupplierPhoneValue,
        supplier_city: SupplierCityValue,
        supplier_state: SupplierStateValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-suppliers-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputSupplierName.value = '';
            inputSupplierEmail.value = '';
            inputSupplierPhone.value = '';
            inputSupplierCity.value = '';
            inputSupplierState.value = '';
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
    let currentTable = document.getElementById("suppliers-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let nameCell = document.createElement("TD");
    let emailCell = document.createElement("TD");
    let phoneCell = document.createElement("TD");
    let cityCell = document.createElement("TD");
    let stateCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.supplier_id;
    nameCell.innerText = newRow.supplier_name;
    emailCell.innerText = newRow.supplier_email;
    phoneCell.innerText = newRow.supplier_phone;
    cityCell.innerText = newRow.supplier_city;
    stateCell.innerText = newRow.supplier_state;

    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteSupplier(newRow.supplier_id);
    };
    
    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(nameCell);
    row.appendChild(emailCell);
    row.appendChild(phoneCell);
    row.appendChild(cityCell);
    row.appendChild(stateCell);

    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.supplier_id);

    // Add the row to the table
    currentTable.appendChild(row);
}

