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

async function upgradeCore() {

    try {

        console.log('');
        console.log(
            '================================='
        );

        console.log(
            'Aifos Core Upgrade'
        );

        console.log(
            '================================='
        );

        console.log('');

        console.log(
            '[1/2] Testing Connection...'
        );

        await runScript(
            'testConnection.js'
        );

        console.log('');

        console.log(
            '[2/2] Running Migrations...'
        );

        await runScript(
            'runMigrations.js'
        );

        console.log('');

        console.log(
            '================================='
        );

        console.log(
            'Aifos Core upgrade completed.'
        );

        console.log(
            '================================='
        );

        console.log('');

    } catch (err) {

        console.error('');

        console.error(
            'Upgrade failed.'
        );

        console.error(
            err.message
        );

        process.exit(1);

    }

}

upgradeCore();