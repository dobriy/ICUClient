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