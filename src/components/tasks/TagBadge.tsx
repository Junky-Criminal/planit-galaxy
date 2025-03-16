
import React from "react";
import { cn } from "@/lib/utils";
import { TagType, tagColors } from "@/context/TaskContext";

interface TagBadgeProps {
  tag: TagType;
  className?: string;
}

const TagBadge = ({ tag, className }: TagBadgeProps) => {
  const baseStyles = "px-2.5 py-0.5 rounded-full text-xs font-medium";
  
  const getTagStyles = (tag: TagType) => {
    switch (tag) {
      case "work":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "personal":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case "health":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "finance":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "education":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
      case "social":
        return "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300";
      case "home":
        return "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300";
      case "other":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };
  
  const tagStyle = getTagStyles(tag);
  
  return (
    <span className={cn(baseStyles, tagStyle, className)}>
      {tag.charAt(0).toUpperCase() + tag.slice(1)}
    </span>
  );
};

export default TagBadge;
