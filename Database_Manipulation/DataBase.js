/**
 * Creating a file system database where Folders will acts as a database
 * files will acts as a tables and records will acts as a data in files
 */

const fs = require('fs');
const path = require('path');
const regex = /\d/;

class SimpleDatabase {
  
  constructor(databaseName) {
    if (typeof databaseName !== 'string' || regex.test(databaseName)) {
      throw new Error('Database name must be a string');
    }

    this.databasePath = path.join(__dirname, databaseName);

    // Create the database folder if it doesn't exist
    if (!fs.existsSync(this.databasePath)) {
      fs.mkdirSync(this.databasePath);
    }
  }

  createTable(tableName) {
    const tablePath = path.join(this.databasePath, tableName + '.json');

    // Create the table file if it doesn't exist
    if (!fs.existsSync(tablePath)) {
      fs.writeFileSync(tablePath, '[]');
    }
  }

  insertRecord(tableName, record) {
    const tablePath = path.join(this.databasePath, tableName + '.json');
    const tableData = JSON.parse(fs.readFileSync(tablePath));

    // Add the new record to the table
    tableData.push(record);

    // Update the table file with the new data
    fs.writeFileSync(tablePath, JSON.stringify(tableData, null, 2));
  }

  getAllRecords(tableName) {
    const tablePath = path.join(this.databasePath, tableName + '.json');
    return JSON.parse(fs.readFileSync(tablePath));
  }

  deleteDatabase() {
    fs.rmSync(this.databasePath, { recursive: true, force: true });
  }

  deleteTable(tableName) {
    const tablePath = path.join(this.databasePath, tableName + '.json');

    // Delete the table file
    fs.rmSync(tablePath, { force: true });
  }

  updateTableName(oldTableName, newTableName) {
    const oldTablePath = path.join(this.databasePath, oldTableName + '.json');
    const newTablePath = path.join(this.databasePath, newTableName + '.json');

    // Rename the table file
    fs.renameSync(oldTablePath, newTablePath);
  }

  updateDatabaseName(newDatabaseName) {
    if (typeof newDatabaseName !== 'string') {
      throw new Error('New database name must be a string');
    }

    const newDatabasePath = path.join(__dirname, newDatabaseName);

    // Rename the database folder
    fs.renameSync(this.databasePath, newDatabasePath);

    this.databasePath = newDatabasePath;
  }

  createRecord(tableName, newRecord) {
    const tablePath = path.join(this.databasePath, tableName + '.json');
    const tableData = JSON.parse(fs.readFileSync(tablePath));

    // Assign a unique ID to the new record
    newRecord.id = tableData.length + 1;

    // Add the new record to the table
    tableData.push(newRecord);

    // Update the table file with the new data
    fs.writeFileSync(tablePath, JSON.stringify(tableData, null, 2));

    return newRecord.id;
  }

  getRecordById(tableName, recordId) {
    const tablePath = path.join(this.databasePath, tableName + '.json');
    const tableData = JSON.parse(fs.readFileSync(tablePath));

    return tableData.find((record) => record.id === recordId);
  }

  updateRecordById(tableName, recordId, updatedData) {
    const tablePath = path.join(this.databasePath, tableName + '.json');
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

  deleteRecordById(tableName, recordId) {
    const tablePath = path.join(this.databasePath, tableName + '.json');
    let tableData = JSON.parse(fs.readFileSync(tablePath));

    const index = tableData.findIndex((record) => record.id === recordId);

    if (index !== -1) {
      // Remove the record from the table
      tableData.splice(index, 1);

      // Update the table file with the modified data
      fs.writeFileSync(tablePath, JSON.stringify(tableData, null, 2));

      return true; // Successfully deleted
    }

    return false; // Record not found
  }
}


try {
  const myDatabase = new SimpleDatabase('AtharvaNawathe');
  myDatabase.createTable('users');
  myDatabase.insertRecord('users', { id: 1, name: 'John', age: 25 });
  myDatabase.insertRecord('users', { id: 2, name: 'Atharva Nawathe', age: 30 });

  const allUsers = myDatabase.getAllRecords('users');
  console.log(allUsers);

// CRUD operations for records
  const newRecordId = myDatabase.createRecord('users', { name: 'New User', age: 28 });
  console.log('New record created with ID:', newRecordId);

  const recordToUpdate = myDatabase.getRecordById('users', 1);
  if (recordToUpdate) {
    myDatabase.updateRecordById('users', 1, { age: 16 });
    console.log('Record with ID 1 updated');
  } else {
    console.log('Record not found');
  }

  const recordToDeleteId = 2;
  const isRecordDeleted = myDatabase.deleteRecordById('users', recordToDeleteId);
  if (isRecordDeleted) {
    console.log(`Record with ID ${recordToDeleteId} deleted`);
  } else {
    console.log(`Record with ID ${recordToDeleteId} not found`);
  }

  console.log(myDatabase.getAllRecords('users'));


myDatabase.deleteDatabase();
  myDatabase.updateDatabaseName('AtharvaNawathe');

 
  myDatabase.deleteTable('users');
 myDatabase.updateTableName('users', 'newUsers');
} catch (error) {
  console.error(error.message);
}
