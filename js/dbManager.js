/**
 * Using http://blog.darkcrimson.com/2010/05/local-databases/
 *
 */

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
    try {
        icuDb.transaction(
            function (transaction) {
               
                console.log("Creating table: " + DBTables.DEVICE.name);
                transaction.executeSql(getCreateQuery(DBTables.DEVICE.name, DBTables.DEVICE.fieldsToInsert));    
                console.log("Creating table: " + DBTables.KEYBOARD.name);
                transaction.executeSql(getCreateQuery(DBTables.KEYBOARD.name, DBTables.KEYBOARD.fieldsToInsert));    
                console.log("Creating table: " + DBTables.LETTER.name);
                transaction.executeSql(getCreateQuery(DBTables.LETTER.name, DBTables.LETTER.fieldsToInsert));    
            }
            );
        console.log("Tables been created");
    }
    catch (e){
        console.log("Error creating tables "+e+".");
    }
            
// insertData(DBTables.DEVICE, device);
}

function insertDataToDb(device){
    try{
        console.log("Inserting data to db");
        console.log("Device")
        var dataToInsert = new Array();
        dataToInsert = [device.name, device.deviceId, new Date().toString()];
        insertData(DBTables.DEVICE, dataToInsert);
        console.log("Keyboard");
        $.each(device.patientToolsData.keyboards, function(index, keyboard) {
            console.log("Inserting data for keyboard " + keyboard.name);
            dataToInsert = [keyboard.name, new Date().toString()]; 
            insertData(DBTables.KEYBOARD, dataToInsert);
            //var id = getLasId();
            //  console.log("lastId: " + id);
            $.each(keyboard.letters, function(index, letter){
                dataToInsert = [letter.letter, letter.positionAlphabetic];
                insertData(DBTables.LETTER, dataToInsert);
            })
        });
        createFirstKeyboard();    
    }
    catch(e){
        console.log("Error: " + e);
    }
}

/***
 **** INSERT INTO TABLE ** 
 ***/
function insertData(table, dataToInsert){
    console.log("Inserting data for " + table.name);
    //console.log("Starting transaction. data: " + dataToInsert + " size: " + dataToInsert.length);
    var values = Consts.EMPTY_STRING;
    for(i = 0; i < dataToInsert.length; i++){
        console.log("    element: " + i + ": " + dataToInsert[i])
        values += "'" + dataToInsert[i] + "'";
        if(i< dataToInsert.length-1)
            values += ', ';
    }
    if(table.name == DBTables.LETTER.name){
        values += ', (SELECT max(id) FROM keyboard)';
    }
    console.log("Values: " + values);
  
    var query = "INSERT INTO " + table.name + "(" + table.fields + ") VALUES (" + values + ")";
    //console.log("Query: " + query);
          
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
    icuDb.transaction(
        function (transaction) {
            transaction.executeSql("SELECT * FROM " + DBTables.KEYBOARD.name + ", " + DBTables.LETTER.name +" WHERE letter.keyboardId = keyboard.id ORDER BY COALESCE(keyboard.id, letter.positionalphabetic)", [], saveKeyboards, errorHandler);
        });
}

function loadKeyboard(keyboardId){
    console.log("Loading keyboard id: " + keyboardId);
    var query = "SELECT * FROM " + DBTables.KEYBOARD.name + ", " + DBTables.LETTER.name + " WHERE " + DBTables.KEYBOARD.name + ".id = ?" + 
    icuDb.transaction(
        function (transaction) {
            transaction.executeSql("SELECT * FROM ?, ? WHERE ?.?" + DBTables.KEYBOARD.name + ". ", DBTables.LETTER.name )
        }
        )
}

function loadLetters(keyboardId){
    console.log("Selecting Letters");
    icuDB.transaction(
        function (transaction) {
            transaction.executeSql("SELECT * FROM " + DBTables.LETTER.name + "WHERE id = ?;", [keyboardId], saveKeyboards, errorHandler);
        })
}

function saveKeyboards(transaction, results){
    
    try{
        console.log("Saving keyboards");
        kbs = new Array();
        var previousId = Consts.FIRST_INDEX_FLAG;
        var letter = new Object();
        var letters = new Array();
        var letterIndex = 0;
        if(results.rows.length > 0){
            for (var i=0; i<results.rows.length; i++) {
                if(i==0){
                    var keyboradIndex = 0;
                }
                var row = results.rows.item(i);
                var id = row['id'];
                // checking if we have information about new keyboard
                if(previousId!=id&&previousId!=Consts.FIRST_INDEX_FLAG){
                    console.log("Saving new keyboard id " + previousId )
                    var keyboard = new KeyboardFromDb(row);
                    console.log("Adding letters to keyboard (" + letters.length + " )");
                    keyboard.letters = letters;
                    letters = new Array();
                    keyboards[keyboradIndex] = ( keyboard );
                    console.log("Keyboard with id " + previousId + " been added, now we have " + keyboards.length + " keyboards ");
                    keyboradIndex++;
                    letterIndex = 0;
                }
                // saving information about letters;
                console.log("Loading letters for keyboard " + row['name'] + " index in array for prev keybaord : " + keyboradIndex);
                console.log("Loaded letter: " + row['letter']);
                letters[letterIndex] = (new LetterFromDb(row));
                letterIndex++;
                console.log(keyboards.length + " keyboards been saved");
                previousId = id;
            } 
            console.log("Data from db loaded, showing keyboard");
            createFirstKeyboard();    
        }
        else {
            console.log("There is no data in db, loading it from service");
            loadDeviceData();
        }
        
    
    } catch(e){
        console.error("Error saving keyboard: " + e);
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

function getLasId(){
    var id;
    icuDb.transaction(
        function (transaction) {
            transaction.executeSql("SELECT * FROM keyboard WHERE id = (SELECT max(id) FROM keyboard);", [], function(transaction, result){
                
                id = result.rows.item(0)['id'];  
                console.log("id = " + id);

            }, errorHandler);
        });
    console.log("id we returning: " + id);
    return id;
}
