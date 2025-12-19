
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { UserProfile } from '../types';
import { Recycle, Globe, Zap, Heart } from 'lucide-react';

interface SustainabilityStatsProps {
  user: UserProfile;
}

const SustainabilityStats: React.FC<SustainabilityStatsProps> = ({ user }) => {
  const data = [
    { name: 'Saved CO2', value: user.co2Saved },
    { name: 'Average Target', value: 100 - user.co2Saved },
  ];
  const COLORS = ['#10b981', '#e2e8f0'];

  const impactData = [
    { month: 'Jan', co2: 2.4 },
    { month: 'Feb', co2: 5.1 },
    { month: 'Mar', co2: 8.9 },
    { month: 'Apr', co2: user.co2Saved },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 flex flex-col items-center justify-center text-center">
          <Recycle className="w-8 h-8 text-emerald-600 mb-2" />
          <span className="text-2xl font-bold text-emerald-800">{user.itemsSwapped}</span>
          <span className="text-xs text-emerald-600 font-medium">Items Reused</span>
        </div>
        <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 flex flex-col items-center justify-center text-center">
          <Globe className="w-8 h-8 text-blue-600 mb-2" />
          <span className="text-2xl font-bold text-blue-800">{user.co2Saved}kg</span>
          <span className="text-xs text-blue-600 font-medium">CO2 Prevented</span>
        </div>
        <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100 flex flex-col items-center justify-center text-center">
          <Zap className="w-8 h-8 text-orange-600 mb-2" />
          <span className="text-2xl font-bold text-orange-800">${(user.itemsSwapped * 25).toLocaleString()}</span>
          <span className="text-xs text-orange-600 font-medium">Estimated Savings</span>
        </div>
        <div className="bg-pink-50 p-6 rounded-2xl border border-pink-100 flex flex-col items-center justify-center text-center">
          <Heart className="w-8 h-8 text-pink-600 mb-2" />
          <span className="text-2xl font-bold text-pink-800">{user.reliabilityScore}</span>
          <span className="text-xs text-pink-600 font-medium">Community Trust</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Your Ecological Contribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="text-center -mt-36">
              <span className="text-3xl font-bold text-emerald-600">{user.co2Saved}</span>
              <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold">kg CO2</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Monthly Environmental Impact</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={impactData}>
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis hide />
                <Tooltip 
                  cursor={{fill: '#f1f5f9'}}
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="co2" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SustainabilityStats;
