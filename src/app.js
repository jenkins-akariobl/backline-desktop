var gui = require('nw.gui');
var path = require('path');
var fs = require('fs');

gui.App.clearCache();
var dir = path.join(gui.App.dataPath, '/Local Storage');
console.log('Local Dir is '+dir);

try {
  // Query the entry
  stats = fs.lstatSync(dir);

  // Is it a directory?
  if (stats.isDirectory()) {
    var clearlocal = rmdir(dir);
  }
}
catch (e) {
  console.log(dir + ' does not exist yet');
}


var nwWin = gui.Window.get();
nwWin.cookies.getAll( {},
    function(cookies) {
      console.log('Attempting to remove '+cookies.length+' cookies...');
      for (var i=0; i<cookies.length; i++) {
        removeCookie(cookies[i]);
      }
    });
win = gui.Window.open('https://backline.akariobl.com',{toolbar:false,frame:true, focus: true, show: false, width: 1100, height: 768});

var platform = require('./components/platform');
var updater = require('./components/updater');
var menus = require('./components/menus');
var settings = require('./components/settings');
var windowBehaviour = require('./components/window-behaviour');
var dispatcher = require('./components/dispatcher');

// Ensure there's an app shortcut for toast notifications to work on Windows
if (platform.isWindows) {
  gui.App.createShortcut(process.env.APPDATA + "\\Microsoft\\Windows\\Start Menu\\Programs\\Backline.lnk");
}

// Add dispatcher events
dispatcher.addEventListener('win.alert', function(data) {
  data.win.window.alert(data.message);
});

dispatcher.addEventListener('win.confirm', function(data) {
  data.callback(data.win.window.confirm(data.message));
});

// Window state
windowBehaviour.restoreWindowState(win);
windowBehaviour.bindWindowStateEvents(win);

// Check for update
if (settings.checkUpdateOnLaunch) {
  updater.checkAndPrompt(gui.App.manifest, win);
}

// Run as menu bar app
if (settings.asMenuBarAppOSX) {
  win.setShowInTaskbar(false);
  menus.loadTrayIcon(win);
}

// Load the app menus
menus.loadMenuBar(win);
//if (platform.isWindows) {
//  menus.loadTrayIcon(win);
//}

// Adjust the default behaviour of the main window
windowBehaviour.set(win);
windowBehaviour.setNewWinPolicy(win);

// Add a context menu
menus.injectContextMenu(win, window, document);



// Reload the app periodically until it loads
var reloadIntervalId = setInterval(function() {
  if (win.window.navigator.onLine) {
    clearInterval(reloadIntervalId);
  } else {
    win.reload();
  }
}, 10 * 1000);

function rmdir(dir) {
  var list = fs.readdirSync(dir);
  for(var i = 0; i < list.length; i++) {
    var filename = path.join(dir, list[i]);
    var stat = fs.statSync(filename);
    console.log('Removing '+filename);
    if(filename == "." || filename == "..") {
      // pass these files
    } else if(stat.isDirectory()) {
      // rmdir recursively
      rmdir(filename);
    } else {
      // rm fiilename
      fs.unlinkSync(filename);
    }
  }
  fs.rmdirSync(dir);
}

function removeCookie(cookie) {
  var lurl = "http" + (cookie.secure ? "s" : "") + "://" + cookie.domain + cookie.path;
    nwWin.cookies.remove({
          url: lurl,
          name: cookie.name
        },
      function(result) {
        if (result) {
          if (!result.name) {
            result = result[0];
          } // in devTools it looked like the result was an array
          console.log('cookie remove callback: ' + result.name + ' ' +
              result.url);
        } else {
          console.log('cookie removal failed');
        }
      });
}

