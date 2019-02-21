const fs = require("fs");
const { exec } = require('pkg');

(async() => {
    if(fs.existsSync('pkg/agent-server-linux')) {
        fs.unlinkSync('pkg/agent-server-linux');
    }
    if(fs.existsSync('pkg/agent-server-macos')) {
        fs.unlinkSync('pkg/agent-server-macos');
    }
    if(fs.existsSync('pkg/agent-server-win.exe')) {
        fs.unlinkSync('pkg/agent-server-win.exe');
    }
    await exec([ 'dist/main.js', '--out-path', 'pkg/']);
    await fs.renameSync('pkg/main-linux', 'pkg/agent-server-linux');
    await fs.renameSync('pkg/main-macos', 'pkg/agent-server-macos');
    await fs.renameSync('pkg/main-win.exe', 'pkg/agent-server-win.exe');
    console.log('build success!');
})();
