const db = require('../config/db');

exports.getAnalytics = async (req, res) => {
  try {
    // Severity breakdown
    const [bySeverity] = await db.execute(
      'SELECT severity, COUNT(*) as count FROM incidents GROUP BY severity'
    );

    // Type breakdown
    const [byType] = await db.execute(
      'SELECT type, COUNT(*) as count FROM incidents GROUP BY type'
    );

    // Status breakdown
    const [byStatus] = await db.execute(
      'SELECT status, COUNT(*) as count FROM incidents GROUP BY status'
    );

    // Timeline: incidents per day for last 30 days
    const [timeline] = await db.execute(
      `SELECT DATE(created_at) as date, COUNT(*) as count 
       FROM incidents 
       WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
       GROUP BY DATE(created_at) 
       ORDER BY date ASC`
    );

    // Average response time (pending -> assigned) for resolved incidents
    const [responseTime] = await db.execute(
      `SELECT 
        AVG(TIMESTAMPDIFF(MINUTE, created_at, updated_at)) as avg_response_minutes
       FROM incidents 
       WHERE status = 'resolved'`
    );

    // Today's stats
    const [todayStats] = await db.execute(
      `SELECT COUNT(*) as today_count FROM incidents 
       WHERE DATE(created_at) = CURDATE()`
    );

    // Incidents by hour (for peak analysis)
    const [byHour] = await db.execute(
      `SELECT HOUR(created_at) as hour, COUNT(*) as count 
       FROM incidents 
       GROUP BY HOUR(created_at) 
       ORDER BY hour`
    );

    res.json({
      severity: bySeverity,
      type: byType,
      byStatus,
      timeline,
      responseTime: responseTime[0]?.avg_response_minutes || 0,
      todayCount: todayStats[0]?.today_count || 0,
      byHour,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};