import { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Tumbler from "@/components/Tumbler";
import ResultModal from "@/components/ResultModal";
import { toast } from "sonner";

interface DifficultyConfig {
  tumblers: number;
  moves: number;
  speed: number;
}

const difficulties: Record<string, DifficultyConfig> = {
  easy: { tumblers: 3, moves: 5, speed: 800 },
  medium: { tumblers: 4, moves: 7, speed: 600 },
  hard: { tumblers: 5, moves: 10, speed: 400 },
};

type GamePhase = "reveal" | "shuffle" | "select" | "result";

const Game = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const difficulty = searchParams.get("difficulty") || "easy";
  const config = difficulties[difficulty];

  const [tumblers, setTumblers] = useState<number[]>([]);
  const [ballPosition, setBallPosition] = useState<number>(0);
  const [phase, setPhase] = useState<GamePhase>("reveal");
  const [selectedTumbler, setSelectedTumbler] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [streak, setStreak] = useState(0);

  // Initialize game
  const initGame = useCallback(() => {
    const newTumblers = Array.from({ length: config.tumblers }, (_, i) => i);
    const randomBallPos = Math.floor(Math.random() * config.tumblers);
    
    setTumblers(newTumblers);
    setBallPosition(randomBallPos);
    setSelectedTumbler(null);
    setPhase("reveal");
    
    toast.info("Watch the highlighted tumbler!");
  }, [config.tumblers]);

  useEffect(() => {
    initGame();
  }, [initGame]);

  // Shuffle animation
  const performShuffle = useCallback(() => {
    setPhase("shuffle");
    let currentPos = ballPosition;
    let moveCount = 0;

    const shuffleInterval = setInterval(() => {
      if (moveCount >= config.moves) {
        clearInterval(shuffleInterval);
        setPhase("select");
        toast.success("Find the ball!");
        return;
      }

      // Randomly swap two positions
      const pos1 = Math.floor(Math.random() * config.tumblers);
      let pos2 = Math.floor(Math.random() * config.tumblers);
      while (pos2 === pos1) {
        pos2 = Math.floor(Math.random() * config.tumblers);
      }

      setTumblers((prev) => {
        const newTumblers = [...prev];
        [newTumblers[pos1], newTumblers[pos2]] = [newTumblers[pos2], newTumblers[pos1]];
        return newTumblers;
      });

      // Update ball position if it was moved
      if (currentPos === pos1) {
        currentPos = pos2;
        setBallPosition(pos2);
      } else if (currentPos === pos2) {
        currentPos = pos1;
        setBallPosition(pos1);
      }

      moveCount++;
    }, config.speed);
  }, [ballPosition, config.moves, config.speed, config.tumblers]);

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
  const handleTumblerClick = (index: number) => {
    if (phase !== "select") return;

    setSelectedTumbler(index);
    const correct = index === ballPosition;
    setIsCorrect(correct);
    setPhase("result");

    setScore((prev) => ({
      correct: prev.correct + (correct ? 1 : 0),
      total: prev.total + 1,
    }));

    if (correct) {
      setStreak((prev) => prev + 1);
    } else {
      setStreak(0);
    }
  };

  const handlePlayAgain = () => {
    initGame();
  };

  const handleGoHome = () => {
    navigate("/");
  };

  const successRate = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0;

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
              {phase === "reveal" && "Watch the ball..."}
              {phase === "shuffle" && "Follow the tumbler!"}
              {phase === "select" && "Make your choice"}
              {phase === "result" && (isCorrect ? "Correct!" : "Try again!")}
            </p>
          </div>

          <div className="w-32" /> {/* Spacer for alignment */}
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
      <div className="max-w-4xl mx-auto">
        <div className="relative min-h-[400px] flex items-center justify-center">
          <div 
            className="flex items-end justify-center gap-8"
            style={{
              gridTemplateColumns: `repeat(${config.tumblers}, 1fr)`,
            }}
          >
            {tumblers.map((_, index) => (
              <Tumbler
                key={index}
                index={index}
                hasBall={index === ballPosition}
                isHighlighted={phase === "reveal" && index === ballPosition}
                isSelected={selectedTumbler === index}
                isRevealed={phase === "result"}
                phase={phase}
                onClick={() => handleTumblerClick(index)}
              />
            ))}
          </div>
        </div>
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
