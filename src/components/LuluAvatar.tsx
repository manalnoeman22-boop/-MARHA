import React from 'react';

interface LuluAvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  mood?: 'happy' | 'excited' | 'thinking' | 'celebrating' | 'waving';
  className?: string;
  animate?: boolean;
}

export const LuluAvatar: React.FC<LuluAvatarProps> = ({
  size = 'md',
  mood = 'happy',
  className = '',
  animate = true,
}) => {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-20 h-20',
    lg: 'w-32 h-32',
    xl: 'w-44 h-44',
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${sizeClasses[size]} ${
        animate ? 'animate-float' : ''
      } ${className}`}
    >
      <svg
        viewBox="0 0 160 160"
        className="w-full h-full drop-shadow-md"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Glow halo */}
        <circle cx="80" cy="80" r="74" fill="#FEF3C7" fillOpacity="0.7" />

        {/* Back Hair Tufts */}
        <path
          d="M32 90C22 75 24 45 42 32C60 19 100 19 118 32C136 45 138 75 128 90C136 105 130 125 116 130C102 135 95 115 80 115C65 115 58 135 44 130C30 125 24 105 32 90Z"
          fill="#5B3A29"
        />

        {/* Cute Ponytails / Pigtails */}
        <circle cx="30" cy="55" r="16" fill="#5B3A29" />
        <circle cx="130" cy="55" r="16" fill="#5B3A29" />
        {/* Colorful Pigtail Ribbons */}
        <ellipse cx="33" cy="62" rx="7" ry="5" fill="#F43F5E" />
        <ellipse cx="127" cy="62" rx="7" ry="5" fill="#F43F5E" />

        {/* Face */}
        <ellipse cx="80" cy="84" rx="42" ry="40" fill="#FDDEC7" />

        {/* Cute rosy cheeks */}
        <ellipse cx="56" cy="94" rx="8" ry="5" fill="#FCA5A5" fillOpacity="0.75" />
        <ellipse cx="104" cy="94" rx="8" ry="5" fill="#FCA5A5" fillOpacity="0.75" />

        {/* Front Hair Bangs */}
        <path
          d="M42 62C52 68 62 66 72 58C82 68 98 68 118 62C116 48 102 38 80 38C58 38 44 48 42 62Z"
          fill="#4A2E1F"
        />

        {/* Hairclip (Star 🌟) */}
        <g transform="translate(100, 42) rotate(15) scale(0.65)">
          <polygon
            points="25,2 32,18 49,18 35,29 40,46 25,35 10,46 15,29 1,18 18,18"
            fill="#FBBF24"
            stroke="#F59E0B"
            strokeWidth="2"
          />
        </g>

        {/* Eyes based on mood */}
        {mood === 'celebrating' || mood === 'excited' ? (
          // Joyful squinting closed eyes ^ ^
          <>
            <path
              d="M56 82C59 75 67 75 70 82"
              stroke="#2D1B10"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path
              d="M90 82C93 75 101 75 104 82"
              stroke="#2D1B10"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </>
        ) : mood === 'thinking' ? (
          // Curious eyes looking up
          <>
            <circle cx="63" cy="79" r="6" fill="#2D1B10" />
            <circle cx="97" cy="79" r="6" fill="#2D1B10" />
            <circle cx="64" cy="77" r="2.5" fill="#FFFFFF" />
            <circle cx="98" cy="77" r="2.5" fill="#FFFFFF" />
          </>
        ) : (
          // Big sparkly cartoon eyes
          <>
            <circle cx="63" cy="82" r="6.5" fill="#2D1B10" />
            <circle cx="97" cy="82" r="6.5" fill="#2D1B10" />
            <circle cx="65" cy="80" r="2.5" fill="#FFFFFF" />
            <circle cx="99" cy="80" r="2.5" fill="#FFFFFF" />
            <circle cx="61" cy="84" r="1.2" fill="#FFFFFF" />
            <circle cx="95" cy="84" r="1.2" fill="#FFFFFF" />
          </>
        )}

        {/* Smile */}
        {mood === 'excited' || mood === 'celebrating' ? (
          <path
            d="M68 96C70 106 90 106 92 96"
            stroke="#991B1B"
            strokeWidth="3.5"
            fill="#F43F5E"
            strokeLinecap="round"
          />
        ) : mood === 'thinking' ? (
          <circle cx="82" cy="97" r="3.5" fill="#991B1B" />
        ) : (
          <path
            d="M70 96C74 103 86 103 90 96"
            stroke="#991B1B"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />
        )}

        {/* Little waving hand on bottom right if waving */}
        {mood === 'waving' && (
          <g transform="translate(122, 100) rotate(15)">
            <ellipse cx="10" cy="10" rx="8" ry="7" fill="#FDDEC7" />
            <circle cx="6" cy="4" r="3" fill="#FDDEC7" />
            <circle cx="10" cy="2" r="3" fill="#FDDEC7" />
            <circle cx="14" cy="4" r="3" fill="#FDDEC7" />
          </g>
        )}
      </svg>
    </div>
  );
};
