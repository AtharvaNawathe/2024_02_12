/**
 * Implementation of a simple database system in files where folder acts as a
 * database, files acts as a table and data in the files acts as records.
 * I have implemented 9 operation on this datbase/file system.
 * @author - Atharva Nawathe
 */

// using readline and fileSystem('fs') for taking user input and performing
//file operations
const readline = require("readline");
const fs = require("fs");
const path = require("path");
const { log } = require("console");

const regex = /\d/;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
// creating a class named SimpleDatabase
class SimpleDatabase {
  constructor(databaseName) {
    // defining constructor
    if (typeof databaseName !== "string" || regex.test(databaseName)) {
      // database name should be string
      throw new Error("Database name must be a string");
    }
    // Getting Database Path for creating database
    this.databasePath = path.join(__dirname, databaseName);

    // Create the database folder if it doesn't exist
    if (!fs.existsSync(this.databasePath)) {
      fs.mkdirSync(this.databasePath);
    }
  }
  // creating initiate where basically my all main logic will be here only
  Initiate() {
    console.log("1. Delete Database");
    console.log("2. Update Database Name");

    console.log("3. Create Table");
    console.log("4. Delete Table");
    console.log("5. Update Table Name");

    console.log("6. Insert Record");
    console.log("7. Get All Records");
    console.log("8. Get Record By ID");
    console.log("9. Update Record By ID");
    console.log("10. Exit");

    let answer;
    let tName;
    //Asking user to perform his/her prefered operation
    rl.question("Enter your choice ", (userAnswer) => {
      answer = userAnswer; // Store user's answer
      // I am using Switch case for all the operations.
      // Here all my methods are called using user interactions
      switch (answer) {
        case "1":
          this.deleteDatabase(); // calling delete function
          console.log("Your Database is deleted Successfully!!");
          break;

        case "2":
          // asking user to enter dbname
          rl.question("Enter Database Name ", (dbName) => {
            let DbName = dbName;
            this.updateDatabaseName(DbName); //calling the function
            console.log("Databse Name Updated!"); // ALERT!!
            rl.close();
          });
          break;

        case "3":
          rl.question("Enter Table Name ", (tableName) => {
            tName = tableName; // Store the entered table name
            this.createTable(tName); // Call createTable on the instance
            rl.close(); // Close the readline interface here
          });
          break;

        case "4":
          rl.question(
            "Enter Table Name which You want to delete! ",
            (aName) => {
              let cName = aName;
              this.deleteTable(cName); // calling the deleteTable method
              console.log("Your Table is deleted Successfully!!");
              rl.close();
            }
          );
          break;

        case "5":
          //asking user for tableName both new and old for updation
          rl.question("Enter old Table Name: ", (oldTableName) => {
            rl.question("Enter new Table Name: ", (newTableName) => {
              // calling the method
              this.updateTableName(oldTableName, newTableName); 
              console.log("Your Table is modified Successfully!!");
              rl.close();
            });
          });
          break;

        case "6":
          //this block performs insertion of records into files in
          rl.question("Enter TableName: ", (table) => {
            rl.question("Enter Information: ", (info) => {
              this.insertRecord(table, info);
              console.log("Record inserted successfully!");
              rl.close();
            });
          });
          break;

        case "7":
          //this block performs prints all data
          rl.question("Enter Table Name ", (tName) => {
            let TName = tName;
            console.log(this.getAllRecords(TName));
            rl.close();
          });
          break;

        case "8":
          //this block fetches record by its id
          rl.question("Enter TableName: ", (table) => {
            rl.question("Enter id: ", (id) => {
              let thisTable = table;
              let thisId = id;
              console.log(this.getRecordById(thisTable, thisId));
              rl.close();
            });
          });
          break;

        case "9":
          // this block performs data updation in records
          rl.question("Enter Table Name ", (Etable) => {
            rl.question("Enter id: ", (Eid) => {
              rl.question("Enter The data you want to update: ", (Eupdate) => {
                console.log(Etable);
                console.log(Eid);
                console.log(Eupdate);

                // Convert Eid to a number (if necessary)
                const numericEid = parseInt(Eid, 10);

                // Call the updateRecordById function
                const result = this.updateRecordById(
                  Etable,
                  numericEid,
                  JSON.parse(Eupdate)
                );

                console.log(result);
                rl.close();
              });
            });
          });
          break;

        case "10":
          console.log("Thank you!!");
          process.exit();
          break;
      }
    });
  }
  /**
   * From here on you will see all the function definations and logic
   */
  deleteDatabase() {
    //Delete the database/folder and all its contents
    fs.rmSync(this.databasePath, { recursive: true, force: true });
  }

  updateDatabaseName(newDatabaseName) {
    //Throws error if the database is not a string
    if (typeof newDatabaseName !== "string") {
      throw new Error("New database name must be a string");
    }

    const newDatabasePath = path.join(__dirname, newDatabaseName);             

    // Rename the database folder
    fs.renameSync(this.databasePath, newDatabasePath);

    this.databasePath = newDatabasePath;
  }

  createTable(tName) {
    //defining the table path
    const tablePath = path.join(this.databasePath, tName + ".json");

    // Create the table file if it doesn't exist
    if (!fs.existsSync(tablePath)) {
      fs.writeFileSync(tablePath, "[]");
      console.log(`Table '${tName}' created successfully.`);
    } else {
      console.log(`Table '${tName}' already exists.`);
    }
  }

  deleteTable(tableName) {
    const tablePath = path.join(this.databasePath, tableName + ".json");

    // Delete the table file
    fs.rmSync(tablePath, { force: true });
  }

  updateTableName(oldTableName, newTableName) {
    const oldTablePath = path.join(this.databasePath, oldTableName + ".json");
    const newTablePath = path.join(this.databasePath, newTableName + ".json");

    // Rename the table file
    fs.renameSync(oldTablePath, newTablePath);
  }
  insertRecord(tableName, record) {
    // Defining the table path
    const tablePath = path.join(this.databasePath, tableName + ".json");
    
    // Reading the existing table data
    const tableData = JSON.parse(fs.readFileSync(tablePath));
  
    // Adding the new record to the table
    tableData.push(record);
  
    // Updating the table file with the new data
    fs.writeFileSync(tablePath, JSON.stringify(tableData, null, 2));
  }
  

  createRecord(tableName, newRecord) {
    const tablePath = path.join(this.databasePath, tableName + ".json");
    const tableData = JSON.parse(fs.readFileSync(tablePath));

    // Assign a unique ID to the new record
    newRecord.id = tableData.length + 1;

    // Add the new record to the table
    tableData.push(newRecord);

    // Update the table file with the new data
    fs.writeFileSync(tablePath, JSON.stringify(tableData, null, 2));

    return newRecord.id;
  }

  getAllRecords(tableName) {
    //getting tablepath
    const tablePath = path.join(this.databasePath, tableName + ".json");
    return JSON.parse(fs.readFileSync(tablePath));
  }

  getRecordById(tableName, recordId) {
    const tablePath = path.join(this.databasePath, tableName + ".json");
    const tableData = JSON.parse(fs.readFileSync(tablePath));
    // returns if record id matches
    return tableData.find((record) => record.id === recordId);
  }

  updateRecordById(tableName, recordId, updatedData) {
    const tablePath = path.join(this.databasePath, tableName + ".json");
    let tableData = JSON.parse(fs.readFileSync(tablePath));

    const index = tableData.findIndex((record) => record.id === recordId);

    if (index !== -1) {
      // Update the existing record with the new data
      tableData[index] = { ...tableData[index], ...updatedData };

      // Update the table file with the modified data
      fs.writeFileSync(tablePath, JSON.stringify(tableData, null, 2));

      return true; // Successfully updated
    }

    return false; // Record not found
  }
}

//creating object of class SimpleDatabase
const myDatabase = new SimpleDatabase("myDatabase");
myDatabase.Initiate();  //calling Initiate() method using instance of the class