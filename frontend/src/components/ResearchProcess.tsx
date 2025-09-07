import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Brain, 
  Globe, 
  FileText, 
  CheckCircle, 
  Clock,
  Loader2,
  ArrowRight,
  Lightbulb,
  Target
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export type ProcessStep = 
  | 'idle'
  | 'generating-queries'
  | 'searching-web'
  | 'reflecting'
  | 'synthesizing'
  | 'completed'
  | 'error';

export interface ProcessState {
  currentStep: ProcessStep;
  progress: number;
  generatedQueries: string[];
  currentSearchQuery?: string;
  searchResults: number;
  reflectionNotes: string[];
  iterations: number;
  maxIterations: number;
  error?: string;
}

interface ResearchProcessProps {
  processState: ProcessState;
  className?: string;
}

const stepConfig = {
  'idle': {
    icon: Clock,
    title: 'Ready to Research',
    description: 'Waiting for your query...',
    color: 'text-muted-foreground',
    bgColor: 'bg-muted/20'
  },
  'generating-queries': {
    icon: Brain,
    title: 'Generating Search Queries',
    description: 'AI is crafting strategic search queries...',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/20'
  },
  'searching-web': {
    icon: Globe,
    title: 'Searching the Web',
    description: 'Gathering information from multiple sources...',
    color: 'text-green-500',
    bgColor: 'bg-green-500/20'
  },
  'reflecting': {
    icon: Lightbulb,
    title: 'Analyzing Results',
    description: 'Evaluating information and identifying gaps...',
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/20'
  },
  'synthesizing': {
    icon: FileText,
    title: 'Synthesizing Answer',
    description: 'Creating comprehensive response...',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/20'
  },
  'completed': {
    icon: CheckCircle,
    title: 'Research Complete',
    description: 'Analysis finished successfully!',
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/20'
  },
  'error': {
    icon: Target,
    title: 'Error Occurred',
    description: 'Something went wrong during research...',
    color: 'text-destructive',
    bgColor: 'bg-destructive/20'
  }
};

const ProcessStep: React.FC<{
  step: ProcessStep;
  isActive: boolean;
  isCompleted: boolean;
  index: number;
}> = ({ step, isActive, isCompleted, index }) => {
  const config = stepConfig[step];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="relative flex items-center space-x-3"
    >
      <motion.div
        className={`
          flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center
          ${isActive ? config.bgColor + ' ' + config.color : ''}
          ${isCompleted ? 'bg-emerald-500/20 text-emerald-500' : ''}
          ${!isActive && !isCompleted ? 'bg-muted text-muted-foreground' : ''}
        `}
        animate={{
          scale: isActive ? [1, 1.1, 1] : 1,
          rotate: isActive ? [0, 5, -5, 0] : 0
        }}
        transition={{
          duration: 2,
          repeat: isActive ? Infinity : 0,
          ease: "easeInOut"
        }}
      >
        <AnimatePresence mode="wait">
          {isActive && step !== 'completed' && step !== 'error' ? (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Loader2 className="w-5 h-5 animate-spin" />
            </motion.div>
          ) : (
            <motion.div
              key="icon"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Icon className="w-5 h-5" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      
      <div className="flex-1">
        <h4 className={`font-medium ${isActive ? config.color : isCompleted ? 'text-emerald-500' : 'text-muted-foreground'}`}>
          {config.title}
        </h4>
        <p className="text-sm text-muted-foreground">
          {config.description}
        </p>
      </div>
    </motion.div>
  );
};

const ResearchProcess: React.FC<ResearchProcessProps> = ({ 
  processState, 
  className = '' 
}) => {
  const steps: ProcessStep[] = [
    'generating-queries',
    'searching-web', 
    'reflecting',
    'synthesizing'
  ];

  const currentStepIndex = steps.indexOf(processState.currentStep);
  
  const getStepStatus = (stepIndex: number) => {
    if (processState.currentStep === 'error') {
      return stepIndex <= currentStepIndex ? 'error' : 'pending';
    }
    if (processState.currentStep === 'completed') {
      return 'completed';
    }
    if (stepIndex < currentStepIndex) {
      return 'completed';
    }
    if (stepIndex === currentStepIndex) {
      return 'active';
    }
    return 'pending';
  };

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Search className="w-5 h-5" />
            <span>Research Process</span>
          </CardTitle>
          <Badge variant={processState.currentStep === 'completed' ? 'default' : 'secondary'}>
            Iteration {processState.iterations} / {processState.maxIterations}
          </Badge>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Progress</span>
            <span>{Math.round(processState.progress)}%</span>
          </div>
          <Progress value={processState.progress} className="h-2" />
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Process Steps */}
        <div className="space-y-4">
          {steps.map((step, index) => {
            const status = getStepStatus(index);
            return (
              <ProcessStep
                key={step}
                step={step}
                isActive={status === 'active'}
                isCompleted={status === 'completed'}
                index={index}
              />
            );
          })}
        </div>

        <Separator />

        {/* Current Activity Details */}
        <AnimatePresence mode="wait">
          <motion.div
            key={processState.currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {/* Generated Queries */}
            {processState.generatedQueries.length > 0 && (
              <div>
                <h4 className="font-medium text-sm mb-2 flex items-center">
                  <Target className="w-4 h-4 mr-2" />
                  Generated Search Queries
                </h4>
                <div className="space-y-2">
                  {processState.generatedQueries.map((query, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center space-x-2"
                    >
                      <ArrowRight className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                      <span className="text-sm bg-muted px-2 py-1 rounded">
                        {query}
                      </span>
                      {processState.currentSearchQuery === query && (
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        >
                          <Badge variant="outline" className="text-xs">
                            searching...
                          </Badge>
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Search Results Counter */}
            {processState.searchResults > 0 && (
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium">Sources Found</span>
                </div>
                <motion.div
                  key={processState.searchResults}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-lg font-bold text-green-500"
                >
                  {processState.searchResults}
                </motion.div>
              </div>
            )}

            {/* Reflection Notes */}
            {processState.reflectionNotes.length > 0 && (
              <div>
                <h4 className="font-medium text-sm mb-2 flex items-center">
                  <Lightbulb className="w-4 h-4 mr-2" />
                  Analysis Insights
                </h4>
                <div className="space-y-2">
                  {processState.reflectionNotes.map((note, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="text-sm p-2 bg-amber-500/10 border border-amber-500/20 rounded"
                    >
                      {note}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Error Display */}
            {processState.error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg"
              >
                <div className="flex items-center space-x-2">
                  <Target className="w-4 h-4 text-destructive" />
                  <span className="text-sm font-medium text-destructive">Error</span>
                </div>
                <p className="text-sm text-destructive/80 mt-1">
                  {processState.error}
                </p>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

export default ResearchProcess;