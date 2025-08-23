function timeAgo(date) {
  const now = new Date();
  const diffMs = date - now;
  const diffSec = Math.round(diffMs / 1000);

  const units = [
    { max: 60, value: 1, name: "second" },
    { max: 3600, value: 60, name: "minute" },
    { max: 86400, value: 3600, name: "hour" },
    { max: 2592000, value: 86400, name: "day" },
    { max: 31536000, value: 2592000, name: "month" },
    { max: Infinity, value: 31536000, name: "year" },
  ];

  let unit = units.find(u => Math.abs(diffSec) < u.max);
  let value = Math.round(diffSec / unit.value);
  return new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(value, unit.name);
}

module.exports = {
  timeAgo
};