import { addMinutes, isSunday, format, isBefore, setHours, setMinutes } from "date-fns";
export function generateSlots(now: Date, days=7, open='09:00', close='17:00') {
  const [oh, om] = open.split(':').map(Number);
  const [ch, cm] = close.split(':').map(Number);
  const out: {date: string, times: string[]}[] = [];
  for (let d=0; d<days; d++) {
    const day = new Date(now);
    day.setDate(day.getDate()+d);
    if (isSunday(day)) continue;
    if (d === 0) {
      const cutoff = setMinutes(setHours(new Date(now), 12), 0);
      if (isBefore(cutoff, now)) continue;
    }
    const start = setMinutes(setHours(new Date(day), oh), om);
    const end = setMinutes(setHours(new Date(day), ch), cm);
    const times: string[] = [];
    for (let t = start; t < end; t = addMinutes(t, 15)) times.push(format(t, 'HH:mm'));
    out.push({ date: format(day, 'yyyy-MM-dd'), times });
  }
  return out;
}
