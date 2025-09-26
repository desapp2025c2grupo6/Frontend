import React from 'react';
export function Select({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} style={{ padding: '8px', borderRadius: 4, border: '1px solid #ccc' }}>{children}</select>;
}
export function SelectContent({ children }: { children: React.ReactNode }) { return <>{children}</>; }
export function SelectItem({ value, children }: { value: string, children: React.ReactNode }) { return <option value={value}>{children}</option>; }
export function SelectTrigger({ children }: { children: React.ReactNode }) { return <>{children}</>; }
export function SelectValue() { return null; }
