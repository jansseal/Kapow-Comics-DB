/*
   Most of the following code has been modified from the Node.js Starter App.
   Resources:
   1. Node.js Starter App - https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main
   2. LinuxHint - Parsing Float with Two Decimal Places in JavaScript - https://linuxhint.com/parse-float-with-two-decimal-places-javascript/
*/

// Get the form element for adding sales
let addSaleForm = document.getElementById('add-sale-form-ajax');

// Listen for form submission
addSaleForm.addEventListener("submit", function (e) {
    
    e.preventDefault(); // Prevent default form submission behavior

    // Get input fields
    let inputSaleRevenue = document.getElementById("input-revenue");
    let inputCustomerId = document.getElementById("input-customer_id");

    // Get input values
    let SaleRevenueValue = inputSaleRevenue.value;
    let CustomerIdValue = inputCustomerId.value;

    // Create a data object
    let data = {
        sale_revenue: SaleRevenueValue,
        customer_id:  CustomerIdValue
    }
    
    // Setup an AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-sale-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Define how to handle an AJAX response
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new sale data to the table
            addRowToTable(xhttp.response);
            location.reload();

            // Clear input fields for another entry
            inputSaleRevenue.value = '';
            inputCustomerId.value = '';
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
    let currentTable = document.getElementById("sales-table");

    // Calculate the new row index
    let newRowIndex = currentTable.rows.length;

    // Parse the response data
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create row elements and cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let revenueCell = document.createElement("TD");
    let dateCell = document.createElement("TD");
    let customerCell = document.createElement("TD");
    let deleteCell = document.createElement("TD");

    // Fill cells with data
    idCell.innerText = newRow.sale_id;
    revenueCell.innerText = newRow.sale_revenue.toFixed(2); // This line is adapted from https://linuxhint.com/parse-float-with-two-decimal-places-javascript/
    dateCell.innerText = newRow.sale_date;
    customerCell.innerText = newRow.customer_id;

    // Create delete button
    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteSale(newRow.sale_id);
    };
    
    // Append cells to row
    row.appendChild(idCell);
    row.appendChild(revenueCell);
    row.appendChild(dateCell);
    row.appendChild(customerCell);

    // Set row attribute
    row.setAttribute('data-value', newRow.sale_id);

    // Append row to the table
    currentTable.appendChild(row);

    // Update dropdown menu
    let selectMenu = document.getElementById("input-customer_id");
    let option = document.createElement("option");
    option.text = newRow.sale_id;
    option.value = newRow.sale_id;
    selectMenu.add(option);
}
