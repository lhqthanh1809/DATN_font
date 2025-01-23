import { IIcon } from "@/components/icon";

const Chat: React.FC<IIcon> = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="25"
      height="24"
      viewBox="0 0 25 24"
      fill="none"
      className={className}
    >
      <path
        d="M18.5 3H6.5C4.84315 3 3.5 4.34315 3.5 6V15.7574C3.5 16.553 3.81607 17.3161 4.37868 17.8787L7.21967 20.7197C7.69214 21.1921 8.5 20.8575 8.5 20.1893V19C8.5 17.8954 9.39543 17 10.5 17H18.5C20.1569 17 21.5 15.6569 21.5 14V6C21.5 4.34315 20.1569 3 18.5 3Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
};

export { Chat };
