export function getCairoDateString(date = new Date()) {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Africa/Cairo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  const parts = formatter.formatToParts(date);
  const r = {};
  parts.forEach(p => {
    r[p.type] = p.value;
  });
  return `${r.year}-${r.month}-${r.day}`;
}

export function getCairoISOString(date = new Date()) {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Africa/Cairo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
  const parts = formatter.formatToParts(date);
  const r = {};
  parts.forEach(p => {
    r[p.type] = p.value;
  });
  let hour = r.hour;
  if (hour === '24') hour = '00';
  const ms = String(date.getMilliseconds()).padStart(3, '0');
  return `${r.year}-${r.month}-${r.day}T${hour}:${r.minute}:${r.second}.${ms}Z`;
}

export function getLocalDateString(user) {
  if (user && user.settings?.devWarpTime && user.settings?.currentFakeDate) {
    return user.settings.currentFakeDate;
  }
  return getCairoDateString();
}

export function getLocalISOString(user) {
  if (user && user.settings?.devWarpTime && user.settings?.currentFakeDate) {
    const now = new Date();
    const fakeDateParts = user.settings.currentFakeDate.split('-');
    const fakeDate = new Date(
      parseInt(fakeDateParts[0], 10),
      parseInt(fakeDateParts[1], 10) - 1,
      parseInt(fakeDateParts[2], 10),
      now.getHours(),
      now.getMinutes(),
      now.getSeconds(),
      now.getMilliseconds()
    );
    return getCairoISOString(fakeDate);
  }
  return getCairoISOString();
}

/**
 * Determines whether every day between lastActiveDate (exclusive) and todayStr (exclusive)
 * is "excused" — meaning the student had no obligation to study that day.
 *
 * A day is excused if:
 *   1. It is a Rest Day (type === 'off') in the schedule, OR
 *   2. Every unlocked week was already fully completed AND the next week
 *      was still locked on that date (nothing to study even if they wanted to).
 *
 * @param {string} lastActiveDate  - YYYY-MM-DD of last activity
 * @param {string} todayStr        - YYYY-MM-DD of today
 * @param {Array}  schedule        - the full courseSchedule array
 * @param {object} user            - the user object (lessonsProgress, tasksProgress, submissions, settings)
 * @returns {boolean} true if all missed days are excused
 */
export function allMissedDaysExcused(lastActiveDate, todayStr, schedule, user) {
  if (!lastActiveDate || !todayStr || !schedule || !schedule.length) return false;

  const last = new Date(lastActiveDate);
  const today = new Date(todayStr);
  const diffMs = today - last;
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  // Should only be called when diffDays > 1 (there are missed days between last and today)
  if (diffDays <= 1) return false;

  // Build a lookup: date string → schedule day entry
  const dateToDay = {};
  schedule.forEach(d => {
    if (d.date) dateToDay[d.date] = d;
  });

  // Helper: is a given week fully completed by the user?
  const isWeekComplete = (weekNum) => {
    const startDay = (weekNum - 1) * 7 + 1;
    const endDay = weekNum * 7;
    const weekDays = schedule.filter(d => d.day >= startDay && d.day <= endDay && d.type !== 'off');
    if (!weekDays.length) return true;

    return weekDays.every(d => {
      if (d.type === 'review') return !!user.lessonsProgress?.[`review_${d.day}`]?.completed;
      if (d.type === 'project') return !!user.submissions?.[d.day];
      if (d.type === 'video') {
        const vids = d.videos || [];
        const videosOk = vids.every(v => user.lessonsProgress?.[v.videoId + '_day' + d.day]?.completed);
        const taskOk = d.task ? !!user.tasksProgress?.[d.task.taskId]?.completed : true;
        return videosOk && taskOk;
      }
      return true;
    });
  };

  // Helper: is a given week locked on a particular calendar date?
  const isWeekLockedOn = (weekNum, dateStr) => {
    // Respect dev-warp / open-availability settings
    if (user?.settings?.devWarpTime || user?.settings?.openAvailability) return false;

    const sundayDayNum = (weekNum - 1) * 7 + 1;
    const sundayDay = schedule.find(d => d.day === sundayDayNum);
    if (!sundayDay || !sundayDay.date) return true;

    // The week unlocks at the start of its Sunday
    return sundayDay.date > dateStr;
  };

  // Helper: on a given date, does the student have anything they *could* study?
  const hasAnythingToStudyOn = (dateStr) => {
    const totalWeeks = Math.ceil(schedule[schedule.length - 1].day / 7);
    for (let w = 1; w <= totalWeeks; w++) {
      if (isWeekLockedOn(w, dateStr)) continue; // locked — skip
      if (!isWeekComplete(w)) return true;       // unlocked + incomplete → something to do
    }
    return false; // all unlocked weeks are done
  };

  // Iterate every missed date between lastActive (exclusive) and today (exclusive)
  for (let i = 1; i < diffDays; i++) {
    const missed = new Date(last);
    missed.setDate(missed.getDate() + i);
    const missedStr = getCairoDateString(missed);

    const schedDay = dateToDay[missedStr];

    // Check 1: Is it a scheduled rest/off day?
    if (schedDay && schedDay.type === 'off') continue;

    // Check 2: Did the student have nothing to study (all done or all locked)?
    if (!hasAnythingToStudyOn(missedStr)) continue;

    // This day is NOT excused — streak should reset
    return false;
  }

  // All missed days were excused
  return true;
}
