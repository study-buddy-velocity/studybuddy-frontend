import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

interface MessageBubbleProps {
  content: string; // Markdown and Math content
  isUser: boolean;
  avatarSrc: string;
}

// Function to format content dynamically
function formatContentWithMath(rawContent: string): string {
  // Replace math expressions wrapped in `( ... )` with LaTeX inline math notation `\( ... \)`
  const formattedContent = rawContent
    .replace(/\(\\frac{([^}]+)}{([^}]+)}\)/g, "\\( \\frac{$1}{$2} \\)")
    .replace(
      /\(\\frac{([^}]+)}{([^}]+)} \\\times \\frac{([^}]+)}{([^}]+)} = \\frac{([^}]+)}{([^}]+)}\)/g,
      "\\( \\frac{$1}{$2} \\times \\frac{$3}{$4} = \\frac{$5}{$6} \\)"
    )
    .replace(
      /\(\\frac{([^}]+)}{([^}]+)} \\\div \\frac{([^}]+)}{([^}]+)} = \\frac{([^}]+)}{([^}]+)}\)/g,
      "\\( \\frac{$1}{$2} \\div \\frac{$3}{$4} = \\frac{$5}{$6} \\)"
    );
  return formattedContent;
}

export function MessageBubble({ content, isUser }: MessageBubbleProps) {
  // const formattedContent = formatContentWithMath(content); // Apply formatting before rendering
  let formattedContent = "";
  const handleContentFormatting = (content:string) => {
    if (content) {
       formattedContent = formatContentWithMath(content);
      return formattedContent;
    } else {
      formattedContent = "Please ask relevant Questions."
      return formattedContent; 
    }
  };
  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : ""}`}>
      {!isUser && (
        <Avatar>
          <AvatarImage src='/assets/buddy/Joy-profile-icon.svg'/>
          <AvatarFallback>AI</AvatarFallback>
        </Avatar>
      )}
      <div
        className={`rounded-2xl p-4 max-w-[80%] ${
          isUser
            ? "bg-gradient-to-r from-[#4024B9] to-[#8640FF] text-white"
            : "bg-[#232323] text-[#E6E6E6] border border-[#C6C6C682]"
        }`}
      >
        <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
          {/* {formattedContent} */}
          {handleContentFormatting(content)}
        </ReactMarkdown>
      </div>
      {isUser && (
        <Avatar>
          <AvatarImage src="/assets/buddy/default_profile_pic.png"  />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
