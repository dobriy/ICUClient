var Consts = {
    SERVICE_LINK: "http://192.168.1.2:9998/ICUService/",
    DEVICE_ID : "c33177bd-c9ee-4c8c-88e0-f168f59d4f8a",
    LOAD_DEVICE_METHOD : "loadDeviceData/",
    EMPTY_STRING : ''
    
};

var DBTables = {
    DB_NAME : "icuData",
    DEVICE : {
        name : "device",
        fieldsToInsert : 'name TEXT NOT NULL, uniqueId TEXT NOT NULL, lastUpdate TEXT',
        fields : 'name, uniqueId, lastUpdate'
        
    },
    KEYBOARD : {
        name : "keyboard",
        fieldsToInsert : "",
        fields : ""
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