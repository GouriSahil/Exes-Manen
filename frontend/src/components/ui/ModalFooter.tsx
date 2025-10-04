"use client";

import { ReactNode } from "react";

interface ModalFooterProps {
  children: ReactNode;
  className?: string;
}

export default function ModalFooter({
  children,
  className = "",
}: ModalFooterProps) {
  return (
    <div className={`flex justify-end space-x-3 mt-6 ${className}`}>
      {children}
    </div>
  );
}
