export default function BackgroundPattern() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-herokuMain via-salesforceMain to-herokuMain">
      {/* Primary Layer - Large Flowing Shapes */}
      <div className="absolute inset-0">
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 1200 800"
          preserveAspectRatio="xMidYMid slice"
        >
          {/* Large primary blob shapes */}
          <path
            d="M0,200 Q300,100 600,200 Q900,300 1200,150 L1200,0 L0,0 Z"
            fill="rgba(255,255,255,0.12)"
          />

          <path
            d="M0,800 Q300,600 600,700 Q900,800 1200,650 L1200,800 L0,800 Z"
            fill="rgba(255,255,255,0.1)"
          />

          <path
            d="M0,600 Q200,500 400,550 Q600,600 800,520 Q1000,440 1200,500 L1200,800 L0,800 Z"
            fill="rgba(255,255,255,0.08)"
          />
        </svg>
      </div>

      {/* Secondary Layer - Major Full-Width Wavy Lines */}
      <div className="absolute inset-0">
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 1200 800"
          preserveAspectRatio="xMidYMid slice"
        >
          {/* Large flowing wavy lines - full width */}
          <path
            d="M0,250 Q300,180 600,220 Q900,260 1200,200"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="3"
            fill="none"
          />

          <path
            d="M0,400 Q300,330 600,380 Q900,430 1200,360"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="2.5"
            fill="none"
          />

          <path
            d="M0,100 Q300,150 600,80 Q900,10 1200,90"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="2"
            fill="none"
          />

          <path
            d="M0,550 Q300,480 600,520 Q900,560 1200,490"
            stroke="rgba(255,255,255,0.13)"
            strokeWidth="2.5"
            fill="none"
          />

          <path
            d="M0,700 Q300,650 600,690 Q900,730 1200,680"
            stroke="rgba(255,255,255,0.11)"
            strokeWidth="2"
            fill="none"
          />

          {/* Curved diagonal flows - full width */}
          <path
            d="M0,150 Q300,250 600,150 Q900,50 1200,200"
            stroke="rgba(255,255,255,0.09)"
            strokeWidth="1.5"
            fill="none"
          />

          <path
            d="M0,50 Q300,200 600,100 Q900,300 1200,150"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="1.5"
            fill="none"
          />

          <path
            d="M0,450 Q300,350 600,450 Q900,550 1200,400"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="1.8"
            fill="none"
          />
        </svg>
      </div>

      {/* Tertiary Layer - Medium Full-Width Wavy Lines */}
      <div className="absolute inset-0">
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 1200 800"
          preserveAspectRatio="xMidYMid slice"
        >
          {/* Medium flowing curves - full width */}
          <path
            d="M0,200 Q200,150 400,190 Q600,230 800,170 Q1000,110 1200,160"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="1.8"
            fill="none"
          />

          <path
            d="M0,320 Q200,280 400,310 Q600,340 800,300 Q1000,260 1200,290"
            stroke="rgba(255,255,255,0.09)"
            strokeWidth="1.5"
            fill="none"
          />

          <path
            d="M0,450 Q200,400 400,440 Q600,480 800,420 Q1000,360 1200,400"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="1.3"
            fill="none"
          />

          <path
            d="M0,600 Q200,550 400,590 Q600,630 800,570 Q1000,510 1200,550"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="1.6"
            fill="none"
          />

          <path
            d="M0,80 Q200,120 400,60 Q600,0 800,80 Q1000,160 1200,120"
            stroke="rgba(255,255,255,0.07)"
            strokeWidth="1.2"
            fill="none"
          />

          <path
            d="M0,500 Q200,460 400,500 Q600,540 800,480 Q1000,420 1200,460"
            stroke="rgba(255,255,255,0.09)"
            strokeWidth="1.4"
            fill="none"
          />

          <path
            d="M0,350 Q200,310 400,350 Q600,390 800,330 Q1000,270 1200,320"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="1.1"
            fill="none"
          />

          <path
            d="M0,650 Q200,610 400,650 Q600,690 800,630 Q1000,570 1200,620"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="1.3"
            fill="none"
          />

          {/* Vertical flowing lines - full height */}
          <path
            d="M200,0 Q250,150 180,300 Q110,450 160,600 Q210,750 180,800"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="1"
            fill="none"
          />

          <path
            d="M400,0 Q450,180 380,360 Q310,540 360,720 Q410,800 380,800"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="0.8"
            fill="none"
          />

          <path
            d="M600,0 Q650,160 580,320 Q510,480 560,640 Q610,800 580,800"
            stroke="rgba(255,255,255,0.07)"
            strokeWidth="1.2"
            fill="none"
          />

          <path
            d="M800,0 Q850,180 780,360 Q710,540 760,720 Q810,800 780,800"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="0.9"
            fill="none"
          />

          <path
            d="M1000,0 Q1050,160 980,320 Q910,480 960,640 Q1010,800 980,800"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="1.1"
            fill="none"
          />
        </svg>
      </div>

      {/* Detail Layer - Fine Full-Width Wavy Lines */}
      <div className="absolute inset-0">
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 1200 800"
          preserveAspectRatio="xMidYMid slice"
        >
          {/* Fine detail wavy lines - full width */}
          <path
            d="M0,180 Q150,160 300,180 Q450,200 600,160 Q750,120 900,160 Q1050,200 1200,160"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="1"
            fill="none"
          />

          <path
            d="M0,250 Q150,230 300,250 Q450,270 600,230 Q750,190 900,230 Q1050,270 1200,230"
            stroke="rgba(255,255,255,0.07)"
            strokeWidth="0.8"
            fill="none"
          />

          <path
            d="M0,350 Q150,330 300,350 Q450,370 600,330 Q750,290 900,330 Q1050,370 1200,330"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="0.9"
            fill="none"
          />

          <path
            d="M0,380 Q150,360 300,380 Q450,400 600,360 Q750,320 900,360 Q1050,400 1200,360"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="1.1"
            fill="none"
          />

          <path
            d="M0,480 Q150,460 300,480 Q450,500 600,460 Q750,420 900,460 Q1050,500 1200,460"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="0.7"
            fill="none"
          />

          <path
            d="M0,520 Q150,500 300,520 Q450,540 600,500 Q750,460 900,500 Q1050,540 1200,500"
            stroke="rgba(255,255,255,0.07)"
            strokeWidth="0.8"
            fill="none"
          />

          <path
            d="M0,650 Q150,630 300,650 Q450,670 600,630 Q750,590 900,630 Q1050,670 1200,630"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="0.6"
            fill="none"
          />

          <path
            d="M0,680 Q150,660 300,680 Q450,700 600,660 Q750,620 900,660 Q1050,700 1200,660"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="0.7"
            fill="none"
          />

          <path
            d="M0,120 Q150,100 300,120 Q450,140 600,100 Q750,60 900,100 Q1050,140 1200,100"
            stroke="rgba(255,255,255,0.09)"
            strokeWidth="1.2"
            fill="none"
          />

          <path
            d="M0,280 Q150,260 300,280 Q450,300 600,260 Q750,220 900,260 Q1050,300 1200,260"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="1"
            fill="none"
          />

          <path
            d="M0,420 Q150,400 300,420 Q450,440 600,400 Q750,360 900,400 Q1050,440 1200,400"
            stroke="rgba(255,255,255,0.07)"
            strokeWidth="0.9"
            fill="none"
          />

          <path
            d="M0,540 Q150,520 300,540 Q450,560 600,520 Q750,480 900,520 Q1050,560 1200,520"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="1.1"
            fill="none"
          />
        </svg>
      </div>
    </div>
  );
} 