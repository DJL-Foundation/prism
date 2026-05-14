// Renders logo.svg with "w-5 h-5" per default

import type React from "react";
import LogoSvg from "~pub/logo.svg";

export const Logo: React.FC<React.ImgHTMLAttributes<HTMLImageElement>> = (
  props,
) => {
  return (
    <img
      src={LogoSvg}
      alt="Prism Logo"
      className="w-5 h-5 dark:invert"
      {...props}
    />
  );
};
