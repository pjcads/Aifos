const fs = require('fs');
const path = require('path');

const ROOT =
    path.join(__dirname, '..');

const SERVER =
    path.join(ROOT, 'server');

const RELEASE =
    path.join(
        ROOT,
        'release',
        'AifosCore'
    );

function copyRecursive(src, dest) {

    if (!fs.existsSync(src)) {
        return;
    }

    const stat = fs.statSync(src);

    if (stat.isDirectory()) {

        fs.mkdirSync(
            dest,
            { recursive: true }
        );

        for (const item of fs.readdirSync(src)) {

            copyRecursive(
                path.join(src, item),
                path.join(dest, item)
            );

        }

    } else {

        fs.copyFileSync(src, dest);

    }

}

if (fs.existsSync(RELEASE)) {

    fs.rmSync(
        RELEASE,
        {
            recursive: true,
            force: true
        }
    );

}

fs.mkdirSync(
    RELEASE,
    {
        recursive: true
    }
);

console.log(
    'Creating release package...'
);

copyRecursive(
    path.join(SERVER, 'database'),
    path.join(RELEASE, 'database')
);

copyRecursive(
    path.join(SERVER, 'migrations'),
    path.join(RELEASE, 'migrations')
);

copyRecursive(
    path.join(SERVER, 'scripts'),
    path.join(RELEASE, 'scripts')
);

copyRecursive(
    path.join(SERVER, 'appsettings.json'),
    path.join(RELEASE, 'appsettings.json')
);

fs.mkdirSync(
    path.join(RELEASE, 'logs'),
    { recursive: true }
);

fs.mkdirSync(
    path.join(RELEASE, 'backups'),
    { recursive: true }
);

console.log(
    'Release package created.'
);