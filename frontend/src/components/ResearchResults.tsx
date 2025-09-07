import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  ExternalLink, 
  Clock, 
  CheckCircle2, 
  Download, 
  Copy, 
  FileDown,
  Image,
  Globe
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ResearchResponse, Source as SourceType } from '../types';
import { downloadAsMarkdown, downloadAsJSON, copyToClipboard, formatResultForClipboard } from '../utils/download';
import { useToast } from '../hooks/useToast';
import { ToastContainer } from './Toast';

interface ResearchResultsProps {
  result: ResearchResponse;
  query?: string;
  className?: string;
}

const SourceCard: React.FC<{
  source: SourceType;
  index: number;
}> = ({ source, index }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const getFaviconUrl = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    } catch {
      return null;
    }
  };

  const faviconUrl = getFaviconUrl(source.short_url);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      className="group"
    >
      <Card className="h-full transition-all duration-200 hover:shadow-md border-muted">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3 mb-2">
            {/* Favicon/Icon */}
            <div className="flex-shrink-0 w-8 h-8 rounded-md overflow-hidden bg-muted flex items-center justify-center">
              {faviconUrl && !imageError ? (
                <img
                  src={faviconUrl}
                  alt=""
                  className={`w-6 h-6 transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setImageError(true)}
                />
              ) : null}
              {(!faviconUrl || imageError || !imageLoaded) && (
                <Globe className="w-4 h-4 text-muted-foreground" />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <motion.h4 
                className="font-medium text-sm text-foreground mb-1 line-clamp-2"
                layoutId={`source-title-${index}`}
              >
                {source.title || 'Untitled Source'}
              </motion.h4>
              <motion.p 
                className="text-xs text-muted-foreground break-all line-clamp-2 mb-2"
                layoutId={`source-url-${index}`}
              >
                {source.value}
              </motion.p>
            </div>
            <motion.a
              href={source.value}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 text-primary hover:text-primary/80 transition-colors flex-shrink-0"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ExternalLink size={14} />
            </motion.a>
          </div>
          
          {source.short_url && (
            <Badge variant="outline" className="text-xs">
              {source.short_url}
            </Badge>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

const ResearchResults: React.FC<ResearchResultsProps> = ({ 
  result,
  query = 'Research Query',
  className = ''
}) => {
  const { toasts, addToast, removeToast } = useToast();

  const handleCopyResult = async () => {
    const text = formatResultForClipboard(result, query);
    const success = await copyToClipboard(text);
    if (success) {
      addToast('Research results copied to clipboard!', 'success');
    } else {
      addToast('Failed to copy to clipboard', 'error');
    }
  };

  const handleDownloadMarkdown = () => {
    try {
      downloadAsMarkdown(result, query);
      addToast('Research downloaded as Markdown!', 'success');
    } catch (error) {
      addToast('Failed to download file', 'error');
    }
  };

  const handleDownloadJSON = () => {
    try {
      downloadAsJSON(result, query);
      addToast('Research downloaded as JSON!', 'success');
    } catch (error) {
      addToast('Failed to download file', 'error');
    }
  };

  return (
    <>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`space-y-6 ${className}`}
    >
      {/* Research Summary Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 1, delay: 0.5 }}
                >
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                </motion.div>
                <span>Research Complete</span>
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{result.iterations} iteration{result.iterations !== 1 ? 's' : ''}</span>
                </Badge>
                <Badge 
                  variant={result.status === 'completed' ? 'default' : 'destructive'}
                >
                  {result.status}
                </Badge>
              </div>
            </div>
          </CardHeader>
        </Card>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="flex flex-wrap gap-3"
      >
        <Button
          onClick={handleCopyResult}
          variant="outline"
          size="sm"
          className="flex items-center space-x-2"
        >
          <Copy className="w-4 h-4" />
          <span>Copy Results</span>
        </Button>
        
        <Button
          onClick={handleDownloadMarkdown}
          variant="outline"
          size="sm"
          className="flex items-center space-x-2"
        >
          <FileDown className="w-4 h-4" />
          <span>Download MD</span>
        </Button>
        
        <Button
          onClick={handleDownloadJSON}
          variant="outline"
          size="sm"
          className="flex items-center space-x-2"
        >
          <Download className="w-4 h-4" />
          <span>Download JSON</span>
        </Button>
      </motion.div>

      {/* Main Research Answer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-blue-500" />
              <span>Research Analysis</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="prose prose-sm max-w-none"
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  a: ({ href, children }) => (
                    <motion.a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary/80 underline inline-flex items-center space-x-1"
                      whileHover={{ scale: 1.05 }}
                    >
                      <span>{children}</span>
                      <ExternalLink className="w-3 h-3" />
                    </motion.a>
                  ),
                  h1: ({ children }) => (
                    <motion.h1
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                      className="text-2xl font-bold text-foreground mb-4"
                    >
                      {children}
                    </motion.h1>
                  ),
                  h2: ({ children }) => (
                    <motion.h2
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 }}
                      className="text-xl font-semibold text-foreground mb-3 mt-6"
                    >
                      {children}
                    </motion.h2>
                  ),
                  h3: ({ children }) => (
                    <motion.h3
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-lg font-semibold text-foreground mb-2 mt-4"
                    >
                      {children}
                    </motion.h3>
                  ),
                  p: ({ children }) => (
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="text-foreground leading-relaxed mb-4"
                    >
                      {children}
                    </motion.p>
                  ),
                  ul: ({ children }) => (
                    <motion.ul
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="list-disc list-inside space-y-2 mb-4"
                    >
                      {children}
                    </motion.ul>
                  ),
                  li: ({ children }) => (
                    <motion.li
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                      className="text-foreground"
                    >
                      {children}
                    </motion.li>
                  ),
                  blockquote: ({ children }) => (
                    <motion.blockquote
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="border-l-4 border-primary pl-4 italic text-muted-foreground my-4"
                    >
                      {children}
                    </motion.blockquote>
                  ),
                  code: ({ children, className }) => {
                    const isInline = !className;
                    return isInline ? (
                      <code className="bg-muted px-1 py-0.5 rounded text-sm font-mono">
                        {children}
                      </code>
                    ) : (
                      <motion.code
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className={className}
                      >
                        {children}
                      </motion.code>
                    );
                  },
                }}
              >
                {result.answer}
              </ReactMarkdown>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Sources Section */}
      {result.sources && result.sources.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-green-500" />
                  <span>Research Sources</span>
                </div>
                <Badge variant="outline">
                  {result.sources.length} source{result.sources.length !== 1 ? 's' : ''}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <motion.div
                className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
                variants={{
                  show: {
                    transition: {
                      staggerChildren: 0.1
                    }
                  }
                }}
                initial="hidden"
                animate="show"
              >
                <AnimatePresence>
                  {result.sources.map((source, index) => (
                    <SourceCard
                      key={index}
                      source={source}
                      index={index}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
    </>
  );
};

export default ResearchResults;