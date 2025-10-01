import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export type Difficulty = "easy" | "medium" | "hard";

interface DifficultyConfig {
  tumblers: number;
  moves: number;
  speed: number;
  label: string;
  description: string;
}

const difficulties: Record<Difficulty, DifficultyConfig> = {
  easy: {
    tumblers: 3,
    moves: 5,
    speed: 800,
    label: "Easy",
    description: "3 tumblers, 5 moves, slow pace",
  },
  medium: {
    tumblers: 4,
    moves: 7,
    speed: 600,
    label: "Medium",
    description: "4 tumblers, 7 moves, medium pace",
  },
  hard: {
    tumblers: 5,
    moves: 10,
    speed: 400,
    label: "Hard",
    description: "5 tumblers, 10 moves, fast pace",
  },
};

const Home = () => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>("easy");
  const navigate = useNavigate();

  const handleStart = () => {
    navigate(`/game?difficulty=${selectedDifficulty}`);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-4xl animate-slide-up">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block relative mb-6">
            <h1 className="text-6xl md:text-7xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Tumbler Tracker
            </h1>
            <div className="absolute inset-0 bg-gradient-glow blur-3xl opacity-50 -z-10" />
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Train your focus and visual tracking like an F1 driver. Watch the ball, follow the shuffle, and find it.
          </p>
        </div>

        {/* Difficulty Selection */}
        <Card className="p-8 mb-8 bg-card/50 backdrop-blur border-border/50">
          <h2 className="text-2xl font-semibold mb-6 text-center">Select Difficulty</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {(Object.keys(difficulties) as Difficulty[]).map((key) => {
              const config = difficulties[key];
              const isSelected = selectedDifficulty === key;
              
              return (
                <button
                  key={key}
                  onClick={() => setSelectedDifficulty(key)}
                  className={`
                    p-6 rounded-lg border-2 transition-all duration-300
                    ${isSelected 
                      ? "border-primary bg-primary/10 shadow-glow scale-105" 
                      : "border-border hover:border-primary/50 bg-secondary/30"
                    }
                  `}
                >
                  <h3 className="text-xl font-bold mb-2 text-foreground">
                    {config.label}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {config.description}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Instructions */}
          <div className="bg-secondary/30 rounded-lg p-6 mb-6 border border-border/30">
            <h3 className="text-lg font-semibold mb-3 text-accent">How to Play</h3>
            <ol className="space-y-2 text-muted-foreground">
              <li className="flex items-start">
                <span className="text-accent font-bold mr-2">1.</span>
                <span>Watch carefully as the ball is revealed under a highlighted tumbler</span>
              </li>
              <li className="flex items-start">
                <span className="text-accent font-bold mr-2">2.</span>
                <span>Follow the tumbler during the shuffle sequence</span>
              </li>
              <li className="flex items-start">
                <span className="text-accent font-bold mr-2">3.</span>
                <span>Click the tumbler you believe contains the ball</span>
              </li>
            </ol>
          </div>

          {/* Start Button */}
          <Button
            onClick={handleStart}
            size="lg"
            className="w-full text-lg font-semibold bg-gradient-primary hover:shadow-glow transition-all duration-300 hover:scale-105"
          >
            Start Game
          </Button>
        </Card>

        {/* Stats Preview */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-card/30 backdrop-blur rounded-lg p-4 border border-border/30">
            <div className="text-3xl font-bold text-primary mb-1">0</div>
            <div className="text-sm text-muted-foreground">Games Played</div>
          </div>
          <div className="bg-card/30 backdrop-blur rounded-lg p-4 border border-border/30">
            <div className="text-3xl font-bold text-success mb-1">0%</div>
            <div className="text-sm text-muted-foreground">Success Rate</div>
          </div>
          <div className="bg-card/30 backdrop-blur rounded-lg p-4 border border-border/30">
            <div className="text-3xl font-bold text-accent mb-1">0</div>
            <div className="text-sm text-muted-foreground">Current Streak</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
