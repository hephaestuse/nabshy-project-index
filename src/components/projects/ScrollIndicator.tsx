type ScrollIndicatorProps = {
  label: string;
};

export function ScrollIndicator({ label }: ScrollIndicatorProps) {
  return (
    <a
      href="#projects-grid"
      aria-label={label}
      className="absolute bottom-7 left-1/2 z-20 flex h-10 w-10 -translate-x-1/2 items-center justify-center text-white/85 outline-none transition hover:text-white focus-visible:ring-2 focus-visible:ring-white/80"
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-8 w-8">
        <path
          d="m6.5 9.5 5.5 5 5.5-5"
          fill="none"
          stroke="currentColor"
          strokeLinecap="square"
          strokeWidth="1.7"
        />
      </svg>
    </a>
  );
}
