import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Trophy } from "lucide-react";

interface ResultModalProps {
  isOpen: boolean;
  isCorrect: boolean;
  onPlayAgain: () => void;
  onGoHome: () => void;
  streak: number;
  successRate: number;
}

const ResultModal = ({
  isOpen,
  isCorrect,
  onPlayAgain,
  onGoHome,
  streak,
  successRate,
}: ResultModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md bg-card/95 backdrop-blur border-border/50">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            {isCorrect ? (
              <div className="relative">
                <CheckCircle2 className="w-20 h-20 text-success animate-bounce-in" />
                <div className="absolute inset-0 bg-gradient-glow blur-xl opacity-50" />
              </div>
            ) : (
              <XCircle className="w-20 h-20 text-destructive animate-bounce-in" />
            )}
          </div>
          <DialogTitle className="text-3xl text-center">
            {isCorrect ? (
              <span className="bg-gradient-success bg-clip-text text-transparent">
                You Found It!
              </span>
            ) : (
              <span className="text-destructive">Try Again!</span>
            )}
          </DialogTitle>
          <DialogDescription className="text-center text-lg">
            {isCorrect 
              ? "Your focus is sharp! Keep the streak going." 
              : "Don't worry, focus improves with practice."}
          </DialogDescription>
        </DialogHeader>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 my-6">
          <div className="bg-secondary/50 rounded-lg p-4 text-center border border-border/30">
            <div className="flex items-center justify-center mb-2">
              <Trophy className="w-5 h-5 text-accent mr-2" />
              <span className="text-sm text-muted-foreground">Streak</span>
            </div>
            <div className="text-3xl font-bold text-accent">{streak}</div>
          </div>
          <div className="bg-secondary/50 rounded-lg p-4 text-center border border-border/30">
            <div className="flex items-center justify-center mb-2">
              <CheckCircle2 className="w-5 h-5 text-success mr-2" />
              <span className="text-sm text-muted-foreground">Success</span>
            </div>
            <div className="text-3xl font-bold text-success">{successRate}%</div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            onClick={onPlayAgain}
            className="w-full bg-gradient-primary hover:shadow-glow transition-all"
          >
            Play Again
          </Button>
          <Button
            onClick={onGoHome}
            variant="outline"
            className="w-full border-border/50 hover:bg-secondary/50"
          >
            Go Home
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ResultModal;
