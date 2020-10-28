const program = require('commander');
const getMode = require('./view/modeView');

program.version('0.1', '-v, --version');

program.parse(process.argv);

getMode();
