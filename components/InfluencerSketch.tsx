import { motion } from 'motion/react';

export function InfluencerSketch() {
  return (
    <svg width="500" height="500" viewBox="0 0 500 500" className="w-full h-full max-w-md mx-auto">
      {/* Central Figure - Content Creator */}
      <g transform="translate(250, 220)">
        {/* Head */}
        <motion.circle
          cx="0"
          cy="-60"
          r="35"
          fill="none"
          stroke="#000000"
          strokeWidth="2.5"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        />
        
        {/* Eyes */}
        <motion.circle cx="-10" cy="-65" r="2.5" fill="#000000"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1.2 }}
        />
        <motion.circle cx="10" cy="-65" r="2.5" fill="#000000"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1.3 }}
        />
        
        {/* Smile */}
        <motion.path
          d="M -12 -50 Q 0 -45 12 -50"
          fill="none"
          stroke="#000000"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, delay: 1.4 }}
        />
        
        {/* Body */}
        <motion.path
          d="M 0 -25 L 0 35"
          stroke="#0000ff"
          strokeWidth="3"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        />
        
        {/* Arms holding phone */}
        <motion.path
          d="M 0 -10 Q -35 0 -35 25"
          stroke="#0000ff"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        />
        <motion.path
          d="M 0 -10 Q 35 0 35 25"
          stroke="#0000ff"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        />
        
        {/* Legs */}
        <motion.path
          d="M 0 35 L -15 70"
          stroke="#000000"
          strokeWidth="2.5"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.6, delay: 0.9 }}
        />
        <motion.path
          d="M 0 35 L 15 70"
          stroke="#000000"
          strokeWidth="2.5"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
        />
        
        {/* Phone/Camera in hands */}
        <motion.rect
          x="-12"
          y="-5"
          width="24"
          height="38"
          rx="4"
          fill="none"
          stroke="#0000ff"
          strokeWidth="2.5"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1.5, type: "spring" }}
        />
        <motion.circle
          cx="0"
          cy="12"
          r="6"
          fill="none"
          stroke="#000000"
          strokeWidth="2"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1.7, type: "spring" }}
        />
      </g>
      
      {/* Floating Hearts */}
      {[0, 1, 2].map((i) => (
        <motion.path
          key={`heart-${i}`}
          d="M 12 21 l -1.5 -1.3 C 5.5 15.4 2 12.3 2 8.5 C 2 5.4 4.4 3 7.5 3 c 1.7 0 3.4 0.8 4.5 2.1 C 13.1 3.8 14.8 3 16.5 3 C 19.6 3 22 5.4 22 8.5 c 0 3.8 -3.4 6.9 -8.5 11.5 L 12 21 z"
          fill="none"
          stroke="#0000ff"
          strokeWidth="1.5"
          transform={`translate(${80 + i * 120}, ${120 + i * 20}) scale(1.2)`}
          initial={{ y: 0, opacity: 0 }}
          animate={{ 
            y: [0, -80, -160],
            opacity: [0, 1, 0]
          }}
          transition={{ 
            duration: 3,
            delay: i * 0.7,
            repeat: Infinity,
            ease: "easeOut"
          }}
        />
      ))}
      
      {/* Camera */}
      <motion.g transform="translate(80, 140)">
        <motion.rect
          x="0"
          y="0"
          width="40"
          height="32"
          rx="4"
          fill="none"
          stroke="#000000"
          strokeWidth="2"
          initial={{ scale: 0, rotate: -15 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 2, type: "spring" }}
        />
        <motion.circle
          cx="20"
          cy="16"
          r="10"
          fill="none"
          stroke="#0000ff"
          strokeWidth="2"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 2.2, type: "spring" }}
        />
        <motion.circle
          cx="32"
          cy="6"
          r="2.5"
          fill="#0000ff"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 2.3 }}
        />
      </motion.g>
      
      {/* Stars */}
      {[0, 1, 2].map((i) => (
        <motion.g
          key={`star-${i}`}
          transform={`translate(${360 + i * 15}, ${140 + i * 60})`}
          initial={{ scale: 0, rotate: 0 }}
          animate={{ 
            scale: [0, 1, 1, 0],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: 4,
            delay: i * 0.6,
            repeat: Infinity
          }}
        >
          <path
            d="M 0 -8 L 2 -2 L 8 0 L 2 2 L 0 8 L -2 2 L -8 0 L -2 -2 Z"
            fill="none"
            stroke="#0000ff"
            strokeWidth="1.8"
          />
        </motion.g>
      ))}
      
      {/* Likes counter */}
      <motion.g transform="translate(100, 350)">
        <motion.text
          x="0"
          y="0"
          fontSize="22"
          fontWeight="bold"
          fill="#0000ff"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
        >
          10K+
        </motion.text>
        <motion.path
          d="M 12 21 l -1.5 -1.3 C 5.5 15.4 2 12.3 2 8.5 C 2 5.4 4.4 3 7.5 3 c 1.7 0 3.4 0.8 4.5 2.1 C 13.1 3.8 14.8 3 16.5 3 C 19.6 3 22 5.4 22 8.5 c 0 3.8 -3.4 6.9 -8.5 11.5 L 12 21 z"
          fill="#0000ff"
          transform="translate(48, -16) scale(1)"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 2.5, type: "spring" }}
        />
      </motion.g>
      
      {/* Engagement bubble */}
      <motion.circle
        cx="380"
        cy="350"
        r="26"
        fill="none"
        stroke="#000000"
        strokeWidth="2"
        strokeDasharray="4,4"
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1, 1.1, 1] }}
        transition={{ delay: 2.7, duration: 0.8 }}
      />
      <motion.text
        x="380"
        y="358"
        fontSize="18"
        fontWeight="bold"
        fill="#0000ff"
        textAnchor="middle"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3 }}
      >
        5K
      </motion.text>
      
      {/* Sparkles */}
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.g
          key={`sparkle-${i}`}
          transform={`translate(${80 + Math.random() * 340}, ${80 + Math.random() * 340})`}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
            rotate: [0, 180]
          }}
          transition={{ 
            duration: 2.5,
            delay: 3 + i * 0.3,
            repeat: Infinity
          }}
        >
          <line x1="-5" y1="0" x2="5" y2="0" stroke="#0000ff" strokeWidth="1.5" />
          <line x1="0" y1="-5" x2="0" y2="5" stroke="#0000ff" strokeWidth="1.5" />
        </motion.g>
      ))}
    </svg>
  );
}
