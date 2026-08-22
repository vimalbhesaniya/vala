export function SizeGuideContent() {
  const tables = [
    {
      title: "Shirts",
      headers: ["Size", "Chest (in)", "Length (in)"],
      rows: [
        ["28", "28", "24"], ["30", "30", "25"], ["32", "32", "26"],
        ["34", "34", "27"], ["36", "36", "28"],
      ],
    },
    {
      title: "Trousers",
      headers: ["Size", "Waist (in)", "Length (in)"],
      rows: [
        ["28", "28", "38"], ["30", "30", "39"], ["32", "32", "40"],
        ["34", "34", "41"], ["36", "36", "42"],
      ],
    },
    {
      title: "Skirts",
      headers: ["Size", "Waist (in)", "Length (in)"],
      rows: [
        ["28", "28", "18"], ["30", "30", "19"], ["32", "32", "20"],
        ["34", "34", "21"], ["36", "36", "22"],
      ],
    },
    {
      title: "Shoes",
      headers: ["Size", "Foot Length (cm)", "Age Group"],
      rows: [
        ["4", "22", "8–9 yrs"], ["5", "23", "9–10 yrs"],
        ["6", "24", "10–11 yrs"], ["7", "25", "11–12 yrs"],
      ],
    },
  ];

  const steps = [
    { title: "Chest", desc: "Measure around the fullest part of the chest, keeping the tape horizontal." },
    { title: "Waist", desc: "Measure around the natural waistline, keeping the tape comfortably loose." },
    { title: "Length", desc: "Measure from the highest point of the shoulder to the desired hem." },
    { title: "Height", desc: "Stand straight against a wall and measure from floor to top of head." },
  ];

  return (
    <div className="space-y-8">
      {tables.map((t) => (
        <div key={t.title}>
          <h3 className="mb-3 text-sm font-semibold text-primary">{t.title}</h3>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-background">
                  {t.headers.map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold tracking-wider text-muted uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {t.rows.map((row, i) => (
                  <tr key={i} className="border-b border-border last:border-0">
                    {row.map((cell, j) => (
                      <td key={j} className="px-4 py-3 text-foreground">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      <div>
        <h3 className="mb-4 text-sm font-semibold text-primary">How to Measure</h3>
        <ol className="space-y-4">
          {steps.map((s, i) => (
            <li key={s.title} className="flex gap-4">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-semibold text-accent">
                {i + 1}
              </span>
              <div>
                <p className="text-sm font-medium text-foreground">{s.title}</p>
                <p className="mt-0.5 text-sm text-muted">{s.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
