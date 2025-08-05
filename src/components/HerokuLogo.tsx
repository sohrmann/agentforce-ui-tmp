import Image from "next/image";

interface HerokuLogoProps {
  size?: "small" | "medium" | "large" | "header";
  width?: number;
  height?: number;
  className?: string;
  alt?: string;
  variant?: "light" | "dark" | "mark";
}

const sizeConfig = {
  small: { width: 40, height: 40, className: "w-10 h-10" },
  medium: { width: 48, height: 48, className: "w-12 h-12" },
  large: { width: 64, height: 64, className: "w-16 h-16" },
  header: { width: 80, height: 24, className: "h-6" },
};

const getLogoSrc = (variant: "light" | "dark" | "mark", size: string) => {
  // Always use the mark version (just the icon) unless explicitly requesting full logo
  if (variant === "mark" || variant === "light") {
    return "/images/Heroku-Logo-Mark-Light-RGB.svg";
  }
  
  return variant === "dark" 
    ? "/images/Heroku-Logo-Dark-RGB.svg"
    : "/images/Heroku-Logo-Light-RGB.svg";
};

export default function HerokuLogo({
  size,
  width,
  height,
  className = "",
  alt = "Heroku",
  variant = "light",
}: HerokuLogoProps) {
  const config = size ? sizeConfig[size] : { width: 40, height: 40, className: "" };
  const finalWidth = width ?? config.width;
  const finalHeight = height ?? config.height;
  // Only use size className if custom width/height aren't provided and size is specified
  const sizeClassName = (width || height || !size) ? "" : config.className;
  const finalClassName = `${sizeClassName} object-contain ${className}`.trim();
  
  const logoSrc = getLogoSrc(variant, size || "small");

  return (
    <Image
      src={logoSrc}
      alt={alt}
      width={finalWidth}
      height={finalHeight}
      className={finalClassName}
    />
  );
} 