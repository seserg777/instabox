const fs = require('fs');
const path = require('path');
const isImage = require('is-image');
const videoshow = require('videoshow');
const util = require('util');
const reader = util.promisify(fs.readdir);

const numberAs = (a,b) => {
    return a - b;
}

const splitRepeats = (src, dir) => {
    //console.log(global.repeat_set_count);

    let output = [];

    for (var i in src) {
        if(isImage(dir + '/' + src[i])){
            src[i] = path.parse(src[i]).name;
        } else {
            src.splice(i);
        }
    }

    src.sort(numberAs);

    let files_reverse = src.slice(0);
    files_reverse.reverse();

    src.splice(-1,1);

    src.push(...files_reverse);

    for(i = 1; i <= global.repeat_set_count; i++){
        //console.log(i);
        //src.splice(-1,1);
        output.push(...src);
    }

    //console.log(output);

    return output;
}

const createMP4 = (dir) => {
    console.log(`start createMP4 ${dir}`);

    return reader(dir).then(list => {
        console.log('Start reader function');

        let shots = splitRepeats(list, dir);

        let images = [];
        
        /*for (var i in list) {
            if(isImage(dir + '/' + list[i])){
                list[i] = path.parse(list[i]).name;
            } else {
                list.splice(i);
            }
        }

        list.sort(numberAs);

        let files_reverse = list.slice(0);
        files_reverse.reverse();

        list.splice(-1,1);

        list.push(...files_reverse);*/

        for (var i in shots) {images.push({path:dir + '/' + shots[i] + '.JPG'});}

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
exports.splitRepeats = splitRepeats;