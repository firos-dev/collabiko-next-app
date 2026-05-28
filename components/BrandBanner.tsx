import { motion } from 'motion/react';
import { Target, Rocket, BarChart3, Megaphone, TrendingUp, Zap, Award } from 'lucide-react';

export function BrandBanner() {
  return (
    <div className="w-full h-full relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      {/* Animated Background Shapes */}
      <div className="absolute inset-0">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`bg-shape-${i}`}
            className="absolute rounded-full"
            style={{
              width: `${80 + i * 40}px`,
              height: `${80 + i * 40}px`,
              background: `radial-gradient(circle, rgba(0,0,255,${0.08 - i * 0.01}), transparent)`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50, 0],
              y: [0, Math.random() * 100 - 50, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 15 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full p-8">
        {/* Central Rocket Launch Animation */}
        <motion.div
          className="relative w-64 h-64 mb-8"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 1, type: "spring", stiffness: 100 }}
        >
          {/* Center Rocket */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-2xl"
            animate={{
              boxShadow: [
                '0 10px 40px rgba(0,0,255,0.3)',
                '0 15px 50px rgba(0,0,255,0.5)',
                '0 10px 40px rgba(0,0,255,0.3)',
              ],
              y: [0, -10, 0],
            }}
            transition={{
              boxShadow: { duration: 2, repeat: Infinity },
              y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
            }}
          >
            <Rocket className="w-12 h-12 text-white" strokeWidth={2} />
          </motion.div>

          {/* Orbiting Business Icons */}
          {[
            { icon: Target, color: 'from-red-500 to-pink-500', delay: 0 },
            { icon: BarChart3, color: 'from-emerald-500 to-green-600', delay: 0.5 },
            { icon: Megaphone, color: 'from-orange-400 to-red-500', delay: 1 },
            { icon: TrendingUp, color: 'from-cyan-400 to-blue-500', delay: 1.5 },
            { icon: Zap, color: 'from-yellow-400 to-orange-500', delay: 2 },
            { icon: Award, color: 'from-purple-500 to-indigo-600', delay: 2.5 },
          ].map((item, i) => {
            const angle = (i * 60) * (Math.PI / 180);
            const radius = 100;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;

            return (
              <motion.div
                key={i}
                className={`absolute top-1/2 left-1/2 w-16 h-16 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg`}
                style={{
                  x: x - 32,
                  y: y - 32,
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: [0, 1.1, 1],
                  opacity: 1,
                  rotate: [0, 360],
                }}
                transition={{
                  scale: { delay: item.delay, duration: 0.5 },
                  opacity: { delay: item.delay, duration: 0.3 },
                  rotate: { delay: item.delay + 0.5, duration: 20, repeat: Infinity, ease: "linear" },
                }}
              >
                <item.icon className="w-8 h-8 text-white" strokeWidth={2.5} />
              </motion.div>
            );
          })}
        </motion.div>

        {/* Growth Stats */}
        <div className="grid grid-cols-3 gap-4 w-full max-w-md">
          {[
            { label: 'ROI', value: '+245%', delay: 1.5 },
            { label: 'Reach', value: '5M+', delay: 1.7 },
            { label: 'Campaigns', value: '1K+', delay: 1.9 },
          ].map((stat, i) => (
            <motion.div
              key={i}
              className="bg-white rounded-2xl p-4 text-center shadow-xl border-2 border-indigo-200"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: stat.delay, type: "spring" }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div className="text-3xl font-bold text-indigo-600">
                {stat.value}
              </div>
              <div className="text-sm text-gray-700 mt-1 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Rising Success Arrows */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`arrow-${i}`}
            className="absolute"
            style={{
              left: `${15 + i * 14}%`,
              bottom: '10%',
            }}
            initial={{ y: 100, opacity: 0 }}
            animate={{
              y: [100, -200],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3,
              delay: 2 + i * 0.3,
              repeat: Infinity,
              ease: "easeOut",
            }}
          >
            <TrendingUp className="w-6 h-6 text-blue-500" strokeWidth={2.5} />
          </motion.div>
        ))}

        {/* Floating Particles */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-2 h-2 rounded-full bg-indigo-400"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, -200],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}

        {/* Connection Network Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-10">
          {[...Array(8)].map((_, i) => (
            <motion.line
              key={`line-${i}`}
              x1="50%"
              y1="50%"
              x2={`${Math.random() * 100}%`}
              y2={`${Math.random() * 100}%`}
              stroke="#0000ff"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, delay: 2 + i * 0.2 }}
            />
          ))}
        </svg>

        {/* Circular Progress Indicator */}
        <motion.div
          className="absolute top-8 right-8 w-16 h-16"
          initial={{ scale: 0 }}
          animate={{ scale: 1, rotate: 360 }}
          transition={{
            scale: { delay: 2.5, type: "spring" },
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
          }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#e0e7ff"
              strokeWidth="8"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#0000ff"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray="251.2"
              initial={{ strokeDashoffset: 251.2 }}
              animate={{ strokeDashoffset: 0 }}
              transition={{ duration: 2, delay: 2.7 }}
              style={{ transformOrigin: '50% 50%', transform: 'rotate(-90deg)' }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-bold text-blue-600">98%</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}