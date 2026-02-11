import React, { createContext, useContext, useState } from "react";

const TabsContext = createContext(null);


export function Tabs({ defaultValue = undefined, value: controlledValue, onValueChange, children, className = "" }) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const value = controlledValue !== undefined ? controlledValue : internalValue;
  const setValue = (v) => {
    if (typeof onValueChange === 'function') onValueChange(v);
    else setInternalValue(v);
  };

  return (
    <TabsContext.Provider value={{ value, setValue }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ children, className = "" }) {
  return (
    <div className={`flex gap-2 border-b pb-2 ${className}`}>
      {children}
    </div>
  );
}

export function TabsTrigger({ value, children, className = "" }) {
  const { value: active, setValue } = useContext(TabsContext);

  const isActive = active === value;

  return (
    <button
      onClick={() => setValue(value)}
      className={`${className} px-4 py-2 rounded-xl text-sm font-medium transition
        ${isActive
          ? "bg-primary text-white"
          : "bg-muted text-muted-foreground hover:bg-muted/70"
        }`}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, children, className = "" }) {
  const { value: active } = useContext(TabsContext);

  if (active !== value) return null;

  return <div className={`mt-4 ${className}`}>{children}</div>;
}
