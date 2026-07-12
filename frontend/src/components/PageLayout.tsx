import { ReactNode } from 'react';
import Navbar from './Navbar';
import { LucideIcon } from 'lucide-react';

interface PageLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  actions?: ReactNode;
  gradient?: boolean;
}

export default function PageLayout({ 
  children, 
  title, 
  subtitle, 
  icon: Icon, 
  actions,
  gradient = true 
}: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <Navbar activePage="dashboard" />
      
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Glassmorphism */}
        <div className="backdrop-blur-xl bg-white/70 border border-white/40 rounded-3xl p-6 sm:p-8 mb-8 shadow-xl shadow-blue-500/5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              {Icon && (
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur-xl opacity-30 animate-pulse"></div>
                  <div className="relative p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl shadow-lg shadow-blue-500/25">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              )}
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  {title}
                </h1>
                {subtitle && (
                  <p className="text-slate-500 text-sm mt-0.5 font-medium">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>
            {actions && (
              <div className="flex items-center gap-3 flex-wrap">
                {actions}
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
      </main>
    </div>
  );
}