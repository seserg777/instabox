const fs = require('fs');

const Video = require('../models/Video');

exports.config = (req, res, next) => {
    try {
        if (fs.existsSync(req.body.watch_folder)) {
            //console.log(Video.video(req.body.watch_folder));
            Video.createMP4(req.body.watch_folder);
            /*const workerPromise = new Promise((resolve, reject) => {
                
            });
            
            workerPromise.then(
                result => {
                    console.log('workerPromise result');
                },
                error => {
                    console.log('workerPromise error');
                }
            );*/

            

            //return res.json({errors: 0, msg:`Will watching folder ${req.body.watch_folder}`});
        } else {
            return res.json({errors: 0, msg:"Folder for watchind doesn't exist"});
        }
    } catch(err){
        return res.json({errors: 1, msg: err.message});
    }
};