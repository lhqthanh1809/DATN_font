import React from "react";
import { IIcon } from "../../Icon";

const CreditCard: React.FC<IIcon> = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        d="M3 8.5V7C3 5.89543 3.89543 5 5 5H19C20.1046 5 21 5.89543 21 7V8.5M3 8.5H21M3 8.5V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V8.5M6 16H10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
};

const CreditCardCrossed: React.FC<IIcon> = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        d="M3 8.5V7C3 5.89543 3.89543 5 5 5H19C20.1046 5 21 5.89543 21 7V8.5M3 8.5H21M3 8.5V17C3 18.1046 3.89543 19 5 19H12M21 8.5V12M6 16H10M16 16L19 19M19 19L22 22M19 19L22 16M19 19L16 22"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const CreditCardCheck: React.FC<IIcon> = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        d="M3 8.5V7C3 5.89543 3.89543 5 5 5H19C20.1046 5 21 5.89543 21 7V8.5M3 8.5H21M3 8.5V17C3 18.1046 3.89543 19 5 19H12M21 8.5V12M6 16H10M15 19L17.2929 21.2929C17.6834 21.6834 18.3166 21.6834 18.7071 21.2929L23 17"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
};

export { CreditCard, CreditCardCrossed, CreditCardCheck };
