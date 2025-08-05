interface FeatureProps {
  icon: string;
  title: string;
  description: string;
  gradientFrom: string;
  gradientTo: string;
}

export default function Feature({ 
  icon, 
  title, 
  description, 
  gradientFrom, 
  gradientTo 
}: FeatureProps) {
  return (
    <div className="flex group text-center p-3 md:p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-300">
      <div className={`w-8 md:w-12 h-8 md:h-12 bg-gradient-to-br ${gradientFrom} ${gradientTo} rounded-md md:rounded-lg flex items-center justify-center mr-3 md:mr-4 shadow-md flex-shrink-0`}>
        <span className="text-white text-sm md:text-lg">
          {icon}
        </span>
      </div>
      <div className="flex flex-col text-left">
        <h3 className="text-sm md:text-base font-semibold text-white mb-1 md:mb-2">
          {title}
        </h3>
        <p className="text-white/60 md:text-white/70 text-xs md:text-sm leading-tight md:leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
} 