// Code on this page is a work in progress. We are somewhat confused regarding the editing process. Code is sourced directly from: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%208%20-%20Dynamically%20Updating%20Data


// Get the objects we need to modify
let updatesalesDetailsForm = document.getElementById('update-salesDetails-form-ajax');

// Modify the objects we need
updatePersonForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputInvoiceId = document.getElementById("input-invoice_id-update");
    let inputSaleId = document.getElementById("input-sale_id-update");
    let inputProductId = document.getElementById("input-product_id-update");
    let inputPrice = document.getElementById("input-price-update");
    let inputQuantity = document.getElementById("input-quantity-update");

    // Get the values from the form fields
    let InvoiceIdValue = inputInvoiceId.value;
    let SaleIdValue = inputSaleId.value;
    let ProductIdValue = inputProductId;
    let InputPriceValue = inputPrice;
    let InputQuantityValue = inputQuantity;
    
    // currently the database table for bsg_people does not allow updating values to NULL
    // so we must abort if being bassed NULL for homeworld

    if (isNaN(InvoiceIdValue)) 
    {
        return;
    }
    if (isNaN(SaleIdValue)) 
    {
        return;
    }
    if (isNaN(ProductIdValue)) 
    {
        return;
    }
    if (isNaN(InputPriceValue)) 
    {
        return;
    }
    if (isNaN(InputQuantityValue)) 
    {
        return;
    }


    // Put our data we want to send in a javascript object
    let data = {
        invoice_id: InvoiceIdValue,
        sale_id: SaleIdValue,
        product_id: ProductIdValue,
        input_price: InputPriceValue,
        quantity: InputQuantityValue

    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-invoice-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, InvoiceIdValue);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, personID){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("people-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == personID) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of homeworld value
            let td = updateRowIndex.getElementsByTagName("td")[3];

            // Reassign homeworld to our value we updated to
            td.innerHTML = parsedData[0].name; 
       }
    }
}
