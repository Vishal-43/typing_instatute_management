require('dotenv').config();
const connectDB = require('./config/db');
const app = require('./app');
const { startScheduler } = require('./services/schedulerService');

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  startScheduler();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
