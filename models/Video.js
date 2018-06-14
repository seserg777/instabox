const fs = require('fs');
const path = require('path');
const isImage = require('is-image');
const videoshow = require('videoshow');
const util = require('util');
const reader = util.promisify(fs.readdir);

const numberAs = (a,b) => {
    return a - b;
}

const createMP4 = (dir) => {
    console.log(`start createMP4 ${dir}`);

    return reader(dir).then(list => {
        console.log('Start reader function');
        //console.log(list);
        let images = [];

        for (var i in list) {
            if(isImage(dir + '/' + list[i])){
                //console.log(path.parse(list[i]).name)
                list[i] = path.parse(list[i]).name;
            } else {
                list.splice(i);
            }
        }

        //console.log(list);

        list.sort(numberAs);

        //console.log(list);

        let files_reverse = list.slice(0);
        files_reverse.reverse();

        //console.log(list);

        list.splice(-1,1);

        list.push(...files_reverse);

        for (var i in list) {images.push({path:dir + '/' + list[i] + '.JPG'});}

        const videoOptions = {
            fps: 24,
            loop: 0.1,
            transition: false,
            videoBitrate: 3000,
            videoCodec: 'libx264',
            size:'1024x?',
            format: 'mp4',
            pixelFormat: 'yuv420p'
        }

        console.log('will start videoshow');
        return new Promise((resolve, reject) => {
            console.log('Before start videoshow');
            //resolve('F:/openserver526/OpenServer/domains/instabox/images/video.mp4');
            //console.log(images);
            videoshow(images, videoOptions)
            .save(dir+'/video.mp4')
            .on('start', function (command) {
                //console.log('ffmpeg process started:', command);
                console.log('ffmpeg process started')
            })
            .on('error', function (err, stdout, stderr) {
                console.error('Error:', err);
                console.error('ffmpeg stderr:', stderr);
                console.error('ffmpeg stdout:', stdout);

                reject(err);
            })
            .on('end', function (output) {
                console.error('Video created in:', output);
                resolve(output);
            });
        });
    });
}

exports.createMP4 = createMP4;