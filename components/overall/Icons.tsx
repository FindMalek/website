import { SVGAttributes } from "react";

export function CloseIcon(props: SVGAttributes<SVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        d="m17.25 6.75-10.5 10.5M6.75 6.75l10.5 10.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ChevronDownIcon(props: SVGAttributes<SVGElement>) {
  return (
    <svg viewBox="0 0 8 6" aria-hidden="true" {...props}>
      <path
        d="M1.75 1.75 4 4.25l2.25-2.5"
        fill="none"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SunIcon(props: SVGAttributes<SVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}>
      <path d="M8 12.25A4.25 4.25 0 0 1 12.25 8v0a4.25 4.25 0 0 1 4.25 4.25v0a4.25 4.25 0 0 1-4.25 4.25v0A4.25 4.25 0 0 1 8 12.25v0Z" />
      <path
        d="M12.25 3v1.5M21.5 12.25H20M18.791 18.791l-1.06-1.06M18.791 5.709l-1.06 1.06M12.25 20v1.5M4.5 12.25H3M6.77 6.77 5.709 5.709M6.77 17.73l-1.061 1.061"
        fill="none"
      />
    </svg>
  );
}

export function MoonIcon(props: SVGAttributes<SVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        d="M17.25 16.22a6.937 6.937 0 0 1-9.47-9.47 7.451 7.451 0 1 0 9.47 9.47ZM12.75 7C17 7 17 2.75 17 2.75S17 7 21.25 7C17 7 17 11.25 17 11.25S17 7 12.75 7Z"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function AnchorIcon(props: SVGAttributes<SVGElement>) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      strokeLinecap="round"
      aria-hidden="true"
      {...props}>
      <path d="m6.5 11.5-.964-.964a3.535 3.535 0 1 1 5-5l.964.964m2 2 .964.964a3.536 3.536 0 0 1-5 5L8.5 13.5m0-5 3 3" />
    </svg>
  );
}

export function VitalBurstIcon(props: SVGAttributes<SVGElement>) {
  return (
    <svg {...props} strokeWidth="0" viewBox="0 0 10.67 9.52">
      <g id="White">
        <path d="m0,0C.73,0,1.5,0,2.27.01c.07,0,.16.08.2.15.72,1.27,1.43,2.53,2.15,3.8.6,1.07,1.21,2.15,1.82,3.22.08.15.1.26,0,.41-.36.62-.71,1.26-1.09,1.92C3.56,6.33,1.78,3.17,0,0Z" />
        <path d="m3.56,0C4.3,0,5.07,0,5.85,0c.06,0,.14.06.18.12.75,1.33,1.5,2.66,2.25,3.99.03.05.04.13.02.17-.37.68-.75,1.35-1.15,2.06C5.94,4.21,4.75,2.11,3.56,0Z" />
        <path d="m9.59.51c-.33-.1-.64-.03-.9.15-.21.15-.4.33-.58.5-.15.14-.26.13-.35-.06-.23-.47.11-1.09.62-1.1.76-.02,1.52,0,2.28,0,0,.03,0,.05,0,.06-.35.63-.7,1.27-1.06,1.89-.33.55-1.08.54-1.38-.03-.05-.09-.06-.23-.03-.32.18-.56.59-.88,1.14-1.04.09-.02.18-.04.26-.07Z" />
      </g>
    </svg>
  );
}
