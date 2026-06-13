import WaitingListEntry from '../models/WaitingListEntry.js';
import Table from '../models/Table.js';

/**
 * Predicts estimated wait time in minutes for a new party
 * @param {Number} partySize - Number of guests
 * @returns {Promise<Number>} Estimated wait time in minutes
 */
export const predictWaitTime = async (partySize) => {
  try {
    // 1. Get the number of people currently waiting ahead
    const activeQueueCount = await WaitingListEntry.countDocuments({ status: 'waiting' });
    
    // 2. Find how many physical tables can actually accommodate this party size
    const suitableTablesCount = await Table.countDocuments({ capacity: { $gte: partySize } });
    
    // Base rule: If no suitable tables exist, fallback safely
    if (suitableTablesCount === 0) return 45; 

    // 3. Smart Algorithm: Base time (15 mins) + (Queue length * 10 mins) divided by total matching tables
    const averageTurnaroundPerTable = 12; // minutes per party cycle
    let estimatedMinutes = Math.round((activeQueueCount * averageTurnaroundPerTable) / suitableTablesCount);
    
    // Add a minimum floor buffer time so it feels realistic
    const minimumWait = 10;
    return estimatedMinutes < minimumWait ? minimumWait : estimatedMinutes;
  } catch (error) {
    console.error('Wait predictor error, returning default:', error);
    return 20; // Safe default fallback
  }
};