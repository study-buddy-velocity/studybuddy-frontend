import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

interface MessageBubbleProps {
  content: string;
  isUser: boolean;
  avatarSrc?: string;
  isTyping?: boolean;
}

type CustomComponentProps = {
  node?: any;
  className?: string;
  children?: React.ReactNode;
}

type CodeProps = CustomComponentProps & {
  inline?: boolean;
}

export function MessageBubble({ content, isUser, avatarSrc, isTyping }: MessageBubbleProps) {
  // Process the content to properly handle LaTeX
  const processContent = (text: string) => {
    return text.replace(/\\\((.*?)\\\)/g, '$$$1$$')
           .replace(/\\\[(.*?)\\\]/g, '$$$$1$$');
  };

  const formattedContent = content ? processContent(content) : "Please ask relevant questions.";

  const customComponents = {
    h1: ({children, ...props}: CustomComponentProps) => (
      <h1 className="text-xl font-bold my-4" {...props}>{children}</h1>
    ),
    h2: ({children, ...props}: CustomComponentProps) => (
      <h2 className="text-lg font-bold my-3" {...props}>{children}</h2>
    ),
    h3: ({children, ...props}: CustomComponentProps) => (
      <h3 className="text-md font-bold my-2" {...props}>{children}</h3>
    ),
    p: ({children, ...props}: CustomComponentProps) => (
      <p className="my-2 whitespace-pre-wrap" {...props}>{children}</p>
    ),
    ul: ({children, ...props}: CustomComponentProps) => (
      <ul className="list-disc pl-6 my-2" {...props}>{children}</ul>
    ),
    ol: ({children, ...props}: CustomComponentProps) => (
      <ol className="list-decimal pl-6 my-2" {...props}>{children}</ol>
    ),
    li: ({children, ...props}: CustomComponentProps) => (
      <li className="my-1" {...props}>{children}</li>
    ),
    code: ({inline, children, ...props}: CodeProps) => {
      if (inline) {
        return (
          <code className="bg-gray-800 px-1 rounded" {...props}>
            {children}
          </code>
        );
      }
      return (
        <code className="block bg-gray-800 p-2 rounded my-2 overflow-x-auto" {...props}>
          {children}
        </code>
      );
    }
  };

  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <Avatar>
          <AvatarImage src="/assets/buddy/Joy-profile-icon.svg" alt="AI" />
          <AvatarFallback>AI</AvatarFallback>
        </Avatar>
      )}
      
      <div
        className={`rounded-2xl p-4 max-w-[80%] overflow-auto ${
          isUser
            ? "bg-gradient-to-r from-[#4024B9] to-[#8640FF] text-white"
            : "bg-[#232323] text-[#E6E6E6] border border-[#C6C6C682]"
        }`}
      >
        {isTyping ? (
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-400" />
          </div>
        ) : (
          <ReactMarkdown
            remarkPlugins={[remarkMath]}
            rehypePlugins={[rehypeKatex]}
            components={customComponents}
          >
            {formattedContent}
          </ReactMarkdown>
        )}
      </div>

      {isUser && (
        <Avatar>
          <AvatarImage src={avatarSrc || "/assets/buddy/default_profile_pic.png"} alt="User" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}

export default MessageBubble;