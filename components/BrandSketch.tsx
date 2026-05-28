import { motion } from 'motion/react';

export function BrandSketch() {
  return (
    <svg width="500" height="500" viewBox="0 0 500 500" className="w-full h-full max-w-md mx-auto">
      {/* Central Rocket/Growth */}
      <g transform="translate(250, 300)">
        {/* Rocket Body */}
        <motion.path
          d="M -25 0 L -18 -100 Q -18 -125 0 -135 Q 18 -125 18 -100 L 25 0 Z"
          fill="none"
          stroke="#0000ff"
          strokeWidth="2.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        />
        
        {/* Rocket Window */}
        <motion.circle
          cx="0"
          cy="-85"
          r="12"
          fill="none"
          stroke="#000000"
          strokeWidth="2"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1.2, type: "spring" }}
        />
        
        {/* Rocket Fins */}
        <motion.path
          d="M -25 -15 L -42 8 L -25 0 Z"
          fill="none"
          stroke="#000000"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, delay: 1.4 }}
        />
        <motion.path
          d="M 25 -15 L 42 8 L 25 0 Z"
          fill="none"
          stroke="#000000"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, delay: 1.5 }}
        />
        
        {/* Rocket Fire */}
        <motion.path
          d="M -16 0 Q -12 12 -8 24 Q 0 28 8 24 Q 12 12 16 0"
          fill="none"
          stroke="#0000ff"
          strokeWidth="2.5"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ 
            pathLength: 1,
            opacity: [0, 1, 0.6, 1]
          }}
          transition={{ 
            pathLength: { duration: 0.8, delay: 1.6 },
            opacity: { duration: 0.6, repeat: Infinity }
          }}
        />
        
        {/* Smoke particles */}
        {[0, 1, 2].map((i) => (
          <motion.circle
            key={`smoke-${i}`}
            cx={-8 + Math.random() * 16}
            cy={22}
            r={2.5 + Math.random() * 2}
            fill="none"
            stroke="#000000"
            strokeWidth="1.5"
            initial={{ y: 0, opacity: 0, scale: 0 }}
            animate={{ 
              y: [0, 40, 80],
              opacity: [0, 0.6, 0],
              scale: [0, 1, 1.5]
            }}
            transition={{ 
              duration: 2.5,
              delay: 2 + i * 0.3,
              repeat: Infinity
            }}
          />
        ))}
      </g>
      
      {/* Analytics Graph */}
      <motion.g transform="translate(80, 160)">
        {/* Graph bars */}
        {[28, 42, 35, 58, 50, 70, 62].map((height, i) => (
          <motion.rect
            key={`bar-${i}`}
            x={i * 20}
            y={80 - height}
            width="14"
            height={height}
            fill="none"
            stroke="#0000ff"
            strokeWidth="2"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ 
              delay: 0.5 + i * 0.1,
              type: "spring",
              stiffness: 100
            }}
            style={{ transformOrigin: `${i * 20 + 7}px 80px` }}
          />
        ))}
        
        {/* Graph trend line */}
        <motion.path
          d="M 7 52 L 27 38 L 47 45 L 67 22 L 87 30 L 107 10 L 127 18"
          fill="none"
          stroke="#000000"
          strokeWidth="2"
          strokeDasharray="2,2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, delay: 1.5 }}
        />
      </motion.g>
      
      {/* Target/Goal */}
      <motion.g transform="translate(400, 160)">
        <motion.circle
          cx="0"
          cy="0"
          r="32"
          fill="none"
          stroke="#0000ff"
          strokeWidth="2.5"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 2, type: "spring" }}
        />
        <motion.circle
          cx="0"
          cy="0"
          r="20"
          fill="none"
          stroke="#000000"
          strokeWidth="1.8"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 2.2, type: "spring" }}
        />
        <motion.circle
          cx="0"
          cy="0"
          r="8"
          fill="#0000ff"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 2.4, type: "spring" }}
        />
      </motion.g>
      
      {/* Megaphone */}
      <motion.g transform="translate(80, 380)">
        <motion.path
          d="M 8 0 L 42 -12 L 42 12 L 8 0 Z"
          fill="none"
          stroke="#0000ff"
          strokeWidth="2.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, delay: 2.5 }}
        />
        <motion.circle
          cx="4"
          cy="0"
          r="6"
          fill="none"
          stroke="#000000"
          strokeWidth="2"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 2.7, type: "spring" }}
        />
        
        {/* Sound waves */}
        {[0, 1, 2].map((i) => (
          <motion.path
            key={`wave-${i}`}
            d={`M ${50 + i * 12} -${8 + i * 4} Q ${58 + i * 12} 0 ${50 + i * 12} ${8 + i * 4}`}
            fill="none"
            stroke="#0000ff"
            strokeWidth="2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: [0, 1],
              opacity: [0, 1, 0]
            }}
            transition={{ 
              duration: 1.5,
              delay: 3 + i * 0.2,
              repeat: Infinity
            }}
          />
        ))}
      </motion.g>
      
      {/* People/Team Icons */}
      {[0, 1, 2].map((i) => (
        <motion.g
          key={`person-${i}`}
          transform={`translate(${330 + i * 32}, 400)`}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 3.2 + i * 0.2, type: "spring" }}
        >
          <circle
            cx="0"
            cy="-12"
            r="6"
            fill="none"
            stroke="#000000"
            strokeWidth="2"
          />
          <path
            d="M 0 -6 L 0 8"
            stroke="#0000ff"
            strokeWidth="2"
          />
        </motion.g>
      ))}
      
      {/* Connecting Lines */}
      <motion.path
        d="M 346 388 L 378 388"
        stroke="#000000"
        strokeWidth="1.5"
        strokeDasharray="2,2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 4, duration: 0.5 }}
      />
      
      {/* Upward Arrows */}
      {[0, 1, 2].map((i) => (
        <motion.g
          key={`arrow-${i}`}
          transform={`translate(${160 + i * 80}, ${130 - i * 15})`}
          initial={{ y: 40, opacity: 0 }}
          animate={{ 
            y: [40, 0, -15],
            opacity: [0, 1, 0]
          }}
          transition={{ 
            duration: 2,
            delay: 3.5 + i * 0.4,
            repeat: Infinity
          }}
        >
          <path
            d="M 0 16 L 0 0 M -6 6 L 0 0 L 6 6"
            stroke="#0000ff"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.g>
      ))}
      
      {/* Stats Number */}
      <motion.text
        x="400"
        y="380"
        fontSize="24"
        fontWeight="bold"
        fill="#0000ff"
        textAnchor="middle"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 4.2, type: "spring" }}
      >
        +245%
      </motion.text>
      
      {/* Connection lines between elements */}
      <motion.path
        d="M 250 165 Q 320 140 370 160"
        fill="none"
        stroke="#000000"
        strokeWidth="1"
        strokeDasharray="3,3"
        opacity="0.4"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 3.8, duration: 1 }}
      />
    </svg>
  );
}
