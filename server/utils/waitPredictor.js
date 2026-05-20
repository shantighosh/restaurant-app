const TurnoverLog = require('../models/TurnoverLog');

exports.predictWaitTime = async (partySize, currentQueueLength) => {
  try {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const hourOfDay = now.getHours();

    // Get historical average for similar conditions
    const logs = await TurnoverLog.find({
      partySize: { $lte: partySize + 1, $gte: Math.max(1, partySize - 1) },
      dayOfWeek,
      hourOfDay: { $gte: hourOfDay - 1, $lte: hourOfDay + 1 }
    }).sort({ date: -1 }).limit(20);

    let avgDuration = 60; // default 60 minutes
    if (logs.length > 0) {
      avgDuration = logs.reduce((sum, l) => sum + l.durationMinutes, 0) / logs.length;
    }

    // Estimated wait = (queue length * average turn time) / number of tables roughly available
    const estimatedWait = Math.round(currentQueueLength * avgDuration * 0.4);
    return estimatedWait;
  } catch (err) {
    console.error('Predictor error:', err.message);
    return currentQueueLength * 20; // fallback: 20 min per party
  }
};

exports.logTurnover = async (tableId, partySize, durationMinutes) => {
  const now = new Date();
  await TurnoverLog.create({
    tableId, partySize, durationMinutes,
    dayOfWeek: now.getDay(),
    hourOfDay: now.getHours()
  });
};