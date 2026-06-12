const { spawn } = require('child_process');
const path = require('path');

function runScript(scriptName) {

    return new Promise((resolve, reject) => {

        const scriptPath =
            path.join(
                __dirname,
                scriptName
            );

        const child =
            spawn(
                'node',
                [scriptPath],
                {
                    stdio: 'inherit'
                }
            );

        child.on(
            'close',
            code => {

                if (code === 0) {

                    resolve();

                } else {

                    reject(
                        new Error(
                            `${scriptName} failed`
                        )
                    );

                }

            }
        );

    });

}

async function setupCore() {

    try {

        console.log('');
        console.log(
            '================================='
        );

        console.log(
            'Aifos Core Setup'
        );

        console.log(
            '================================='
        );

        console.log('');

        console.log(
            '[1/3] Testing Connection...'
        );

        await runScript(
            'testConnection.js'
        );

        console.log('');

        console.log(
            '[2/3] Installing Database...'
        );

        await runScript(
            'installDatabase.js'
        );

        console.log('');

        console.log(
            '[3/3] Seeding Database...'
        );

        await runScript(
            'seedDatabase.js'
        );

        console.log('');

        console.log(
            '================================='
        );

        console.log(
            'Aifos Core installation completed.'
        );

        console.log(
            '================================='
        );

        console.log('');

    } catch (err) {

        console.error('');

        console.error(
            'Setup failed.'
        );

        console.error(
            err.message
        );

        process.exit(1);

    }

}

setupCore();