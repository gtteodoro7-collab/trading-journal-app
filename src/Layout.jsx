import React from 'react';
import { Toaster } from "sonner";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-slate-950">
      <style>{`
        :root {
          --background: 222.2 84% 4.9%;
          --foreground: 210 40% 98%;
          --card: 222.2 84% 4.9%;
          --card-foreground: 210 40% 98%;
          --popover: 222.2 84% 4.9%;
          --popover-foreground: 210 40% 98%;
          --primary: 142.1 76.2% 36.3%;
          --primary-foreground: 355.7 100% 97.3%;
          --secondary: 217.2 32.6% 17.5%;
          --secondary-foreground: 210 40% 98%;
          --muted: 217.2 32.6% 17.5%;
          --muted-foreground: 215 20.2% 65.1%;
          --accent: 217.2 32.6% 17.5%;
          --accent-foreground: 210 40% 98%;
          --destructive: 0 62.8% 30.6%;
          --destructive-foreground: 210 40% 98%;
          --border: 217.2 32.6% 17.5%;
          --input: 217.2 32.6% 17.5%;
          --ring: 142.1 76.2% 36.3%;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: #0f172a;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #334155;
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: #475569;
        }
        
        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }
        
        /* Selection color */
        ::selection {
          background: rgba(16, 185, 129, 0.3);
          color: white;
        }
      `}</style>
      
      {children}
      
      <Toaster 
        position="bottom-right" 
        theme="dark"
        toastOptions={{
          style: {
            background: '#1e293b',
            border: '1px solid #334155',
            color: '#f1f5f9'
          }
        }}
      />
    </div>
  );
}