const fs = require("fs");
const { exec } = require('pkg');

(async() => {
    if(fs.existsSync('pkg/agent-serve-linux')) {
        fs.unlinkSync('pkg/agent-serve-linux');
    }
    if(fs.existsSync('pkg/agent-serve-macos')) {
        fs.unlinkSync('pkg/agent-serve-macos');
    }
    if(fs.existsSync('pkg/agent-serve-win.exe')) {
        fs.unlinkSync('pkg/agent-serve-win.exe');
    }
    await exec([ 'dist/main.js', '--out-path', 'pkg/']);
    await fs.renameSync('pkg/main-linux', 'pkg/agent-serve-linux');
    await fs.renameSync('pkg/main-macos', 'pkg/agent-serve-macos');
    await fs.renameSync('pkg/main-win.exe', 'pkg/agent-serve-win.exe');
    console.log('build success!');
})();
