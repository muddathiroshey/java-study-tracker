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
