import { motion } from 'motion/react';
import { Camera, Heart, Star, TrendingUp, Instagram, Youtube, Users } from 'lucide-react';

export function InfluencerBanner() {
  return (
    <div className="w-full h-full relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
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
        {/* Central Icon Cluster */}
        <motion.div
          className="relative w-64 h-64 mb-8"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 1, type: "spring", stiffness: 100 }}
        >
          {/* Center Circle */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-2xl"
            animate={{
              boxShadow: [
                '0 10px 40px rgba(0,0,255,0.3)',
                '0 15px 50px rgba(0,0,255,0.5)',
                '0 10px 40px rgba(0,0,255,0.3)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Camera className="w-12 h-12 text-white" strokeWidth={2} />
          </motion.div>

          {/* Orbiting Icons */}
          {[
            { icon: Heart, color: 'from-pink-500 to-red-500', delay: 0 },
            { icon: Star, color: 'from-yellow-400 to-orange-500', delay: 0.5 },
            { icon: TrendingUp, color: 'from-green-400 to-emerald-600', delay: 1 },
            { icon: Instagram, color: 'from-purple-500 to-pink-500', delay: 1.5 },
            { icon: Youtube, color: 'from-red-500 to-red-600', delay: 2 },
            { icon: Users, color: 'from-blue-400 to-cyan-500', delay: 2.5 },
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

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 w-full max-w-md">
          {[
            { label: 'Followers', value: '100K+', delay: 1.5 },
            { label: 'Engagement', value: '12.5%', delay: 1.7 },
            { label: 'Campaigns', value: '250+', delay: 1.9 },
          ].map((stat, i) => (
            <motion.div
              key={i}
              className="bg-white rounded-2xl p-4 text-center shadow-xl border-2 border-blue-200"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: stat.delay, type: "spring" }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div className="text-3xl font-bold text-blue-600">
                {stat.value}
              </div>
              <div className="text-sm text-gray-700 mt-1 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Floating Particles */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-2 h-2 rounded-full bg-blue-400"
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

        {/* Decorative Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
          {[...Array(5)].map((_, i) => (
            <motion.line
              key={`line-${i}`}
              x1="50%"
              y1="50%"
              x2={`${20 + i * 15}%`}
              y2={`${20 + i * 15}%`}
              stroke="#0000ff"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, delay: 2 + i * 0.2 }}
            />
          ))}
        </svg>
      </div>
    </div>
  );
}