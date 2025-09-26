import * as React from "react";

export function Dialog({ open, onOpenChange, children }) {
  return open ? <div className="dialog-overlay">{children}</div> : null;
}

export function DialogContent({ children, className }) {
  return <div className={className || "dialog-content"}>{children}</div>;
}

export function DialogHeader({ children }) {
  return <div className="dialog-header">{children}</div>;
}

export function DialogTitle({ children }) {
  return <h2 className="dialog-title">{children}</h2>;
}

export function DialogTrigger({ asChild, children }) {
  return <button>{children}</button>;
}
