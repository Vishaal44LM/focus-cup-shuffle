import { motion, AnimatePresence } from "framer-motion";

interface TumblerProps {
  index: number;
  hasBall: boolean;
  isHighlighted: boolean;
  isSelected: boolean;
  isRevealed: boolean;
  phase: "reveal" | "shuffle" | "select" | "result";
  onClick: () => void;
}

const Tumbler = ({
  hasBall,
  isHighlighted,
  isSelected,
  isRevealed,
  phase,
  onClick,
}: TumblerProps) => {
  const canClick = phase === "select";
  const showBall = (phase === "reveal" || phase === "result") && hasBall;

  return (
    <div className="relative flex flex-col items-center justify-end h-48">
      {/* Ball - Always visible during reveal and result */}
      <AnimatePresence>
        {showBall && (
          <motion.div
            initial={{ scale: 0, y: 0 }}
            animate={{ 
              scale: 1, 
              y: 0,
            }}
            exit={{ scale: 0 }}
            transition={{ 
              type: "spring",
              stiffness: 400,
              damping: 20
            }}
            className="absolute bottom-8 w-12 h-12 rounded-full z-10"
            style={{
              background: "radial-gradient(circle at 30% 30%, #ffd700, #ff8c00)",
              boxShadow: "0 0 30px rgba(255, 215, 0, 0.8), 0 4px 10px rgba(0, 0, 0, 0.3)",
            }}
          >
            {/* Ball highlight */}
            <div 
              className="absolute top-2 left-2 w-4 h-4 rounded-full bg-white/60"
              style={{ filter: "blur(4px)" }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tumbler/Cup */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ 
          scale: 1, 
          opacity: 1,
        }}
        whileHover={canClick ? { scale: 1.05 } : {}}
        onClick={onClick}
        disabled={!canClick}
        className={`
          relative w-28 h-36
          transition-all duration-300
          ${canClick ? "cursor-pointer" : "cursor-default"}
          ${isSelected && phase === "result" && hasBall ? "scale-110" : ""}
        `}
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        {/* Cup shape - trapezoid */}
        <div 
          className={`
            absolute inset-0 
            transition-all duration-500
            ${isSelected && phase === "result" && hasBall 
              ? "bg-gradient-to-b from-green-400 to-green-600 border-green-400" 
              : isSelected && phase === "result" && !hasBall 
                ? "bg-gradient-to-b from-red-400 to-red-600 border-red-400"
                : "bg-gradient-to-b from-purple-500 via-purple-600 to-purple-800 border-purple-400"
            }
            ${isHighlighted ? "animate-pulse" : ""}
            border-4 rounded-t-3xl rounded-b-lg
            shadow-2xl
          `}
          style={{
            clipPath: "polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)",
            boxShadow: isHighlighted 
              ? "0 0 40px rgba(34, 211, 238, 0.8), 0 10px 30px rgba(0, 0, 0, 0.5)"
              : "0 10px 30px rgba(0, 0, 0, 0.5)",
          }}
        >
          {/* Shine/Reflection on cup */}
          <div 
            className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent"
            style={{
              clipPath: "polygon(20% 0%, 40% 0%, 35% 40%, 15% 40%)",
            }}
          />
          
          {/* Rim highlight */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-white/20 rounded-t-3xl" />
        </div>

        {/* Glow effect when highlighted */}
        {isHighlighted && (
          <motion.div
            className="absolute inset-0 rounded-t-3xl"
            animate={{
              boxShadow: [
                "0 0 20px rgba(34, 211, 238, 0.5)",
                "0 0 40px rgba(34, 211, 238, 0.8)",
                "0 0 20px rgba(34, 211, 238, 0.5)",
              ],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}
      </motion.button>

      {/* Shadow */}
      <div 
        className="mt-2 w-24 h-4 rounded-full"
        style={{
          background: "radial-gradient(ellipse, rgba(0, 0, 0, 0.4), transparent)",
          filter: "blur(4px)",
        }}
      />
    </div>
  );
};

export default Tumbler;
