// loading data from the service
function loadDeviceData(){
    try {
        console.log("Loading data from " + Consts.SERVICE_LINK + Consts.LOAD_DEVICE_METHOD + Consts.DEVICE_ID);
        //alert(Consts.LOAD_DEVICE_LINK + Consts.DEVICE_ID);
        $.ajax({
            async: false,
            url: Consts.SERVICE_LINK + Consts.LOAD_DEVICE_METHOD + Consts.DEVICE_ID,
            dataType: "json",
            success: function(json){
                device = json;
                console.log("Data been loaded. Device: " + json.name);
                keyboards = device.patientToolsData.keyboards;
                insertDataToDb(json);
            },
            error: function(e){
                console.error("Could not load data. " + e.status);
            }
        });
    }
    catch(e){
        console.error("Could not load data from the service. Error " + e);
    }
}