import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';
import { Bot, User } from 'lucide-react';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isAssistant = message.role === 'assistant';
  
  return (
    <div
      className={cn(
        'flex gap-3 p-4 rounded-lg',
        isAssistant ? 'bg-muted/50' : 'bg-primary/5'
      )}
    >
      <div
        className={cn(
          'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
          isAssistant ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
        )}
      >
        {isAssistant ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs text-muted-foreground mb-1">
          {isAssistant ? 'Asistente RUPECO' : 'Tú'}
        </div>
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
