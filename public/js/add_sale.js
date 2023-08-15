// Get the objects we need to modify
let addSaleForm = document.getElementById('add-sale-form-ajax');

// Modify the objects we need
addSaleForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputSaleRevenue = document.getElementById("input-revenue");
    let inputCustomerId = document.getElementById("input-customer_id");

    // Get the values from the form fields
    let SaleRevenueValue = inputSaleRevenue.value;
    let CustomerIdValue = inputCustomerId.value;

    // Put our data we want to send in a javascript object
    let data = {
        sale_revenue: SaleRevenueValue,
        customer_id:  CustomerIdValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-sale-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            location.reload();

            // Clear the input fields for another transaction
            inputSaleRevenue.value = '';
            inputCustomerId.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from 
// Sales
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("sales-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let revenueCell = document.createElement("TD");
    let dateCell = document.createElement("TD");
    let customerCell = document.createElement("TD");

    // Fill the cells with correct data. Price cell is set to be formatted as a decimal value.
    idCell.innerText = newRow.sale_id;
    revenueCell.innerText = newRow.sale_revenue.toFixed(2);
    dateCell.innerText = newRow.sale_date;
    customerCell.innerText = newRow.customer_id;

    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteSaleDetails(newRow.sale_id);
    };
    
    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(revenueCell);
    row.appendChild(dateCell);
    row.appendChild(customerCell);

    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.sale_id);

    // Add the row to the table
    currentTable.appendChild(row);

    // Find drop down menu, create a new option, fill data in the option (full name, id),
    // then append option to drop down menu so newly created rows via ajax will be found in it without needing a refresh
    let selectMenu = document.getElementById("input-customer_id");
    let option = document.createElement("option");
    option.text = newRow.sale_id;
    option.value = newRow.sale_id;
    selectMenu.add(option);
}
