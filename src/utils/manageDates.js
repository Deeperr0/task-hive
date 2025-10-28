export function toDateAny(val) {
  if (!val) return null;
  if (val instanceof Date) return val;
  if (typeof val.toDate === "function") return val.toDate(); // Firestore Timestamp
  if (typeof val.seconds === "number") {
    // {seconds, nanoseconds}
    return new Date(
      val.seconds * 1000 + Math.floor((val.nanoseconds ?? 0) / 1e6)
    );
  }
  if (typeof val === "number") return new Date(val); // epoch ms
  if (typeof val === "string") {
    // try native parse first
    const d = new Date(val);
    if (!isNaN(d)) return d;
    // fallback for Firestore console-like strings: "October 19, 2023 at 12:00:00 AM UTC+2"
    const m = val.match(/^[A-Za-z]+\s+\d{1,2},\s*\d{4}/);
    if (m) {
      const d2 = new Date(m[0]); // e.g. "October 19, 2023"
      if (!isNaN(d2)) return d2;
    }
  }
  return null;
}

// 2) Date -> "YYYY-MM-DD" in local time (no UTC shift)
export function toYMDLocal(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// 3) Normalizer for <input type="date">
export function normalizeDate(val) {
  const dt = toDateAny(val);
  return dt ? toYMDLocal(dt) : "";
}

export function toDate(val) {
  if (!val) return null;
  if (val instanceof Date) return val;
  if (typeof val.toDate === "function") return val.toDate(); // Firestore Timestamp
  if (typeof val === "number") return new Date(val); // epoch ms
  if (typeof val === "string") return new Date(val); // ISO
  if (typeof val.seconds === "number") {
    // {seconds, nanoseconds}
    return new Date(
      val.seconds * 1000 + Math.floor((val.nanoseconds ?? 0) / 1e6)
    );
  }
  return null;
}
export function fmtDate(
  val,
  opts = { year: "numeric", month: "short", day: "2-digit" }
) {
  const d = toDate(val);
  return d ? d.toLocaleDateString(undefined, opts) : "—";
}