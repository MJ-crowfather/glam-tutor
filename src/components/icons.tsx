export const Logo = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
        <path d="M12 2a10 10 0 0 0-9.44 12.78" />
        <path d="M12 22a10 10 0 0 0 9.44-12.78" />
        <path d="m2.56 14.78.83-2.81a2 2 0 0 1 1.94-1.45h13.34a2 2 0 0 1 1.94 1.45l.83 2.81" />
        <path d="M12 10.5V22" />
        <path d="M12 2v8.5" />
    </svg>
  );
  