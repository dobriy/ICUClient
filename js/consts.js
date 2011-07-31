var Consts = {
    SERVICE_LINK: "http://192.168.1.2:9998/ICUService/",
    DEVICE_ID : "c33177bd-c9ee-4c8c-88e0-f168f59d4f8a",
    LOAD_DEVICE_METHOD : "loadDeviceData/",
    EMPTY_STRING : ''
    
};

var Message = {
    LOADING_DATA : 'Loading data, please wait...',
    LOADING_KEYOBARD : 'Loading keyboard data, please wait...'
}

var Id = {
    TIME : 'time',
    KEYBOARD : 'keyboard',
    KEYBOARD_RESULT : 'keyboardResultText',
    CHART : 'chart',
    CHART_RESULT : 'chartResultText'
}

var DBTables = {
    DB_NAME : "icuData",
    DEVICE : {
        name : "device",
        fieldsToInsert : 'name TEXT NOT NULL, uniqueId TEXT NOT NULL, lastUpdate TEXT',
        fields : 'name, uniqueId, lastUpdate'
        
    },
    KEYBOARD : {
        name : "keyboard",
        fieldsToInsert : "name TEXT NOT NULL, lastUpdate TEXT",
        fields : "name, lastUpdate"
    },
    LETTER : {
        name : "letter",
        fieldsToInsert : "letter TEXT NOT NULL, positionalphabetic TEXT NOT NULL, keyboardId INTEGER NOT NULL, lastUpdate TEXT",
        fields : "letter, positionalphabetic, keyboardId",
        keybaordId : "keyboardId"
    },
    CHART : "chart",
    PICTURE : "picture"
}

function Device(deviceData)  {
    this.screeningToolsData = deviceData.screeningToolsData,
    this.patientToolsData = deviceData.patientToolsData,
    this.name = deviceData.name,
    this.deviceId = deviceData.deviceId
   
}