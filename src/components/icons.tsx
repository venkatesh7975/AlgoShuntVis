import type { SVGProps } from "react";

export function AlgoShuntIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 8V4H8" />
      <rect width="4" height="4" x="4" y="8" rx="1" />
      <path d="M8 10v10" />
      <path d="M12 14v6" />
      <path d="M16 12v8" />
      <path d="M20 10v10" />
    </svg>
  );
}
