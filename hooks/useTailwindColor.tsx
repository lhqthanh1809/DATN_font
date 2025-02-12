import { theme } from "../tailwind.config.js";
import defaultColors from "tailwindcss/colors";

type ColorShades = { [key: string]: string };
type TailwindColors = { [key: string]: ColorShades | string };

const useTailwindColor = () => {
  const getColor = (className: string) => {
    const match = className.match(/-(\w+)-(\d+)/);
    if (match) {
      const colorName = match[1];
      const shade = match[2];

      const extendedColors = theme?.extend?.colors || {};
      const allColors: TailwindColors = { ...defaultColors, ...extendedColors };

      const color = allColors[colorName] as ColorShades | undefined;

      if (color && (color as ColorShades)[shade]) {
        return (color as ColorShades)[shade];
      }
    }
    return "#000000";
  };

  return { getColor };
};

export default useTailwindColor;
