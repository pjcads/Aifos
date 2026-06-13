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
            '[1/4] Testing Connection...'
        );

        await runScript(
            'testConnection.js'
        );

        console.log('');

        console.log(
            '[2/4] Installing Database...'
        );

        await runScript(
            'installDatabase.js'
        );

        console.log('');

        console.log(
            '[3/4] Running Migrations...'
        );

        await runScript(
            'runMigrations.js'
        );

        console.log('');

        console.log(
            '[4/4] Seeding Database...'
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