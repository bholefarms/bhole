type LogoProps = {
  name?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
};

const sizeClasses = {
  sm: { mark: "h-9 w-9", title: "text-lg", sub: "text-[9px]" },
  md: { mark: "h-11 w-11", title: "text-xl", sub: "text-[10px]" },
  lg: { mark: "h-16 w-16", title: "text-2xl", sub: "text-xs" },
};

export function Logo({
  name = "Bhole Farms",
  size = "md",
  showText = true,
  className = "",
}: LogoProps) {
  const classes = sizeClasses[size];

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <svg
        className={`${classes.mark} shrink-0 drop-shadow-sm`}
        viewBox="0 0 96 96"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle cx="48" cy="48" r="44" fill="#F5F0EB" stroke="#2E7D32" strokeWidth="4" />
        <circle cx="48" cy="48" r="34" fill="#2E7D32" opacity="0.08" />
        <path
          d="M47 69V42"
          stroke="#5D4037"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d="M47 45C34 43 27 35 25 24c12 1 22 8 25 20"
          fill="#2E7D32"
        />
        <path
          d="M50 46c3-13 13-21 25-22-2 12-10 20-23 22"
          fill="#43A047"
        />
        <path
          d="M31 67c8-7 26-7 34 0"
          stroke="#F9A825"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d="M36 74c7-4 17-4 24 0"
          stroke="#5D4037"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.8"
        />
      </svg>
      {showText && (
        <span className="leading-none">
          <span className={`block font-heading font-bold tracking-tight text-primary ${classes.title}`}>
            {name}
          </span>
          <span className={`mt-1 block font-sans font-semibold uppercase tracking-[0.22em] text-muted-foreground ${classes.sub}`}>
            Organic Farm
          </span>
        </span>
      )}
    </div>
  );
}
