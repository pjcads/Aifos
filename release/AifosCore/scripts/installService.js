const path = require('path');
const Service = require('node-windows').Service;
const config = require('../src/config/config');

const service = new Service({

    name:
        config.Service.Name,

    description:
        config.Service.Description,

    script:
        path.join(
            __dirname,
            '..',
            'bootstrap.js'
        )

});

service.on('install', () => {

    console.log('Service installed.');

    setTimeout(() => {
        service.start();
    }, 5000);

});

service.on('start', () => {

    console.log('Service started.');

});

service.install();