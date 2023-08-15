/*
   Most of the following code has been modified from the Node.js Starter App.
   Resources:
   1. Node.js Starter App - https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main
   (Sourced on 8/13/2023)
*/

// Get the form element for adding suppliers
let addSuppliersForm = document.getElementById('add-suppliers-form-ajax');

// Listen for form submission
addSuppliersForm.addEventListener("submit", function (e) {
    
    e.preventDefault(); // Prevent default form submission behavior

    // Get input fields
    let inputSupplierName = document.getElementById("input-supplier_name");
    let inputSupplierEmail = document.getElementById("input-supplier_email");
    let inputSupplierPhone = document.getElementById("input-supplier_phone");
    let inputSupplierCity = document.getElementById("input-supplier_city");
    let inputSupplierState = document.getElementById("input-supplier_state");

    // Get input values
    let SupplierNameValue = inputSupplierName.value;
    let SupplierEmailValue = inputSupplierEmail.value;
    let SupplierPhoneValue = inputSupplierPhone.value;
    let SupplierCityValue = inputSupplierCity.value;
    let SupplierStateValue = inputSupplierState.value;

    // Create a data object
    let data = {
        supplier_name: SupplierNameValue,
        supplier_email: SupplierEmailValue,
        supplier_phone: SupplierPhoneValue,
        supplier_city: SupplierCityValue,
        supplier_state: SupplierStateValue
    }
    
    // Setup an AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-suppliers-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Define how to handle an AJAX response
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new supplier data to the table
            addRowToTable(xhttp.response);
            location.reload();

            // Clear input fields for another entry
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

    // Send the request and data
    xhttp.send(JSON.stringify(data));

})


// Function to add a row to the table
addRowToTable = (data) => {

    // Get a reference to the table
    let currentTable = document.getElementById("suppliers-table");

    // Calculate the new row index
    let newRowIndex = currentTable.rows.length;

    // Parse the response data
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create row elements and cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let nameCell = document.createElement("TD");
    let emailCell = document.createElement("TD");
    let phoneCell = document.createElement("TD");
    let cityCell = document.createElement("TD");
    let stateCell = document.createElement("TD");

    // Fill cells with data
    idCell.innerText = newRow.supplier_id;
    nameCell.innerText = newRow.supplier_name;
    emailCell.innerText = newRow.supplier_email;
    phoneCell.innerText = newRow.supplier_phone;
    cityCell.innerText = newRow.supplier_city;
    stateCell.innerText = newRow.supplier_state;
    
    // Append cells to row
    row.appendChild(idCell);
    row.appendChild(nameCell);
    row.appendChild(emailCell);
    row.appendChild(phoneCell);
    row.appendChild(cityCell);
    row.appendChild(stateCell);

    // Set row attribute
    row.setAttribute('data-value', newRow.supplier_id);

    // Append row to the table
    currentTable.appendChild(row);
}

