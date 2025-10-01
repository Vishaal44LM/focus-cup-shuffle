import { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Tumbler from "@/components/Tumbler";
import ResultModal from "@/components/ResultModal";
import { toast } from "sonner";

interface DifficultyConfig {
  tumblers: number;
  moves: number;
  speed: number;
}

const difficulties: Record<string, DifficultyConfig> = {
  easy: { tumblers: 3, moves: 5, speed: 600 },
  medium: { tumblers: 4, moves: 7, speed: 450 },
  hard: { tumblers: 5, moves: 10, speed: 300 },
};

type GamePhase = "reveal" | "shuffle" | "select" | "result";

interface TumblerData {
  id: number;
  position: number;
}

const Game = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const difficulty = searchParams.get("difficulty") || "easy";
  const config = difficulties[difficulty];

  const [tumblers, setTumblers] = useState<TumblerData[]>([]);
  const [ballTumblerId, setBallTumblerId] = useState<number>(0);
  const [phase, setPhase] = useState<GamePhase>("reveal");
  const [selectedTumblerId, setSelectedTumblerId] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [streak, setStreak] = useState(0);

  // Initialize game
  const initGame = useCallback(() => {
    const newTumblers: TumblerData[] = Array.from({ length: config.tumblers }, (_, i) => ({
      id: i,
      position: i,
    }));
    const randomBallId = Math.floor(Math.random() * config.tumblers);
    
    setTumblers(newTumblers);
    setBallTumblerId(randomBallId);
    setSelectedTumblerId(null);
    setPhase("reveal");
    
    toast.info("Watch the highlighted cup!");
  }, [config.tumblers]);

  useEffect(() => {
    initGame();
  }, [initGame]);

  // Shuffle animation
  const performShuffle = useCallback(() => {
    setPhase("shuffle");
    let moveCount = 0;

    const shuffleInterval = setInterval(() => {
      if (moveCount >= config.moves) {
        clearInterval(shuffleInterval);
        setPhase("select");
        toast.success("Find the ball!");
        return;
      }

      // Randomly swap two positions
      setTumblers((prev) => {
        const newTumblers = [...prev];
        const pos1 = Math.floor(Math.random() * newTumblers.length);
        let pos2 = Math.floor(Math.random() * newTumblers.length);
        
        while (pos2 === pos1 && newTumblers.length > 1) {
          pos2 = Math.floor(Math.random() * newTumblers.length);
        }

        // Swap positions
        [newTumblers[pos1].position, newTumblers[pos2].position] = 
        [newTumblers[pos2].position, newTumblers[pos1].position];

        return newTumblers;
      });

      moveCount++;
    }, config.speed);
  }, [config.moves, config.speed]);

  // Start shuffle after reveal
  useEffect(() => {
    if (phase === "reveal") {
      const timer = setTimeout(() => {
        performShuffle();
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [phase, performShuffle]);

  // Handle tumbler selection
  const handleTumblerClick = (tumblerId: number) => {
    if (phase !== "select") return;

    setSelectedTumblerId(tumblerId);
    const correct = tumblerId === ballTumblerId;
    setIsCorrect(correct);
    setPhase("result");

    setScore((prev) => ({
      correct: prev.correct + (correct ? 1 : 0),
      total: prev.total + 1,
    }));

    if (correct) {
      setStreak((prev) => prev + 1);
      toast.success("Correct! 🎯");
    } else {
      setStreak(0);
      toast.error("Not quite! Try again!");
    }
  };

  const handlePlayAgain = () => {
    initGame();
  };

  const handleGoHome = () => {
    navigate("/");
  };

  const successRate = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0;

  // Sort tumblers by position for rendering
  const sortedTumblers = [...tumblers].sort((a, b) => a.position - b.position);

  return (
    <div className="min-h-screen bg-background p-4">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={handleGoHome}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
          
          <div className="text-center">
            <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Mode
            </h1>
            <p className="text-sm text-muted-foreground capitalize">
              {phase === "reveal" && "👀 Watch the ball..."}
              {phase === "shuffle" && "🔄 Follow the cup!"}
              {phase === "select" && "🎯 Make your choice"}
              {phase === "result" && (isCorrect ? "✅ Correct!" : "❌ Try again!")}
            </p>
          </div>

          <div className="w-32" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mb-8">
          <div className="bg-card/50 backdrop-blur rounded-lg p-3 text-center border border-border/30">
            <div className="text-xl font-bold text-primary">{score.total}</div>
            <div className="text-xs text-muted-foreground">Attempts</div>
          </div>
          <div className="bg-card/50 backdrop-blur rounded-lg p-3 text-center border border-border/30">
            <div className="text-xl font-bold text-success">{successRate}%</div>
            <div className="text-xs text-muted-foreground">Success</div>
          </div>
          <div className="bg-card/50 backdrop-blur rounded-lg p-3 text-center border border-border/30">
            <div className="text-xl font-bold text-accent">{streak}</div>
            <div className="text-xs text-muted-foreground">Streak</div>
          </div>
        </div>
      </div>

      {/* Game Area */}
      <div className="max-w-5xl mx-auto">
        <div className="relative min-h-[500px] flex items-end justify-center pb-16">
          <div className="relative flex items-end justify-center gap-6">
            <AnimatePresence>
              {sortedTumblers.map((tumbler) => (
                <motion.div
                  key={tumbler.id}
                  layout
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    layout: { duration: 0.5, ease: "easeInOut" },
                    opacity: { duration: 0.3 },
                    scale: { duration: 0.3 },
                  }}
                  style={{
                    position: "relative",
                  }}
                >
                  <Tumbler
                    index={tumbler.id}
                    hasBall={tumbler.id === ballTumblerId}
                    isHighlighted={phase === "reveal" && tumbler.id === ballTumblerId}
                    isSelected={selectedTumblerId === tumbler.id}
                    isRevealed={phase === "result"}
                    phase={phase}
                    onClick={() => handleTumblerClick(tumbler.id)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Instructions during shuffle */}
        {phase === "shuffle" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mt-8"
          >
            <p className="text-xl text-accent font-semibold animate-pulse">
              Keep your eyes on the glowing cup! 👁️
            </p>
          </motion.div>
        )}
      </div>

      {/* Result Modal */}
      <ResultModal
        isOpen={phase === "result"}
        isCorrect={isCorrect}
        onPlayAgain={handlePlayAgain}
        onGoHome={handleGoHome}
        streak={streak}
        successRate={successRate}
      />
    </div>
  );
};

export default Game;
