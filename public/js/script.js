/*const startWatchFolder = () => {
    if($('#watch-folder').val()){
        jQuery('.navbar .status i').removeAttr('class').addClass('active');

        const jqXhr = $.ajax({
            type: 'POST',
            url: '/config',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify({
                watch_folder: $('#watch-folder').val(),
            })
        });;
                
        jqXhr
        .done(function (data) {
            console.log('Success ajax send folder path');
        })
        .fail(function (data) {
            console.log('error common back', xhr);
            jQuery('.navbar .status i').removeAttr('class').addClass('passive');
        });
    }
}*/

const socket = io();



const startWatchFolder = () => {
    if($('#watch-folder').val()){
        socket.emit('startWatchFolder', $('#watch-folder').val());
    }
}

socket.on('startWatchingFolder',function(){
    jQuery('.navbar .status i').removeAttr('class').addClass('active');
    jQuery('.navbar .status b').text('watching folder');
});

socket.on('startCreatingVideo',function(msg){
    jQuery('.navbar .status b').text('creating video');
});

socket.on('endCreatingVideo',function(video){
    jQuery('.navbar .status b').text('video was created');
    console.log(`video was created ${video}`);

    jQuery('.gallery').append(`<li><video class="video-js" controls preload="auto" width="640" height="264" data-setup="{}"><source src="${video}" type='video/mp4'><p class="vjs-no-js">To view this video please enable JavaScript, and consider upgrading to a web browser that <a href="http://videojs.com/html5-video-support/" target="_blank">supports HTML5 video</a></p></video></li>`);
});

socket.on('startMovingFiles',function(msg){
    jQuery('.navbar .status b').text('moving files');
});