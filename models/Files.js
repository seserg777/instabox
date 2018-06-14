const ncp = require('ncp').ncp;
const fs = require('fs');
const path = require('path');

const moveVideo = (source, destination) => {
    console.log('Start moveVideo');

    return new Promise((resolve, reject) => {
        const s = fs.createReadStream(source);
        const d = fs.createWriteStream(destination);

        s.pipe(d, {end: false});
        s.on('end', function() { console.log('End moveVideo');resolve(destination.replace(/public/g, "")); });
        s.on('error', function(err) {reject(err); });
    });
}

const copyFolder = (s, d) => {
    console.log('Start copyFolder');
    
    return new Promise((resolve, reject) => {
        return new Promise((resolve, reject) => {
            ncp(s, d, function (err) {
                if (err) {
                    reject(err);
                }
                resolve(d);
            })
        })
        .then(function(result){
            console.log(`copyFolder result = ${result}`);
            
            if (fs.existsSync(path.join(result, 'video.mp4'))) {
                let movevideo = moveVideo(path.join(result, 'video.mp4'), path.join('./public/video/' + Date.parse(new Date()) + '.mp4'));

                movevideo.then(function(result){
                    resolve(result);
                });
            } else {
                reject();
            }
        });
    });
}

exports.copyFolder = copyFolder;
exports.moveVideo = moveVideo;