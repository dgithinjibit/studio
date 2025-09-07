import type { SVGProps } from "react";

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      {...props}
    >
      <path
        fill="currentColor"
        d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM184,96a8,8,0,0,1-8,8H80a8,8,0,0,1,0-16h96A8,8,0,0,1,184,96ZM80,152a8,8,0,0,1,0-16h48a8,8,0,0,1,0,16Z"
      />
    </svg>
  );
}

export function EnglishIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <defs>
        <linearGradient id="english-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: 'hsl(var(--primary))', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: 'hsl(var(--accent))', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="url(#english-grad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 2V22" stroke="url(#english-grad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2 12H22" stroke="url(#english-grad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M5 19C8.89143 15.1086 8.89143 8.89143 5 5" stroke="url(#english-grad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M19 19C15.1086 15.1086 15.1086 8.89143 19 5" stroke="url(#english-grad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function CreativeArtsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
       <defs>
        <linearGradient id="arts-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: 'hsl(var(--primary))', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: 'hsl(var(--accent))', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <path d="M7 14.2215C7 14.2215 8.44444 14.4253 10.5 13.5C12.5556 12.5747 12.5 10.5 12.5 10.5C12.5 10.5 12.5556 8.42527 10.5 7.5C8.44444 6.57473 7 6.77848 7 6.77848" stroke="url(#arts-grad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16 8.00012L18 7.00012" stroke="url(#arts-grad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M17 11.5001L19 11.0001" stroke="url(#arts-grad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16 15.0001L18 16.0001" stroke="url(#arts-grad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12.9844 18C12.9844 18 11.4375 18.5 9.49219 18C7.54687 17.5 6 16 6 16L3 14" stroke="url(#arts-grad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M4 21H18C18 21 21 21 21 16C21 11 18 3 18 3H4C4 3 2 11 2 16C2 21 4 21 4 21Z" stroke="url(#arts-grad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}


export function EduCloudLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M17 17C18.6569 17 20 15.6569 20 14C20 12.3431 18.6569 11 17 11C16.3263 11 15.7056 11.2148 15.2 11.5841C15.1189 8.5262 12.6333 6.10323 9.56787 6.0022C6.31198 5.89531 3.58553 8.24823 3.11182 11.458C1.81591 11.8315 1 12.9824 1 14.2857C1 15.7844 2.21561 17 3.71429 17H17Z"
        stroke="hsl(var(--primary))"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 17V22"
        stroke="hsl(var(--primary))"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 22H14"
        stroke="hsl(var(--primary))"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17 11V7"
        stroke="hsl(var(--primary))"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19 7H15"
        stroke="hsl(var(--primary))"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SyncSentaLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M17 17C18.6569 17 20 15.6569 20 14C20 12.3431 18.6569 11 17 11C16.3263 11 15.7056 11.2148 15.2 11.5841C15.1189 8.5262 12.6333 6.10323 9.56787 6.0022C6.31198 5.89531 3.58553 8.24823 3.11182 11.458C1.81591 11.8315 1 12.9824 1 14.2857C1 15.7844 2.21561 17 3.71429 17H17Z"
        stroke="hsl(var(--primary))"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 17V22"
        stroke="hsl(var(--primary))"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 22H14"
        stroke="hsl(var(--primary))"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17 11V7"
        stroke="hsl(var(--primary))"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19 7H15"
        stroke="hsl(var(--primary))"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
