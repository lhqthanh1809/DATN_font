import React from "react";
import { IIcon } from "../../icon";

const Link: React.FC<IIcon> = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className={className}
    >
      <path
        d="M6 10L10 6.00004M9.54475 11.4847L8.48409 12.5454V12.5454C7.31252 13.717 5.41302 13.717 4.24145 12.5454L3.63604 11.94C2.46447 10.7684 2.46447 8.86891 3.63604 7.69734V7.69734L4.6967 6.63668M11.6661 9.36341L12.7267 8.30275V8.30275C13.8983 7.13117 13.8983 5.23168 12.7267 4.06011L12.1213 3.45469C10.9497 2.28312 9.05025 2.28312 7.87868 3.45469V3.45469L6.81802 4.51535"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const LinkShape: React.FC<IIcon> = ({ className }) => {
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
        d="M7.5 7H7C4.23858 7 2 9.23858 2 12C2 14.7614 4.23858 17 7 17H9C11.7614 17 14 14.7614 14 12M16.5 17H17C19.7614 17 22 14.7614 22 12C22 9.23858 19.7614 7 17 7H15C12.2386 7 10 9.23858 10 12" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
};

export {LinkShape}
export default Link;
