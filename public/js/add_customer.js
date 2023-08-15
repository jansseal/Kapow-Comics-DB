/*
   Most of the following code has been modified from the Node.js Starter App.
   Resources:
   1. Node.js Starter App - https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main
   (Sourced on 8/13/2023)
*/

// Get the form element for adding a customer
let addCustomerForm = document.getElementById('add-customer-form-ajax');

// Listen for form submission
addCustomerForm.addEventListener("submit", function (e) {
    
    e.preventDefault(); // Prevent default form submission behavior

    // Get input fields
    let inputCustomerName = document.getElementById("input-name");
    let inputCustomerEmail = document.getElementById("input-email");
    let inputCustomerPhone = document.getElementById("input-phone");

    // Get input values
    let nameValue = inputCustomerName.value;
    let emailValue = inputCustomerEmail.value;
    let phoneValue = inputCustomerPhone.value;

    // Create a data object
    let data = {
        customer_name:  nameValue,
        customer_email: emailValue,
        customer_phone: phoneValue
    }
    
    // Setup an AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-customer-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Define how to handle AJAX response
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new customer data to the table
            addRowToTable(xhttp.response);

            // Clear input fields for another entry
            inputCustomerName.value = '';
            inputCustomerEmail.value = '';
            inputCustomerPhone.value = '';
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
    let currentTable = document.getElementById("customers-table");

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

    // Fill cells with data
    idCell.innerText = newRow.customer_id;
    nameCell.innerText = newRow.customer_name;
    emailCell.innerText = newRow.customer_email;
    phoneCell.innerText = newRow.customer_phone;

    // Append cells to row
    row.appendChild(idCell);
    row.appendChild(nameCell);
    row.appendChild(emailCell);
    row.appendChild(phoneCell);

    // Set row attribute
    row.setAttribute('data-value', newRow.customer_id);

    // Append row to the table
    currentTable.appendChild(row);

    // Update dropdown menu
    let selectMenu = document.getElementById("mySelect");
    let option = document.createElement("option");
    option.text = newRow.customer_id;
    option.value = newRow.customer_id;
    selectMenu.add(option);
}