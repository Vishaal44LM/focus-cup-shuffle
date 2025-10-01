import { motion } from "framer-motion";

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

  const tumblerVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: { duration: 0.5 }
    },
    highlighted: {
      scale: 1.05,
      boxShadow: "0 0 40px hsl(188 95% 50% / 0.8)",
      transition: { duration: 0.3 }
    },
    selected: {
      scale: 0.95,
      transition: { duration: 0.2 }
    },
    shuffle: {
      y: [0, -10, 0],
      transition: { duration: 0.5 }
    }
  };

  const ballVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        type: "spring" as const,
        stiffness: 300,
        damping: 15
      }
    }
  };

  return (
    <div className="relative flex flex-col items-center">
      {/* Ball (shown before tumbler or when revealed) */}
      {showBall && (
        <motion.div
          variants={ballVariants}
          initial="hidden"
          animate="visible"
          className="absolute bottom-4 w-10 h-10 rounded-full bg-gradient-to-br from-highlight to-yellow-500 shadow-glow-accent z-0"
        />
      )}

      {/* Tumbler */}
      <motion.button
        variants={tumblerVariants}
        initial="initial"
        animate={
          isHighlighted ? "highlighted" : 
          isSelected ? "selected" : 
          phase === "shuffle" ? "shuffle" :
          "animate"
        }
        onClick={onClick}
        disabled={!canClick}
        className={`
          relative w-24 h-32 rounded-t-full
          transition-all duration-300
          ${canClick ? "cursor-pointer" : "cursor-default"}
          ${isSelected && phase === "result" && hasBall ? "bg-gradient-success border-success shadow-glow-success" : ""}
          ${isSelected && phase === "result" && !hasBall ? "bg-gradient-to-b from-destructive to-destructive/70 border-destructive" : ""}
          ${!isSelected ? "bg-gradient-to-b from-primary via-primary/80 to-primary/60" : ""}
          ${isHighlighted ? "animate-pulse-glow" : ""}
          ${canClick && !isSelected ? "hover:scale-105 hover:shadow-glow" : ""}
          border-2 border-primary/50
          shadow-xl
          overflow-hidden
        `}
        style={{
          clipPath: "polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)",
        }}
      >
        {/* Shine effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent" />
        
        {/* Highlight glow */}
        {isHighlighted && (
          <motion.div
            className="absolute inset-0 bg-accent/30 rounded-t-full"
            animate={{
              opacity: [0.3, 0.6, 0.3],
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
      <div className="mt-1 w-20 h-3 bg-black/30 rounded-full blur-sm" />
    </div>
  );
};

export default Tumbler;
