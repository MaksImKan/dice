import React, { useState, useCallback, useRef, useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";

interface GameResult {
  id: number;
  time: string;
  threshold: number;
  condition: 'over' | 'under';
  result: number;
  isWin: boolean;
}

interface LastGameResult {
  isWin: boolean;
  message: string;
}

const SLIDER_WIDTH = 320;
const MAX_HISTORY_ITEMS = 10;
const INITIAL_THRESHOLD = 20;
const INITIAL_GAME_ID = 11;



export const Dice = (): JSX.Element => {
  const [threshold, setThreshold] = useState<number>(INITIAL_THRESHOLD);
  const [condition, setCondition] = useState<'over' | 'under'>('under');
  const [currentResult, setCurrentResult] = useState<number | null>(100);
  const [gameHistory, setGameHistory] = useState<GameResult[]>([]);
  const [lastGameResult, setLastGameResult] = useState<LastGameResult | null>({
    isWin: false,
    message: "Number was higher"
  });
  const [gameId, setGameId] = useState<number>(INITIAL_GAME_ID);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const generateRandomNumber = () => Math.floor(Math.random() * 101);

  const checkWinCondition = (result: number): boolean => {
    return condition === 'over' ? result > threshold : result < threshold;
  };

  const createGameResult = (result: number, isWin: boolean): GameResult => ({
    id: gameId,
    time: new Date().toLocaleTimeString('en-US', { hour12: false }),
    threshold,
    condition,
    result,
    isWin,
  });

  const getResultMessage = (isWin: boolean): string => {
    if (isWin) return "";
    return `Number was ${condition === 'over' ? 'lower' : 'higher'}`;
  };

  const playGame = useCallback(() => {
    const result = generateRandomNumber();
    const isWin = checkWinCondition(result);
    const gameResult = createGameResult(result, isWin);

    setGameHistory(prev => [gameResult, ...prev].slice(0, MAX_HISTORY_ITEMS));
    setCurrentResult(result);
    setLastGameResult({
      isWin,
      message: getResultMessage(isWin)
    });
    setGameId(prev => prev + 1);
  }, [threshold, condition, gameId]);

  const handleConditionChange = (value: 'over' | 'under') => {
    setCondition(value);
  };

  const updateSliderValue = useCallback((clientX: number) => {
    if (!sliderRef.current) return;
    
    const rect = sliderRef.current.getBoundingClientRect();
    const percentage = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const newValue = Math.round(percentage * 100);
    setThreshold(newValue);
  }, []);

  const handleSliderMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
    updateSliderValue(e.clientX);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      updateSliderValue(e.clientX);
    }
  }, [isDragging, updateSliderValue]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (!isDragging) return;

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const sliderPosition = (threshold / 100) * SLIDER_WIDTH;

  const renderAlert = () => {
    if (!lastGameResult) return null;

    const alertStyles = lastGameResult.isWin 
      ? `bg-success text-white border-none rounded-lg p-4`
      : `bg-error text-white border-none rounded-lg p-4`;

    return (
      <Alert variant={lastGameResult.isWin ? "default" : "destructive"} className={alertStyles}>
        <div className="flex items-center">
          <img
            className="h-[22px] w-[22px] mr-3 flex-shrink-0"
            alt={lastGameResult.isWin ? "Success" : "Error outline"}
            src={lastGameResult.isWin ? "/done.png" : "/erroroutline.svg"}
          />
          <div>
            <AlertTitle className="font-alert-title text-white text-base font-medium">
              {lastGameResult.isWin ? "You won" : "You lost"}
            </AlertTitle>
            {lastGameResult.message && (
              <AlertDescription className="font-alert-description text-white text-sm">
                {lastGameResult.message}
              </AlertDescription>
            )}
          </div>
        </div>
      </Alert>
    );
  };

  const renderGameResult = () => (
    <Card className="bg-[#0000000a] h-[200px] rounded flex items-center justify-center">
      <CardContent className="p-0 flex items-center justify-center h-full w-full">
        <span className="font-typography-h1 text-[#000000de] text-[96px] tracking-[-1.5px] leading-[116.7%] font-light">
          {currentResult !== null ? currentResult : "?"}
        </span>
      </CardContent>
    </Card>
  );

  const renderConditionSelector = () => (
    <RadioGroup 
      value={condition} 
      onValueChange={handleConditionChange}
      className="flex items-center gap-4"
    >
      {['Under', 'Over'].map((label) => (
        <div key={label} className="flex items-center">
          <span className="font-typography-body1 text-[#000000de] mr-2">
            {label}
          </span>
          <RadioGroupItem
            value={label.toLowerCase()}
            id={label.toLowerCase()}
            className="text-primary border-primary data-[state=checked]:bg-primary data-[state=checked]:text-white"
          />
        </div>
      ))}
    </RadioGroup>
  );

  const renderSlider = () => (
    <div className="relative w-full h-[42px]">
      <Badge 
        className="absolute -top-6 bg-gray font-typography-subtitle2 text-white px-3 py-1 rounded"
        style={{ left: `${sliderPosition - 12}px` }}
      >
        {threshold}
      </Badge>

      <div 
        ref={sliderRef}
        className="absolute w-80 h-3 top-[15px] cursor-pointer select-none"
        onMouseDown={handleSliderMouseDown}
      >
        <div className="absolute w-80 h-0.5 top-[5px] bg-primary rounded-[100px] opacity-[0.38]" />
        <div 
          className="absolute h-0.5 top-[5px] bg-primary rounded-[100px]"
          style={{ width: `${sliderPosition}px` }}
        />

        <div 
          className="absolute w-3 h-3 top-0 bg-primary rounded-[100px] cursor-pointer"
          style={{ left: `${sliderPosition}px` }}
        >
          <div className="relative w-8 h-8 -top-2.5 -left-2.5 rounded-2xl">
            <div className={`absolute w-8 h-8 top-0 left-0 bg-primary rounded-2xl ${isDragging ? 'opacity-30' : 'opacity-[0.16]'}`} />
            <div className="absolute w-3 h-3 top-2.5 left-2.5 bg-primary rounded-md shadow-elevation-2" />
          </div>
        </div>

        <div className="flex w-80 items-start justify-between absolute top-[5px]">
          {Array(7).fill(0).map((_, index) => {
            const tickPosition = (index / 6) * SLIDER_WIDTH;
            const isActive = tickPosition <= sliderPosition;
            return (
              <div
                key={index}
                className="relative w-0.5 h-0.5 bg-primary rounded-[100px] overflow-hidden"
              >
                {!isActive && (
                  <div className="h-0.5 bg-white rounded-[100px] opacity-80" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-start justify-between w-full mt-4 absolute -bottom-[20px]">
        <div className="font-typography-body2 text-muted text-center">0</div>
        <div className="font-typography-body2 text-muted text-center">100</div>
      </div>
    </div>
  );

  const renderGameHistory = () => (
    <Table>
      <TableHeader>
        <TableRow className="border-b border-[#0000001f]">
          <TableHead className="font-table-header text-[#000000de]">Time</TableHead>
          <TableHead className="font-table-header text-[#000000de]">Guess</TableHead>
          <TableHead className="font-table-header text-[#000000de]">Result</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {gameHistory.map((game) => (
          <TableRow key={game.id} className="border-b border-[#0000001f]">
            <TableCell className="py-1.5 font-typography-body2 text-[#000000de]">
              {game.time}
            </TableCell>
            <TableCell className="py-1.5 font-typography-body2 text-[#000000de]">
              {game.condition === 'over' ? 'Over' : 'Under'} {game.threshold}
            </TableCell>
            <TableCell
              className={`py-1.5 font-typography-body2 ${
                game.isWin ? 'text-green-800' : 'text-red-700'
              }`}
            >
              {game.result}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <div className="bg-white flex flex-row justify-center w-full">
      <div className="bg-white w-[1440px] h-[1024px] relative">
        <div className="absolute top-4 left-[420px] w-[600px]">
          {renderAlert()}
        </div>

        <div className="absolute top-[113px] left-[560px] w-80">
          {renderGameResult()}
        </div>

        <div className="absolute top-[329px] left-[560px] w-80 flex items-center justify-center gap-4">
          {renderConditionSelector()}
        </div>

        <div className="absolute top-[399px] left-[560px] w-80">
          {renderSlider()}
        </div>

        <Button 
          onClick={playGame}
          className="absolute top-[477px] left-[560px] w-80 bg-primary hover:bg-primary-hover text-white font-button-large py-2 rounded shadow-elevation-2"
        >
          PLAY
        </Button>

        <div className="absolute top-[535px] left-[420px] w-[600px]">
          {renderGameHistory()}
        </div>
      </div>
    </div>
  );
};