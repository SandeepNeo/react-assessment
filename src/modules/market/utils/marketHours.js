/**
 * Checks if the Indian stock market (NSE/BSE) is currently open.
 * Market Hours: Monday to Friday, 09:15 AM - 03:30 PM IST (Asia/Kolkata).
 */
export function checkIsMarketOpen(customDate = null) {
  try {
    const now = customDate ? new Date(customDate) : new Date();

    // Convert date to IST parts
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Kolkata',
      weekday: 'short',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false,
    });

    const parts = formatter.formatToParts(now);
    const partMap = {};
    parts.forEach((p) => {
      partMap[p.type] = p.value;
    });

    const day = partMap.weekday; // 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'
    const hour = parseInt(partMap.hour, 10);
    const minute = parseInt(partMap.minute, 10);

    const isWeekday = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].includes(day);
    if (!isWeekday) {
      return {
        isOpen: false,
        reason: `Market Closed (Today is ${day}). Hours: Mon-Fri 09:15-15:30 IST`,
        currentTimeIST: `${day} ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')} IST`,
      };
    }

    const currentMinutesFromMidnight = hour * 60 + minute;
    const marketOpenMinutes = 9 * 60 + 15; // 09:15 AM
    const marketCloseMinutes = 15 * 60 + 30; // 03:30 PM

    const isOpen =
      currentMinutesFromMidnight >= marketOpenMinutes &&
      currentMinutesFromMidnight <= marketCloseMinutes;

    return {
      isOpen,
      reason: isOpen
        ? 'Market Active (Trading Hours)'
        : `Market Closed (Outside 09:15 - 15:30 IST)`,
      currentTimeIST: `${day} ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')} IST`,
    };
  } catch (error) {
    // Fallback if timezone formatting fails
    return {
      isOpen: true,
      reason: 'Market Active',
      currentTimeIST: 'IST',
    };
  }
}

export default checkIsMarketOpen;
