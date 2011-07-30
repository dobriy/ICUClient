/**
 * Using http://blog.darkcrimson.com/2010/05/local-databases/
 *
 */
var icuDb;
function initDatabase() {  
    console.log("Starting creating database");
    try {  
        if (!window.openDatabase) {  
            alert('Databases are not supported in this browser.');  
        } else {  
            var shortName = DBTables.DB_NAME;  
            var version = '1.0';  
            var displayName = DBTables.DB_NAME;  
            var maxSize = 1000000; //  bytes  
            icuDb = openDatabase(shortName, version, displayName, maxSize);  
            console.log("Database created");
            createTables();
            
        //selectAll(DBTables.DEVICE);
        }  
    } catch(e) {  
  
        if (e == 2) {  
            // Version number mismatch.  
            console.log("Invalid database version.");  
        } else {  
            console.log("Unknown error "+e+".");  
        }  
        return;  
    }  
} 

/***
**** CREATE TABLES ** 
***/
function createTables(){
    console.log("Creating tabels");
    icuDb.transaction(
        function (transaction) {
            console.log("Creating table: " + DBTables.DEVICE.name);
            transaction.executeSql(getCreateQuery(DBTables.DEVICE.name, DBTables.DEVICE.fieldsToInsert));    
        }
        );
    console.log("Tables been created");
            
    insertData(DBTables.DEVICE, device);
}


/***
**** INSERT INTO TABLE ** 
***/
function insertData(table, data){
    console.log("Inserting data for " + table.name);
    var dataToInsert
    switch (table.name) {
        case DBTables.DEVICE.name:
            dataToInsert = [data.name, data.deviceId, new Date().toString()]
            break;
        default:
            break;
    }
    console.log("Starting transaction. data: " + dataToInsert + " size: " + dataToInsert.length);
    var values = Consts.EMPTY_STRING;
    for(i = 0; i < dataToInsert.length; i++){
        console.log("    element: " + i + ": " + dataToInsert[i])
        values += "'" + dataToInsert[i] + "'";
        if(i< dataToInsert.length-1)
            values += ', ';
    }
    console.log("Values: " + values);
  
    var query = "INSERT INTO " + table.name + "(" + table.fields + ") VALUES (" + values + ")";
    console.log("Query: " + query);
          
    icuDb.transaction(
        function (transaction) {
            //Starter data when page is initialized
            transaction.executeSql(query);
        }
        );	
    console.log("Data been inserted");
}

/***
**** UPDATE TABLE ** 
***/
function updateSetting(){
    icuDb.transaction(
        function (transaction) {
            if($('#fname').val() != '') {
                var fname = $('#fname').val();
            } else {
                var fname = 'none';
            }
			
            var bg    = $('#bg_color').val();
            var font  = $('#font_selection').val();
            var car   = $('#fav_car').val();
			
	    	
            transaction.executeSql("UPDATE page_settings SET fname=?, bgcolor=?, font=?, favcar=? WHERE id = 1", [fname, bg, font, car]);
        }
        );	
    selectAll();
}
function selectAll(table){ 
    console.log("Selecting all from " + table.name);
    icuDb.transaction(
        function (transaction) {
            transaction.executeSql("SELECT * FROM " + table.name + ";", [], dataSelectHandler, errorHandler);
        }
        );	
    console.log("All been selected");
}

function loadKeyboards(){
    console.log("Selecting keyboards");
    icuDB.transaction(
        function (transaction) {
            transaction.executeSql("SELECT * FROM " + DBTables.KEYBOARD.name + ";", [], saveKeyboards, errorHandler);
        });
}

function loadLetters(keyboardId){
    console.log("Selecting Letters");
    icuDB.transaction(
        function (transaction) {
            transaction.executeSql("SELECT * FROM " + DBTables.LETTER.name + "WHERE id = ?;", [DBTables.LETTER.keybaoradId], saveKeyboards, errorHandler);
        })
}

function saveKeyboards(transaction, results){
    console.log("Saving keyboard");
    for (var i=0; i<results.rows.length; i++) {
        var row = results.rows.item(i);
        keyboards[i].name = row['keyboard.name'];
        console.log("Loading letters of keyboard " + keyboards[i].name);
        icuDB.transaction(
            function (transaction) {
                transaction.executeSql("SELECT * FROM " + DBTables.LETTER.name + "WHERE id = ?;", [DBTables.LETTER.keybaoradId], function(lettersTransaction, lettersResultSet ){
                    for (var j=0; j<lettersResultSet.rows.length; j++){
                        var letterRow = lettersResultSet.rows.item(i);
                        keyboards[i].letters[j].letter = letterRow['letter'];
                    }
                }, errorHandler);
            })
       
        
        console.log("data: " + row['name']);
        deviceName += " " + row['name'];
        
       
    }
}

function dataSelectHandler(transaction, results){
    console.log("Handling data, number of results:  " + results.rows.length);
    //var text = document.createTextNode( "text"  );
    //$('#resultText').append(text);
    // Handle the results
    for (var i=0; i<results.rows.length; i++) {
        
        var row = results.rows.item(i);
        console.log("data: " + row['name']);
        deviceName += " " + row['name'];
        
       
    }
    var textField = document.createTextNode( "text" + deviceName );
    $('#keyboardTitle').append(textField);
    alert (deviceName);

}





/***
**** Save 'default' data into DB table **
***/

function saveAll(){
    insertData(1);
}


function errorHandler(transaction, error){
    if (error.code==1){
    // DB Table already exists
    } else {
        // Error is a human-readable string.
        console.log('Oops.  Error was '+error.message+' (Code '+error.code+')');
    }
    return false;
}


function nullDataHandler(){
    console.log("SQL Query Succeeded");
}

/***
**** DELETE DB TABLE ** 
***/
function dropTables(){
    icuDb.transaction(
        function (transaction) {
            transaction.executeSql("DROP TABLE page_settings;", [], nullDataHandler, errorHandler);
        }
        );
    console.log("Table 'page_settings' has been dropped.");
    location.reload();
}

/***
* Helper function
*  
*/

/**
* returns string with create query, 
* tableName table name
* fields - all fields, except id
* 
*/
function getCreateQuery(tableName, fields){
    var query = 'CREATE TABLE IF NOT EXISTS ' + tableName + '(id INTEGER NOT NULL PRIMARY KEY, ' + fields + ')';
    return query;
}