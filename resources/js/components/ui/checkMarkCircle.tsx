interface CheckIconProps {
    color?: string;
  }
  
  export function CheckIcon({ color = "#3C8C7C" }: CheckIconProps) {
    return (
      <svg 
        width="24" 
        height="20" 
        viewBox="0 0 24 20" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        <ellipse cx="12" cy="10" rx="9" ry="10" fill={color} />
        <text 
          x="50%" 
          y="50%" 
          dominantBaseline="middle" 
          textAnchor="middle" 
          fill="white" 
          fontSize="14"
          fontFamily="system-ui"
          dy="1"
        >
          ✓
        </text>
      </svg>
    )
  }