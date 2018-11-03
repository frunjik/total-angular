// ===================================================
// FOR DEVELOPMENT
// Total.js - framework for Node.js platform
// https://www.totaljs.com
// ===================================================

const options = {};

options.config = { "default-request-length": 20 };

// options.ip = '127.0.0.1';
// options.port = parseInt(process.argv[2]);
// options.sleep = 3000;
// options.inspector = 9229;
// options.debugger = 40894;


require('total.js/debug')(options);