const Service = require('node-windows').Service;
const path = require('path');
const config = require('../src/config/config');

const service = new Service({

    name: config.Service.Name,

    script:
        path.join(
            process.cwd(),
            'server.js'
        )

});

service.on(
    'uninstall',
    () => {

        console.log(
            'Service removed.'
        );

    }
);

service.uninstall();