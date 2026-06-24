const cron = require('node-cron');

const startScheduler = () => {
  const pingUrl = process.env.PING_URL;

  if (!pingUrl) {
    console.log('Scheduler: No PING_URL configured, skipping');
    return;
  }

  console.log(`Scheduler: Will ping ${pingUrl} every 10 minutes`);

  cron.schedule('*/10 * * * *', async () => {
    try {
      const response = await fetch(pingUrl);
      console.log(`Scheduler: Pinged ${pingUrl} - Status ${response.status}`);
    } catch (err) {
      console.error(`Scheduler: Ping failed for ${pingUrl} - ${err.message}`);
    }
  });
};

module.exports = { startScheduler };
