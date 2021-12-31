const mysql = require("mysql");

const con =mysql.createConnection({
host:"localhost",
user:"root",
password:"",
database:"nodejs_project"
});
con.connect((err)=>{
 if(!err){
     console.log("Database Connect");
 }else{
     console.log("Failed to connect to database");
 }
});
module.exports = con;