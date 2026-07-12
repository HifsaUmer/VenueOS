import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  color?: 'blue' | 'purple' | 'green' | 'orange' | 'red' | 'pink' | 'teal';
  change?: string;
  changeType?: 'up' | 'down';
  delay?: number;
}

const colorConfig = {
  blue: { bg: 'bg-blue-50/80', icon: 'text-blue-600', border: 'border-blue-100', gradient: 'from-blue-500 to-blue-600' },
  purple: { bg: 'bg-purple-50/80', icon: 'text-purple-600', border: 'border-purple-100', gradient: 'from-purple-500 to-purple-600' },
  green: { bg: 'bg-green-50/80', icon: 'text-green-600', border: 'border-green-100', gradient: 'from-green-500 to-green-600' },
  orange: { bg: 'bg-orange-50/80', icon: 'text-orange-600', border: 'border-orange-100', gradient: 'from-orange-500 to-orange-600' },
  red: { bg: 'bg-red-50/80', icon: 'text-red-600', border: 'border-red-100', gradient: 'from-red-500 to-red-600' },
  pink: { bg: 'bg-pink-50/80', icon: 'text-pink-600', border: 'border-pink-100', gradient: 'from-pink-500 to-pink-600' },
  teal: { bg: 'bg-teal-50/80', icon: 'text-teal-600', border: 'border-teal-100', gradient: 'from-teal-500 to-teal-600' },
};

export default function StatsCard({ 
  label, 
  value, 
  icon: Icon, 
  color = 'blue', 
  change, 
  changeType = 'up',
  delay = 0
}: StatsCardProps) {
  const config = colorConfig[color];
  
  return (
    <div 
      className={`group bg-white/80 backdrop-blur-sm border ${config.border} rounded-2xl p-6 hover:shadow-xl transition-all duration-500 hover:-translate-y-1 animate-fade-in-up`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1 tracking-tight">
            {value}
          </p>
          {change && (
            <div className="flex items-center gap-1 mt-2">
              <span className={`text-xs font-semibold ${changeType === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {change}
              </span>
              <span className="text-xs text-slate-400">vs last month</span>
            </div>
          )}
        </div>
        <div className={`relative ${config.bg} rounded-xl p-3 group-hover:scale-110 transition-transform duration-300`}>
          <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} rounded-xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity`}></div>
          <Icon className={`w-6 h-6 ${config.icon} relative z-10`} />
        </div>
      </div>
    </div>
  );
}