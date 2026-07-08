import { getStartDate } from "@/modules/dashboard/helpers/getStartDate";

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function makeKey(date: Date, range: string): string {
  const br = new Date(date.getTime() - 3 * 60 * 60 * 1000);
  const y = br.getUTCFullYear();
  const m = pad(br.getUTCMonth() + 1);
  const d = pad(br.getUTCDate());
  const h = pad(br.getUTCHours());

  switch (range) {
    case "1D":
      return `${y}-${m}-${d} ${h}:00:00`;
    case "1W":
    case "1M":
    case "3M":
      return `${y}-${m}-${d}`;
    case "6M":
      return `${y}-${m}`;
    default:
      return `${y}-${m}-${d}`;
  }
}

export function generateBuckets(range: string, now: Date): { key: string; date: Date }[] {
  const buckets: { key: string; date: Date }[] = [];
  const startDate = getStartDate(range);
  const current = new Date(startDate);

  while (current <= now) {
    buckets.push({ key: makeKey(current, range), date: new Date(current) });

    switch (range) {
      case "1D":
        current.setHours(current.getHours() + 1);
        break;
      case "1W":
        current.setDate(current.getDate() + 1);
        break;
      case "1M":
        current.setDate(current.getDate() + 1);
        break;
      case "3M":
        current.setDate(current.getDate() + 7);
        break;
      case "6M":
        current.setMonth(current.getMonth() + 1);
        break;
    }
  }

  return buckets;
}
