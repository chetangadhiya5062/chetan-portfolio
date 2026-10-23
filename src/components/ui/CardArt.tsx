/** Decorative corner art for the four project cards: four different pictures, each reacting a little when the card is hovered. */
export default function CardArt({ i }: { i: number }) {
  const k = i % 4;
  return (
    <svg aria-hidden viewBox="0 0 600 400" preserveAspectRatio="xMaxYMid slice" className="pointer-events-none absolute inset-0 size-full opacity-70 transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-1">
      {k === 0 && (
        <g fill="none" stroke="var(--color-lime)" strokeOpacity={0.2}>
          {[70, 120, 170, 220, 270].map((r) => <circle key={r} cx={560} cy={330} r={r} strokeDasharray={r % 120 === 70 ? "2 8" : undefined} />)}
          <circle cx={560} cy={330} r={5} fill="var(--color-lime)" fillOpacity={0.6} />
        </g>
      )}
      {k === 1 && (
        <g>
          {[[430, 80], [520, 150], [470, 240], [560, 300], [380, 200], [560, 60]].map(([x, y], n, a) => (
            <g key={n}>
              {a.slice(n + 1).map(([x2, y2], m) => <line key={m} x1={x} y1={y} x2={x2} y2={y2} stroke="var(--color-cyan)" strokeOpacity={0.18} />)}
              <circle cx={x} cy={y} r={4} fill="var(--color-cyan)" fillOpacity={0.55} />
            </g>
          ))}
        </g>
      )}
      {k === 2 && (
        <g fill="none" stroke="var(--color-lime)" strokeOpacity={0.2}>
          {[0, 1, 2, 3, 4, 5].map((n) => <path key={n} d={`M300 ${250 + n * 22} C 380 ${190 + n * 22}, 450 ${330 + n * 14}, 600 ${240 + n * 22}`} />)}
        </g>
      )}
      {k === 3 && (
        <g>
          {Array.from({ length: 7 * 5 }, (_, n) => {
            const cx = 380 + (n % 7) * 30, cy = 70 + Math.floor(n / 7) * 30;
            const on = (n * 7) % 5 === 0;
            return <circle key={n} cx={cx} cy={cy} r={on ? 4 : 2} fill={on ? "var(--color-cyan)" : "var(--color-lime)"} fillOpacity={on ? 0.6 : 0.25} />;
          })}
        </g>
      )}
    </svg>
  );
}
