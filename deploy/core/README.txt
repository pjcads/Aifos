AIFOS CORE DEPLOYMENT

Prerequisites

1. Node.js 20 LTS
2. MySQL 8+

Setup

1. Create database:
   CREATE DATABASE aifos_core;

2. Update appsettings.json

3. Run:
   node scripts/setupCore.js

4. Install service:
   node scripts/installService.js

5. Verify:
   http://localhost:5000/health

Default Login

Username: admin
Password: admin1234