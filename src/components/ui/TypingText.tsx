import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

interface TypingTextProps {
  text: string;
  speed?: number;
}

const TypingText: React.FC<TypingTextProps> = ({ text, speed = 30 }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setDisplayedText("");
    setIsComplete(false);
    let currentText = "";
    let currentIndex = 0;

    const typeNextCharacter = () => {
      if (currentIndex < text.length) {
        // Handle markdown special characters
        let charsToAdd = 1;
        
        // Handle markdown bold/italic markers
        if (text[currentIndex] === '*' || text[currentIndex] === '_') {
          charsToAdd = 2;
        }
        // Handle markdown code blocks
        else if (text.slice(currentIndex).startsWith('```')) {
          charsToAdd = 3;
        }
        // Handle math expressions
        else if (text.slice(currentIndex).startsWith('$$')) {
          const endIndex = text.indexOf('$$', currentIndex + 2);
          if (endIndex !== -1) {
            charsToAdd = endIndex + 2 - currentIndex;
          }
        }

        currentText = text.slice(0, currentIndex + charsToAdd);
        setDisplayedText(currentText);
        currentIndex += charsToAdd;

        timeoutRef.current = setTimeout(typeNextCharacter, speed);
      } else {
        setIsComplete(true);
      }
    };

    timeoutRef.current = setTimeout(typeNextCharacter, speed);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [text, speed]);

  if (isComplete) {
    return (
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
      >
        {text}
      </ReactMarkdown>
    );
  }

  return (
    <ReactMarkdown
      remarkPlugins={[remarkMath]}
      rehypePlugins={[rehypeKatex]}
    >
      {displayedText}
    </ReactMarkdown>
  );
};

export default TypingText;