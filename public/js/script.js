const socket = io();

const startWatchFolder = () => {
    if($('#watch-folder').val()){
        socket.emit('startWatchFolder', $('#watch-folder').val(), $('#set-count').val(), $('#repeat-set-count').val());
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

    jQuery('html, body').stop().animate({
        scrollTop: jQuery('.gallery li').last().offset().top
    }, 1000);
});

socket.on('startMovingFiles',function(msg){
    jQuery('.navbar .status b').text('moving files');
});

socket.on('findVideos', function(video){
    jQuery('.gallery').append(`<li><video class="video-js" controls preload="auto" width="640" height="264" data-setup="{}"><source src="${video}" type='video/mp4'><p class="vjs-no-js">To view this video please enable JavaScript, and consider upgrading to a web browser that <a href="http://videojs.com/html5-video-support/" target="_blank">supports HTML5 video</a></p></video></li>`);

    jQuery('html, body').stop().animate({
        scrollTop: jQuery('.gallery li').last().offset().top
    }, 1000);
});