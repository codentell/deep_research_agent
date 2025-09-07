import { ResearchResponse } from '../types';

export const downloadAsMarkdown = (result: ResearchResponse, query: string) => {
  const timestamp = new Date().toLocaleDateString();
  
  let markdown = `# Research Report: ${query}\n\n`;
  markdown += `**Generated on:** ${timestamp}\n`;
  markdown += `**Research Iterations:** ${result.iterations}\n`;
  markdown += `**Status:** ${result.status}\n\n`;
  markdown += `---\n\n`;
  markdown += `## Research Answer\n\n${result.answer}\n\n`;
  
  if (result.sources && result.sources.length > 0) {
    markdown += `## Sources\n\n`;
    result.sources.forEach((source, index) => {
      markdown += `${index + 1}. **${source.title || 'Untitled'}**\n`;
      markdown += `   - URL: ${source.short_url}\n`;
      if (source.value) {
        markdown += `   - Content: ${source.value.substring(0, 200)}...\n`;
      }
      markdown += `\n`;
    });
  }
  
  const blob = new Blob([markdown], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `research-${query.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}-${Date.now()}.md`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const downloadAsJSON = (result: ResearchResponse, query: string) => {
  const data = {
    query,
    timestamp: new Date().toISOString(),
    result
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `research-${query.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}-${Date.now()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return successful;
    }
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
};

export const formatResultForClipboard = (result: ResearchResponse, query: string): string => {
  const timestamp = new Date().toLocaleDateString();
  
  let text = `Research Query: ${query}\n`;
  text += `Generated: ${timestamp}\n`;
  text += `Iterations: ${result.iterations}\n`;
  text += `Status: ${result.status}\n\n`;
  text += `RESEARCH ANSWER:\n${result.answer}\n\n`;
  
  if (result.sources && result.sources.length > 0) {
    text += `SOURCES:\n`;
    result.sources.forEach((source, index) => {
      text += `${index + 1}. ${source.title || 'Untitled'}\n`;
      text += `   ${source.short_url}\n`;
      if (source.value) {
        text += `   ${source.value.substring(0, 150)}...\n`;
      }
      text += `\n`;
    });
  }
  
  return text;
};