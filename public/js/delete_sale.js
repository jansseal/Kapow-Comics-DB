/*
   Most of the following code has been modified from the Node.js Starter App.
   Resources:
   1. Node.js Starter App - https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main
   (Sourced on 8/13/2023)
*/

// Function to delete a sale using AJAX
function deleteSale(sale_id) {
    let data = {
      sale_id: sale_id
    };
  
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-sale-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {
            // If the deletion is successful, remove the row from the table
            deleteRow(sale_id);
        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.")
        }
    }
    xhttp.send(JSON.stringify(data));
}
  
  // Function to delete a row from the sales table
  function deleteRow(sale_id){
      let table = document.getElementById("sales-table");
      for (let i = 0, row; row = table.rows[i]; i++) {
         if (table.rows[i].getAttribute("data-value") == sale_id) {
              table.deleteRow(i);
              break;
         }
      }
  }