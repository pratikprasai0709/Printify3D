
import React from 'react';


const AdminDashboard: React.FC = () => {
  const stats = [
    { label: 'Total Revenue', value: 'Rs. 12,450', trend: '+12%', color: 'blue' },
    { label: 'New Designs', value: '142', trend: '+5%', color: 'teal' },
    { label: 'Active Models', value: '12', trend: '0%', color: 'slate' },
    { label: 'Pending Orders', value: '28', trend: '-2%', color: 'coral' },
  ];

  const recentOrders = [
    { id: '#ORD-9821', customer: 'Alice Johnson', model: 'Eco-Flask', status: 'Processing', date: '2h ago' },
    { id: '#ORD-9820', customer: 'Mark Smith', model: 'Wanderer', status: 'Shipped', date: '5h ago' },
    { id: '#ORD-9819', customer: 'Sarah Lee', model: 'Glass Pure', status: 'Pending', date: 'Yesterday' },
  ];

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-12">
        <h1 className="text-4xl font-extrabold text-slate-900">Hey, Pratik</h1>
        <button className="px-6 py-2.5 bg-blue-600 text-white rounded-2xl font-bold text-sm shadow-md hover:bg-blue-700 transition-all">
          Add New Model
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((s, i) => (
          <div key={i} className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-50">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{s.label}</p>
            <div className="flex items-end justify-between">
              <h2 className="text-3xl font-black text-slate-800">{s.value}</h2>
              <span className={`text-xs font-bold px-2 py-1 rounded-lg ${s.trend.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                {s.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Orders Table */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] shadow-sm border border-slate-50 overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-800">Recent Orders</h3>
            <button className="text-sm font-bold text-blue-600 hover:underline">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Customer</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Model</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {recentOrders.map((order, i) => (
                  <tr key={i} className="hover:bg-slate-50/30 transition-colors">
                    <td className="px-8 py-6 font-bold text-sm text-slate-500">{order.id}</td>
                    <td className="px-8 py-6 font-bold text-sm text-slate-800">{order.customer}</td>
                    <td className="px-8 py-6 text-sm text-slate-600">{order.model}</td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${order.status === 'Shipped' ? 'bg-blue-50 text-blue-600' : order.status === 'Processing' ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-600'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-sm text-slate-400">{order.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Popular Models */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-50 p-8">
           <h3 className="text-lg font-bold text-slate-800 mb-6">Trending Models</h3>
           <div className="space-y-6">
              {[
                { name: 'Eco-Flask', orders: 45, img: '/bottle1.jpg' },
                { name: 'The Wanderer', orders: 32, img: '/bottle2.jpg' },
                { name: 'Slim Urban', orders: 18, img: 'bottle-4943214_640.jpg' },
              ].map((m, i) => (
                <div key={i} className="flex items-center gap-4">
                   <img src={m.img} alt={m.name} className="w-14 h-14 rounded-2xl object-cover shadow-sm" />
                   <div className="flex-1">
                      <h4 className="font-bold text-slate-800 text-sm">{m.name}</h4>
                      <p className="text-xs text-slate-400">{m.orders} customizations this week</p>
                   </div>
                   <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
                </div>
              ))}
           </div>
           
           
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
