var Service = require('node-windows').Service;
const path = require('path')
var {spawn} = require('child_process');
// Create a new service object
var svc = new Service({
  name:'Chat Service',
  description: '.My first Node Chat Service',
  script: path.join(__dirname,"app.js"),
 // script: path.join(__dirname,"public", "chat.bat")
});

console.log("see the app.js path",path.join(__dirname, 'app.js'))
// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install',function(){
  svc.start();
});

// Listen for the "start" event and let us know when the
// process has actually started working.
svc.on('start',function(){

  ls    = spawn('cmd.exe', ['/k', path.join(__dirname,"public", "chat.bat")]);

ls.stdout.on('data', function (data) {
    console.log('stdout: ' + data);
    });
    ls.stderr.on('data', function (data) {
    console.log('stderr: ' + data);
    });
    ls.on('exit', function (code) {
    console.log('child process exited with code ' + code);
    });

  console.log(svc.name+' started!\nVisit http://localhost:4000 to see it in action.');
});

// Install the script as a service.
svc.install();

