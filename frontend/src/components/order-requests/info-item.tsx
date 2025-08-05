import React from "react";

interface InfoItemProps {
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  isClickable?: boolean;
  onClick?: () => void;
}

export function InfoItem({
  icon: Icon,
  children,
  isClickable = false,
  onClick,
}: InfoItemProps) {
  const baseClasses = "flex items-center text-sm text-gray-300";
  const clickableClasses = isClickable
    ? "hover:text-white transition-colors cursor-pointer underline-offset-2 hover:underline"
    : "";

  const content = (
    <>
      <Icon className="w-4 h-4 mr-2 shrink-0" />
      {children}
    </>
  );

  if (isClickable && onClick) {
    return (
      <div className={baseClasses}>
        <Icon className="w-4 h-4 mr-2 shrink-0" />
        <button onClick={onClick} className={clickableClasses}>
          {children}
        </button>
      </div>
    );
  }

  return <div className={baseClasses}>{content}</div>;
}
