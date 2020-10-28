/**
 * Integration test helper
 * Author: Andrés Zorro <zorrodg@gmail.com>
 */

const { existsSync } = require('fs');
const { constants } = require('os');
const spawn = require('cross-spawn');
const concat = require('concat-stream');
const PATH = process.env.PATH;

/**
 * Creates a child process with script path
 * @param {string} processPath Path of the process to execute
 * @param {Array} args Arguments to the command
 * @param {Object} env (optional) Environment variables
 */
function createProcess(processPath, args = [], env = null) {
    // Ensure that path exists
    if (!processPath || !existsSync(processPath)) {
        throw new Error('Invalid process path');
    }

    args = [processPath].concat(args);

    // This works for node based CLIs, but can easily be adjusted to
    // any other process installed in the system
    return spawn('node', args, {
        env: Object.assign(
            {
                NODE_ENV: 'test',
                preventAutoStart: false,
                PATH // This is needed in order to get all the binaries in your current terminal
            },
            env
        ),
        stdio: [null, null, null, 'ipc'] // This enables interprocess communication (IPC)
    });
}

/**
 * Creates a command and executes inputs (user responses) to the stdin
 * Returns a promise that resolves when all inputs are sent
 * Rejects the promise if any error
 * @param {string} processPath Path of the process to execute
 * @param {Array} args Arguments to the command
 * @param {Array} inputs (Optional) Array of inputs (user responses)
 * @param {Object} opts (optional) Environment variables
 */

function executeWithInput(processPath, args = [], inputs = [], opts = {}) {
    // Handle case if user decides not to pass input data
    // A.k.a. backwards compatibility
    if (!Array.isArray(inputs)) {
        opts = inputs;
        inputs = [];
    }

    const { env = null, timeout = 350 } = opts;
    const childProcess = createProcess(processPath, args, env);
    childProcess.stdin.setEncoding('utf-8');

    let currentInputTimeout;
    // Creates a loop to feed user inputs to the child process
    // in order to get results from the tool
    // This code is heavily inspired (if not blantantly copied)
    // from inquirer-test package
    const loop = (inputs) => {
        if (!inputs.length) {
            childProcess.stdin.end();
            return;
        }

        currentInputTimeout = setTimeout(() => {
            childProcess.stdin.write(inputs[0]);
            loop(inputs.slice(1));
        }, timeout);
    };
    const promise = new Promise((resolve, reject) => {
        childProcess.stderr.once('data', (err) => {
            // If childProcess errors out, stop all
            // the pending inputs if any
            childProcess.stdin.end();

            if (currentInputTimeout) {
                clearTimeout(currentInputTimeout);
                inputs = [];
            }

            reject(err.toString());
        });
        childProcess.on('error', reject);
        // Kick off the process
        loop(inputs);
        childProcess.stdout.pipe(
            concat((result) => {
                resolve(result.toString());
            })
        );
    });
    return promise;
}
module.exports = { execute: executeWithInput };
