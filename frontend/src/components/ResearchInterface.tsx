import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Send, 
  Brain, 
  Settings, 
  Sparkles,
  AlertCircle,
  RefreshCw 
} from 'lucide-react';
import { researchApi } from '../utils/api';
import { ResearchResponse } from '../types';
import ResearchProcess, { ProcessState, ProcessStep } from './ResearchProcess';
import ResearchResults from './ResearchResults';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import ThemeToggle from './ThemeToggle';

const ResearchInterface: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResearchResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [maxLoops, setMaxLoops] = useState(2);
  const [initialQueries, setInitialQueries] = useState(3);
  const [showSettings, setShowSettings] = useState(false);

  // Process state for visualization
  const [processState, setProcessState] = useState<ProcessState>({
    currentStep: 'idle',
    progress: 0,
    generatedQueries: [],
    searchResults: 0,
    reflectionNotes: [],
    iterations: 0,
    maxIterations: 2
  });

  // Simulate process updates (in a real app, this would come from WebSocket or polling)
  const simulateProcessUpdates = useCallback(async () => {
    const steps: ProcessStep[] = ['generating-queries', 'searching-web', 'reflecting', 'synthesizing'];
    
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      const progress = ((i + 1) / steps.length) * 100;
      
      setProcessState(prev => ({
        ...prev,
        currentStep: step,
        progress: Math.min(progress, 95),
        iterations: prev.iterations + (step === 'generating-queries' && i > 0 ? 1 : 0)
      }));

      // Simulate step-specific updates
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
      
      if (step === 'generating-queries') {
        setProcessState(prev => ({
          ...prev,
          generatedQueries: [
            `${query} latest developments 2024`,
            `${query} comprehensive overview`,
            `${query} expert analysis research`,
          ]
        }));
      } else if (step === 'searching-web') {
        setProcessState(prev => ({
          ...prev,
          currentSearchQuery: prev.generatedQueries[Math.floor(Math.random() * prev.generatedQueries.length)],
          searchResults: prev.searchResults + Math.floor(Math.random() * 5) + 2
        }));
      } else if (step === 'reflecting') {
        setProcessState(prev => ({
          ...prev,
          reflectionNotes: [
            'Found comprehensive information on key aspects',
            'Identified potential knowledge gaps in recent developments',
            'Multiple perspectives available from reliable sources'
          ]
        }));
      }
    }

    setProcessState(prev => ({
      ...prev,
      currentStep: 'completed',
      progress: 100
    }));
  }, [query]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || loading) return;

    setLoading(true);
    setError(null);
    setResult(null);
    
    // Reset process state
    setProcessState({
      currentStep: 'generating-queries',
      progress: 0,
      generatedQueries: [],
      searchResults: 0,
      reflectionNotes: [],
      iterations: 1,
      maxIterations: maxLoops
    });

    // Start process simulation
    simulateProcessUpdates();

    try {
      const response = await researchApi.conductResearch({
        query: query.trim(),
        max_research_loops: maxLoops,
        initial_search_query_count: initialQueries,
      });
      
      setResult(response);
      setProcessState(prev => ({
        ...prev,
        currentStep: 'completed',
        progress: 100,
        iterations: response.iterations || prev.iterations
      }));
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'An error occurred during research';
      setError(errorMessage);
      setProcessState(prev => ({
        ...prev,
        currentStep: 'error',
        error: errorMessage
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
    setProcessState({
      currentStep: 'idle',
      progress: 0,
      generatedQueries: [],
      searchResults: 0,
      reflectionNotes: [],
      iterations: 0,
      maxIterations: maxLoops
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          {/* Theme Toggle */}
          <div className="flex justify-end">
            <ThemeToggle />
          </div>
          
          <div className="text-center space-y-4">
            <motion.div
              className="flex items-center justify-center space-x-3"
              whileHover={{ scale: 1.02 }}
            >
            <motion.div
              animate={{
                rotate: [0, 180, 360],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }}
            >
              <Brain className="w-8 h-8 text-primary" />
            </motion.div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Deep Research Agent
            </h1>
          </motion.div>
          
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-xl text-muted-foreground max-w-2xl mx-auto"
            >
              Ask complex questions and get comprehensive, well-researched answers with live process visualization
            </motion.p>
          </div>
        </motion.div>

        {/* Research Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-2 border-primary/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Search className="w-5 h-5" />
                  <span>Research Query</span>
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSettings(!showSettings)}
                  className="flex items-center space-x-2"
                >
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <Textarea
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Enter your research question... (e.g., 'What are the latest developments in quantum computing and their potential applications?')"
                    className="min-h-[120px] text-base resize-none pr-12"
                    disabled={loading}
                  />
                  <motion.div
                    className="absolute bottom-3 right-3"
                    animate={query.length > 0 ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    <Sparkles className={`w-5 h-5 ${query.length > 10 ? 'text-primary' : 'text-muted-foreground'}`} />
                  </motion.div>
                </div>

                {/* Settings Panel */}
                <AnimatePresence>
                  {showSettings && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <Separator className="mb-4" />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Research Depth</label>
                          <Select value={maxLoops.toString()} onValueChange={(value) => setMaxLoops(parseInt(value))}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">Quick (1 loop)</SelectItem>
                              <SelectItem value="2">Standard (2 loops)</SelectItem>
                              <SelectItem value="3">Thorough (3 loops)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Initial Queries</label>
                          <Select value={initialQueries.toString()} onValueChange={(value) => setInitialQueries(parseInt(value))}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="2">Focused (2 queries)</SelectItem>
                              <SelectItem value="3">Balanced (3 queries)</SelectItem>
                              <SelectItem value="4">Broad (4 queries)</SelectItem>
                              <SelectItem value="5">Comprehensive (5 queries)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {result && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleReset}
                        className="flex items-center space-x-2"
                      >
                        <RefreshCw className="w-4 h-4" />
                        <span>New Research</span>
                      </Button>
                    )}
                  </div>
                  
                  <Button
                    type="submit"
                    disabled={!query.trim() || loading}
                    className="flex items-center space-x-2 min-w-[140px]"
                  >
                    <AnimatePresence mode="wait">
                      {loading ? (
                        <motion.div
                          key="loading"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center space-x-2"
                        >
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          >
                            <Brain className="w-4 h-4" />
                          </motion.div>
                          <span>Researching...</span>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="search"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center space-x-2"
                        >
                          <Send className="w-4 h-4" />
                          <span>Start Research</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Process Visualization */}
        <AnimatePresence>
          {(loading || result || error) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              {/* Process Panel */}
              <div className="lg:col-span-1">
                <ResearchProcess processState={processState} />
              </div>

              {/* Results Panel */}
              <div className="lg:col-span-2">
                <AnimatePresence mode="wait">
                  {error && (
                    <motion.div
                      key="error"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                    >
                      <Card className="border-destructive/50 bg-destructive/5">
                        <CardContent className="p-6">
                          <div className="flex items-center space-x-3">
                            <AlertCircle className="w-6 h-6 text-destructive flex-shrink-0" />
                            <div>
                              <h3 className="font-semibold text-destructive">Research Failed</h3>
                              <p className="text-sm text-destructive/80 mt-1">{error}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}

                  {result && processState.currentStep === 'completed' && (
                    <motion.div
                      key="results"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <ResearchResults result={result} query={query} />
                    </motion.div>
                  )}

                  {loading && !result && (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center justify-center h-64"
                    >
                      <div className="text-center space-y-4">
                        <motion.div
                          animate={{
                            rotate: [0, 180, 360],
                            scale: [1, 1.2, 1],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        >
                          <Brain className="w-12 h-12 text-primary mx-auto" />
                        </motion.div>
                        <div>
                          <h3 className="text-lg font-semibold">AI Research in Progress</h3>
                          <p className="text-muted-foreground">
                            The agent is working on your research query...
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ResearchInterface;