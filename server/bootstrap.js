const REQUIRED_MAJOR_VERSION = 26;

const currentMajorVersion =
    parseInt(
        process.versions.node.split('.')[0]
    );

if (
    currentMajorVersion !==
    REQUIRED_MAJOR_VERSION
) {

    console.error(
        `Aifos Core requires Node.js ${REQUIRED_MAJOR_VERSION}.x`
    );

    console.error(
        `Current version: ${process.version}`
    );

    process.exit(1);

}

require('bytenode');

require('./server.jsc');