type Props = {
  label: string;
  min: number;
  max: number;
  step?: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  formatValue?: (v: number) => string;
};

export default function DualRangeSlider({
  label,
  min,
  max,
  step = 1,
  value,
  onChange,
  formatValue,
}: Props) {
  const [lo, hi] = value;
  const fmt = formatValue ?? ((v: number) => v.toLocaleString());

  return (
    <div>
      <div className="mb-2 text-sm text-neutral-300">{label}</div>
      <div className="relative h-5">
        <div className="absolute top-1/2 h-1 w-full -translate-y-1/2 rounded-full bg-white/10" />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={lo}
          onChange={(e) => onChange([Math.min(Number(e.target.value), hi), hi])}
          className="pointer-events-none absolute w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-400"
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={hi}
          onChange={(e) => onChange([lo, Math.max(Number(e.target.value), lo)])}
          className="pointer-events-none absolute w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-400"
        />
      </div>
      <div className="mt-2 flex justify-between gap-2 text-xs">
        <span className="rounded border border-white/10 bg-neutral-800 px-2 py-1">{fmt(lo)}</span>
        <span className="rounded border border-white/10 bg-neutral-800 px-2 py-1">{fmt(hi)}</span>
      </div>
    </div>
  );
}
