const chokidar = require('chokidar');
const fs = require('fs');
const path = require('path');
const socketio = require('socket.io');

const imageExtensions = require('image-extensions');
const lowerCase = require('lower-case')

const im = require('imagemagick');

const express = require('express');
const sass = require('node-sass-middleware');
const expressValidator = require('express-validator');
const bodyParser = require('body-parser');
const errorHandler = require('errorhandler');

const homeController = require('./controllers/home');
const configController = require('./controllers/config');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
global.io = io;
app.disable('x-powered-by');
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(sass({
    src: path.join(__dirname, 'public'),
    dest: path.join(__dirname, 'public')
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressValidator());
app.use(express.static(path.join(__dirname, 'public'), {maxAge: 0}));

app.get('/', homeController.index);
app.post('/config', configController.config);

app.use(errorHandler());
app.use(function (req, res, next) {
    res.status(404).render('errors/404');
});
app.use(function (error, req, res, next) {
    res.status(500);
    res.render('errors/500.jade', {title: '500: Internal Server Error', error: error});
});


const Video = require('./models/Video');
const Files = require('./models/Files');
const rimraf = require('rimraf');

const util = require('util');
const reader = util.promisify(fs.readdirSync);

global.appRoot = path.resolve(__dirname);;

io.on('connection', function(socket) {
    console.log('a user connected');

    let videos = fs.readdirSync('./public/video');
    console.log(videos);
    

    socket.on('startWatchFolder', function(watch_folder) {
        console.log('socket startWatchFolder');

        if (fs.existsSync(watch_folder)) {
            console.log('Folder exist');

            socket.emit('startWatchingFolder');
        
            try {
                const watcher = chokidar.watch(watch_folder, {ignored: /[\//]\./, depth: 0, ignoreInitial: true, persistent: true});
                
                watcher.on('ready', function() {
                    watcher.on('all', function (event, path) {
                        //console.log(`Main event:${event}`);
                        //console.log(`Main path:${path}`);
        
                        if(event === 'add' && foldersFamily(watch_folder, eventFolder) && watchChild){
                            console.log(`See for child`);
        
                            //fs.readdir(eventFolder, (err, files) => {
                            try {
                                let files = fs.readdirSync(eventFolder);
                                //reader(eventFolder).then(files => {
                                    console.log(`files.length:${files.length}`);
                                    if(files.length >= 48){
            
                                        watcher.unwatch(eventFolder);
                                        watchChild = false;

                                        console.log('48  files YEah!!!');

                                        /*const testPromise = new Promise((resolve, reject) => {
                                            let test = Files.copyFolder(path.join(watch_folder), path.join(__dirname, 'tmp/' + Date.parse(new Date())));

                                            test.then(function(result){
                                                resolve(result);
                                            });
                                        })
                                        .then(function(result){
                                            console.log(result);
                                        });*/

                                        const creatingVideoPromise = new Promise((resolve, reject) => {
                                            console.log(`Start creatingVideoPromise`);
                                            socket.emit('startCreatingVideo');
                                            let video = Video.createMP4(eventFolder);

                                            video.then(function(result){
                                                resolve(result);
                                            });
                                        });

                                        creatingVideoPromise.then(function(result){
                                            console.log(`End creatingVideoPromise ${result}`);
                                        })
                                        .then(function(result){
                                            //console.log(`116: ${eventFolder} | ${(__dirname + '/tmp/' + Date.parse(new Date()).toString())}`);
                                            let copyFolder = Files.copyFolder(eventFolder, (__dirname + '/tmp/' + Date.parse(new Date())));
                                            
                                            copyFolder.then(function(result){
                                                console.log(`copyFolder result = ${result}`);

                                                socket.emit('endCreatingVideo', result);

                                                rimraf(eventFolder, () => {
                                                    console.log('folder was deleted');
                                                });

                                                watcher.add(watch_folder);
                                                
                                            });
                                        });

                                        //return;
                                    }
                                //});
                            } catch(err){
                                console.log(err.message);
                            }
                        }
        
                        if(event === 'addDir'){
                            let type = whatIsIt(path);
                            console.log(`Was create ${type} ${path}. Start watching`);
                            
                            watchChild = true;
        
                            watcher.add(path);
                            watcher.unwatch(watch_folder);
                            
                            eventFolder = path;
                        }
        
                        if(event === 'unlinkDir'){
                            console.log(`Need unlink`);
                            watcher.add(watch_folder);
        
                            watchChild = false;
                            eventFolder = false;
                        }
                    });
        
                    watcher.on('error', function(error) { 
                        if (process.platform === 'win32' && error.code === 'EPERM') { 
                            fs.open(watch_folder, 'r', function(err, fd) { 
                                if (fd) fs.close(fd); 
                            }); 
                        }
                    });
                });
            } catch(err){
                console.log(err.message);
            }
        
        } else {
            console.log('Folder does not exist');
        }
    });  
});

server.listen(app.get('port'), () => {
    console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
});

module.exports = app;

//const watchFolder = __dirname + '/tmp!!!';

let watchChild = false;
let eventFolder,imageDimensions;

const foldersFamily = (parent, dir) => {
    const relative = path.relative(parent, dir);
    const isSubdir = !!relative && !relative.startsWith('..') && !path.isAbsolute(relative);
    return isSubdir;
}

const whatIsIt = (any) => {
    const stats = fs.statSync(any);

    if(stats.isFile()){
        return 'file';
    }
    if(stats.isDirectory()){
        return 'directory';
    }

    return false;
}

/*const countFiles = (dir) => {
    return fs.readdir(watchFolder, (err, files) => {
        console.log(`count_files = ${count_files}`);
    });
};*/
