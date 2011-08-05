function showServiceAddressForm(){
    $('#' +Id.KEYBOARD).empty();
    var inputField = document.createElement("input");
    inputField.setAttribute("type", "text");
    inputField.setAttribute("id", "serviceAddress");
    
    $('#' +Id.KEYBOARD).append( inputField );
    
    var submit = document.createElement("div");
    submit.setAttribute("data-role", "button");
    submit.setAttribute("id", "saveAddressButton");
    var text = document.createTextNode( "save" );
    
    submit.appendChild(text);
    console.log("showing form");
    $('#' +Id.KEYBOARD).append( submit );
    
    $( getServicAddress );
        

}

function getServicAddress(){
   // $('#' +Id.KEYBOARD).page();
    $('#saveAddressButton').live('vclick', function(){
        var newAddress = $('#serviceAddress').val();
        console.log("data: " + newAddress);
            showMsgInDiv(Id.KEYBOARD, Message.LOADING_KEYOBARD);
            loadDeviceData(newAddress);

    });
}


function showMsgInDiv(id, msg){
    $('#' + id).empty();
    var newMessageElement = document.createElement("span");
    var newMessageText = document.createTextNode( msg );
    newMessageElement.appendChild( newMessageText );
    $('#' + id).append( newMessageElement );
                
    console.log('Adding message "' + msg + '"' + ' to ' + id );
    $('#' + id).html(msg);
}

function hideMsgInDiv(id){
    console.log("Hiding msg");
    $('#' + id).empty();
}

function showLoadingMsg(){
    $.mobile.showPageLoadingMsg();
}
function hideLoadingMsg(){
    $.mobile.hidePageLoadingMsg();
}

function showToast(message){
    console.log("Showing toast");
    $("<div class='ui-loader ui-overlay-shadow ui-body-b ui-corner-all'><h1>" + message + "</h1></div>")
    .css({
        display: "block",
        opacity: 0.96,
        top: window.pageYOffset+100
    })
    .appendTo("body").delay(800)
    .fadeOut(400, function(){
        $(this).remove();
    });
}

function getServiceAddressDialog(){
    
    $(this).simpledialog({
        'mode' : 'string',
        'prompt' : 'What do you say?',
        'buttons' : {
            'OK': {
                click: function () {
                    console.log("data: " + $('#pickin').val())
                // $('#dialogoutput').html($('#dialoglink').attr('data-string'));
                }
            },
            'Cancel': {
                click: function () {
                    return false;
                },
                icon: "delete",
                theme: "c"
            }
        }
    });
   
}