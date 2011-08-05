// loading data from the service
function loadDeviceData(serviceAddress){
    try {
        serviceAddress = 'http://' + serviceAddress + Consts.LOAD_DEVICE_METHOD + Consts.DEVICE_ID;
        console.log("Loading data from " + serviceAddress);
        //alert(Consts.LOAD_DEVICE_LINK + Consts.DEVICE_ID);
        $.ajax({
            async: false,
            url: serviceAddress,
            dataType: "json",
            success: function(json){
                device = json;
                console.log("Data been loaded. Device: " + json.name);
                keyboards = device.patientToolsData.keyboards;
                insertDataToDb(json);
            },
            error: function(e){
                console.error("Could not load data. " + e.status);
                showServiceAddressForm();
            }
        });
    }
    catch(e){
        console.error("Could not load data from the service. Error " + e);
    }
}