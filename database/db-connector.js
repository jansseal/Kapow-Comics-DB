/*
   Most of the following code has been modified from the Node.js Starter App.
   Resources:
   1. Node.js Starter App - https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main
*/

// Import the MySQL module
var mysql = require('mysql')

// Create a connection pool with a maximum of 10 connections
var pool = mysql.createPool({
    connectionLimit : 10,
    host            : 'classmysql.engr.oregonstate.edu',
    user            : 'cs340_jansseal',
    password        : '5906',
    database        : 'cs340_jansseal'
})

// Export the connection pool
module.exports.pool = pool;