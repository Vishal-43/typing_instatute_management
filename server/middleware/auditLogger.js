const AuditLog = require('../models/AuditLog');

const logAudit = (action, module) => async (req, res, next) => {
  res.on('finish', async () => {
    if (res.statusCode < 400 && req.user) {
      try {
        await AuditLog.create({
          user: req.user._id,
          action,
          module,
          recordId: req.params.id || null,
          details: req.body || {},
          ipAddress: req.ip,
        });
      } catch (err) {
        console.error('Audit log error:', err.message);
      }
    }
  });
  next();
};

module.exports = { logAudit };
