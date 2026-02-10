import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Package, Check } from "lucide-react";

type Props = {
  onComplete: () => void;
  duration?: number;
};

const LoginSuccessAnimation: React.FC<Props> = ({ onComplete, duration = 3 }) => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      onComplete();
    }, duration * 1000 + 500);
    return () => clearTimeout(timeout);
  }, [onComplete, duration]);

  // Confetti particles (10 boxes falling)
  const confetti = Array.from({ length: 10 }).map((_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.3,
    duration: 2 + Math.random() * 0.5,
    rotation: Math.random() * 720,
  }));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Dark blurred background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />

      {/* Main animation container */}
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Confetti boxes falling */}
        {confetti.map((c) => (
          <motion.div
            key={c.id}
            initial={{
              x: (c.left - 50) * 10,
              y: -120,
              opacity: 1,
              rotate: 0,
            }}
            animate={{
              y: 800,
              rotate: c.rotation,
              opacity: [1, 1, 0],
            }}
            transition={{
              duration: c.duration,
              delay: c.delay,
              ease: "easeIn",
            }}
            style={{
              position: "fixed",
              left: `${c.left}%`,
              pointerEvents: "none",
            }}
          >
            <div className="w-6 h-6 bg-yellow-400 rounded-sm shadow-lg transform" />
          </motion.div>
        ))}

        {/* Center stage: Package + Checkmark */}
        <div className="relative">
          {/* Outer glow ring */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{
              duration: 0.8,
              ease: [0.34, 1.56, 0.64, 1],
            }}
            className="absolute inset-0 rounded-full bg-gradient-to-r from-accent/40 via-accent/20 to-transparent blur-2xl"
            style={{
              width: "320px",
              height: "320px",
              margin: "auto",
            }}
          />

          {/* Package box container */}
          <motion.div
            initial={{ scale: 0.6, y: 40, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            transition={{
              duration: 0.6,
              ease: [0.34, 1.56, 0.64, 1],
              delay: 0.1,
            }}
            className="relative w-32 h-32 flex items-center justify-center"
          >
            {/* Package icon with background */}
            <div className="relative w-32 h-32 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl shadow-2xl border-2 border-yellow-300 flex items-center justify-center overflow-hidden">
              {/* Inner shine effect */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: [0.5, 0], scale: 1.5 }}
                transition={{
                  duration: 1,
                  delay: 0.4,
                }}
                className="absolute inset-0 bg-white rounded-2xl"
              />

              {/* Package icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  duration: 0.7,
                  ease: [0.34, 1.56, 0.64, 1],
                  delay: 0.2,
                }}
              >
                <Package className="w-16 h-16 text-yellow-500" strokeWidth={1.5} />
              </motion.div>

              {/* Checkmark overlay (appears after package) */}
              <motion.div
                initial={{ scale: 0, rotate: -180, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                transition={{
                  duration: 0.6,
                  ease: [0.34, 1.56, 0.64, 1],
                  delay: 0.8,
                }}
                className="absolute bottom-2 right-2 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
              >
                <Check className="w-6 h-6 text-white" strokeWidth={3} />
              </motion.div>
            </div>
          </motion.div>

          {/* Float animation on main box */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
            className="relative w-32 h-32"
          />
        </div>

        {/* Success text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            delay: 0.6,
          }}
          className="absolute bottom-20 text-center"
        >
          <motion.h2
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{
              duration: 0.5,
              ease: [0.34, 1.56, 0.64, 1],
              delay: 0.7,
            }}
            className="text-2xl font-bold text-white mb-2"
          >
            Inventory Synced!
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.5,
              delay: 1,
            }}
            className="text-white/80 text-sm"
          >
            Ready to manage your stock
          </motion.p>
        </motion.div>

        {/* Pulse rings (like ripples) */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={`ring-${i}`}
            initial={{ scale: 0.8, opacity: 0.6 }}
            animate={{ scale: 2.5, opacity: 0 }}
            transition={{
              duration: 1.2,
              delay: 0.5 + i * 0.2,
              ease: "easeOut",
            }}
            className="absolute top-1/2 left-1/2 w-32 h-32 border-2 border-accent rounded-full -translate-x-1/2 -translate-y-1/2"
          />
        ))}
      </div>
    </div>
  );
};

export default LoginSuccessAnimation;
