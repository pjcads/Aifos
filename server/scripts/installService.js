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
            process.cwd(),
            'server.js'
        )

});

service.on(
    'install',
    () => {

        console.log(
            'Service installed.'
        );

        service.start();

    }
);

service.on(
    'start',
    () => {

        console.log(
            'Service started.'
        );

    }
);

service.install();