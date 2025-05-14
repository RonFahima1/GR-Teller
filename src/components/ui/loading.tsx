import { cn } from "@/lib/utils";

interface LoadingProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  fullScreen?: boolean;
  text?: string;
}

const sizeMap = {
  sm: 24,
  md: 48,
  lg: 64,
};

export function Loading({ className, size = "md", fullScreen, text }: LoadingProps) {
  const spinnerSize = sizeMap[size] || 48;
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center",
        fullScreen && "fixed inset-0 bg-background/80 backdrop-blur-sm z-50",
        className
      )}
    >
      <svg
        className="apple-spinner"
        width={spinnerSize}
        height={spinnerSize}
        viewBox="0 0 50 50"
        style={{ display: 'block' }}
      >
        <g>
          {[...Array(12)].map((_, i) => (
            <rect
              key={i}
              x="22"
              y="6"
              rx="3"
              ry="3"
              width="6"
              height="12"
              fill="#222"
              opacity={0.2 + 0.8 * (i / 12)}
              transform={`rotate(${i * 30} 25 25)`}
            />
          ))}
        </g>
      </svg>
      <style jsx>{`
        .apple-spinner {
          animation: spinner-rotate 1s linear infinite;
        }
        @keyframes spinner-rotate {
          100% { transform: rotate(360deg); }
        }
      `}</style>
      {text && (
        <p className="mt-2 text-sm text-muted-foreground">{text}</p>
      )}
    </div>
  );
} 