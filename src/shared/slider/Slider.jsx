import React, { useState, useMemo } from "react";

/**
 * PremiumSliderWithTooltip
 * A high-end slider component for the Anansi project.
 * Features:
 * - Transparent background
 * - Dynamic tooltip following the thumb
 * - Active track fill using CSS gradients
 * - Fully responsive and accessible
 */
const PremiumSliderWithTooltip = ({
  min = 0,
  max = 100,
  step = 1,
  initialValue = 50,
  onChange,
}) => {
  const [value, setValue] = useState(initialValue);
  const [isHovered, setIsHovered] = useState(false);

  // Calculate the percentage position for the tooltip and track fill
  const percentage = useMemo(() => {
    return ((value - min) / (max - min)) * 100;
  }, [value, min, max]);

  const handleUpdate = (e) => {
    const newValue = Number(e.target.value);
    setValue(newValue);
    if (onChange) onChange(newValue);
  };

  return (
    <div className="w-full">
      <div className="relative w-full group">
        {}
        <div
          className={`absolute bottom-full transition-all duration-200 pointer-events-none flex flex-col items-center ${
            isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          }`}
          style={{
            left: `${percentage}%`,
            transform: "translateX(-50%)",
          }}
        >
          {/* Tooltip Bubble */}
          <div className="bg-[#074073] text-white text-[11px] font-medium py-2 px-3 rounded-lg shadow-xl whitespace-nowrap uppercase tracking-widest">
            {value.toLocaleString()}
          </div>
          {/* Tooltip Arrow */}
          <div className="w-2 h-2 bg-[#074073] rotate-45 -mt-1 shadow-sm"></div>
        </div>
        {}
        {/* The Native Slider Input */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleUpdate}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onFocus={() => setIsHovered(true)}
          onBlur={() => setIsHovered(false)}
          className="w-full h-1.5 bg-slate-200 rounded-full appearance-none cursor-grab active:cursor-grabbing
            accent-[#074073]
            
            /* Fill Track Color (Standard Webkit) */
            bg-gradient-to-r from-[#074073] to-[#074073] bg-no-repeat
            
            /* Thumb Styling - Webkit (Chrome, Safari, Edge) */
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:h-5
            [&::-webkit-slider-thumb]:w-5
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-white
            [&::-webkit-slider-thumb]:border-2
            [&::-webkit-slider-thumb]:border-[#074073]
            [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(0,0,0,0.1)]
            [&::-webkit-slider-thumb]:transition-all
            [&::-webkit-slider-thumb]:duration-150
            [&::-webkit-slider-thumb]:hover:scale-125
            [&::-webkit-slider-thumb]:active:scale-95
            
            /* Thumb Styling - Firefox */
            [&::-moz-range-thumb]:h-5
            [&::-moz-range-thumb]:w-5
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:bg-white
            [&::-moz-range-thumb]:border-2
            [&::-moz-range-thumb]:border-[#074073]
            [&::-moz-range-thumb]:shadow-md
            [&::-moz-range-thumb]:hover:scale-110
          "
          style={{
            backgroundSize: `${percentage}% 100%`,
          }}
        />
        {}
        {/* Min/Max Labels */}
        <div className="flex justify-between mt-1">
          <span className="text-[10px] font-medium text-slate-400 tracking-widest uppercase">
            {min}
          </span>
          <span className="text-[10px] font-medium text-slate-400 tracking-widest uppercase">
            {max}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PremiumSliderWithTooltip;
