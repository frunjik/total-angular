const fs = require('fs');
const path = require('path');
const rootfolder = '../';
const { exec } = require('child_process');

exports.install = function() {
	F.route('/api/command', execCommand, ['get', 'cors']);
};

function log(s) {
	console.log(s);
}

function execCommand() {
	var self = this;
	var cmd  = self.req.query.cmd || '';

	log('CMD: ' + cmd);

    const response = {
        result: null,
        error: null
    };

    try {
        if (!cmd) {
            throw new Error('Invalid command');
        }

        const options = {
            cwd: (cmd.startsWith('ng ')) ? '../client' : '../',
        };

        exec(cmd, options, (err, stdout, stderr) => {
            if (err) {
                // node couldn't execute the command
                response.error = err.toString();
            }
            else {
                response.result = {stdout: stdout, stderr: stderr};
            }
            // the *entire* stdout and stderr (buffered)
            log(`\nstdout:\n${stdout}`);
            log(`\nstderr:\n ${stderr}`);
            self.res.json(response);
        });
    }
    catch(e) {
        response.error = e.toString();
        self.res.json(response);
    }
}
