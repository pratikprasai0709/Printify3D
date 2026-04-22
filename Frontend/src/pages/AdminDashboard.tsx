import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { addBottleApi, getBottlesApi, updateBottleApi, deleteBottleApi, getOrdersApi } from '../shared/config/api';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

const AdminDashboard: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingBottleId, setEditingBottleId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'analytics' | 'orders' | 'inventory'>('analytics');

  const [bottles, setBottles] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    price: ''
  });
  const [modelFile, setModelFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const modelFileInputRef = useRef<HTMLInputElement>(null);
  const thumbnailFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchBottles();
    fetchOrders();
  }, []);

  const fetchBottles = async () => {
    try {
      const res = await getBottlesApi();
      setBottles(res.data);
    } catch (e) {
      console.error("Failed to fetch bottles:", e);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await getOrdersApi();
      setOrders(res.data);
    } catch (e) {
      console.error("Failed to fetch orders:", e);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleModelFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setModelFile(e.target.files[0]);
    }
  };

  const handleThumbnailFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setThumbnailFile(e.target.files[0]);
    }
  };

  const openAddModal = () => {
    setIsEditMode(false);
    setEditingBottleId(null);
    setFormData({ name: '', type: '', price: '' });
    setModelFile(null);
    setThumbnailFile(null);
    if (modelFileInputRef.current) modelFileInputRef.current.value = '';
    if (thumbnailFileInputRef.current) thumbnailFileInputRef.current.value = '';
    setIsModalOpen(true);
  };

  const openEditModal = (bottle: any) => {
    setIsEditMode(true);
    setEditingBottleId(bottle._id);
    setFormData({
      name: bottle.name,
      type: bottle.type,
      price: bottle.price.toString()
    });
    setModelFile(null);
    setThumbnailFile(null);
    if (modelFileInputRef.current) modelFileInputRef.current.value = '';
    if (thumbnailFileInputRef.current) thumbnailFileInputRef.current.value = '';
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    const confirm = window.confirm(`Are you sure you want to delete ${name}?`);
    if (!confirm) return;

    try {
      await deleteBottleApi(id);
      toast.success("Model deleted successfully!");
      fetchBottles();
    } catch (e: any) {
      console.error(e);
      toast.error(e.response?.data?.message || "Failed to delete model");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // If adding new, files are required. If editing, they are optional.
    if (!isEditMode && !modelFile) {
      toast.error("Please upload a .glb model file");
      return;
    }
    if (!isEditMode && !thumbnailFile) {
      toast.error("Please upload a thumbnail image");
      return;
    }

    const data = new FormData();
    data.append('name', formData.name);
    data.append('type', formData.type);
    data.append('price', formData.price);
    if (modelFile) data.append('modelFile', modelFile);
    if (thumbnailFile) data.append('thumbnailFile', thumbnailFile);

    try {
      if (isEditMode && editingBottleId) {
        await updateBottleApi(editingBottleId, data);
        toast.success("Model updated successfully!");
      } else {
        await addBottleApi(data);
        toast.success("Model added successfully!");
      }
      setIsModalOpen(false);
      fetchBottles();
    } catch (e: any) {
      console.error(e);
      toast.error(e.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'add'} model`);
    }
  };

  const totalRevenue = orders.reduce((acc, curr) => acc + curr.amount, 0);

  const stats = [
    { label: 'Total Revenue', value: `Rs. ${totalRevenue.toLocaleString()}`, trend: '+10%', color: 'blue' },
    { label: 'Total Models', value: bottles.length.toString(), trend: '+5%', color: 'teal' },
    { label: 'Total Orders', value: orders.length.toString(), trend: '+12%', color: 'coral' },
  ];

  const recentOrders = orders.map(order => ({
    id: order.orderId || (order.transactionUuid ? order.transactionUuid.slice(-6) : order._id ? order._id.slice(-6) : 'N/A'),
    customer: order.customerName || "Guest",
    model: order.productName,
    status: order.paymentStatus,
    date: new Date(order.createdAt).toLocaleDateString(),
    amount: order.amount,
    phone: order.phoneNumber,
    designImage: order.designImage,
    bottlePreviewImage: order.bottlePreviewImage,
    address: order.address
  })).filter(order => {
    const q = searchQuery.toLowerCase();
    return (
      order.id.toString().toLowerCase().includes(q) ||
      order.customer.toLowerCase().includes(q) ||
      (order.model || "").toLowerCase().includes(q)
    );
  });

  // Group by date for line chart
  const revenueByDate = orders.reduce((acc: any, order) => {
    const date = new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    if (!acc[date]) acc[date] = 0;
    acc[date] += order.amount;
    return acc;
  }, {});

  const chartData = Object.keys(revenueByDate).map(date => ({
    date,
    revenue: revenueByDate[date]
  }));

  // Group by model for bar chart (approximated based on count)
  const ordersByModel = orders.reduce((acc: any, order) => {
    const modelName = order.productName || 'Unknown';
    if (!acc[modelName]) acc[modelName] = 0;
    acc[modelName] += 1;
    return acc;
  }, {});

  const barChartData = Object.keys(ordersByModel).map(modelName => ({
    name: modelName,
    sales: ordersByModel[modelName]
  })).slice(0, 5); // top 5

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-1">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Hey, Admin</h1>
          <p className="text-slate-500 font-medium">Manage your 3D customization empire here.</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-slate-100/50 backdrop-blur-sm p-1.5 rounded-[1.5rem] border border-slate-200/60 shadow-inner">
          {[
            {
              id: 'analytics', label: 'Analytics', icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              )
            },
            {
              id: 'orders', label: 'Orders', icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
              )
            },
            {
              id: 'inventory', label: 'Inventory', icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
              )
            }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl text-sm font-bold transition-all ${activeTab === tab.id
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
                }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Analytics Section */}
      {activeTab === 'analytics' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {stats.map((s, i) => (
              <div key={i} className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-50 flex flex-col justify-between hover:shadow-md transition-shadow">
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">{s.label}</p>
                <div className="flex items-end justify-between">
                  <h2 className="text-4xl font-black text-slate-800">{s.value}</h2>
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-xl ${s.trend.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                    {s.trend}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Revenue Area Chart */}
            <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-50">
              <h3 className="text-lg font-bold text-slate-800 mb-6">Revenue Over Time</h3>
              <div className="h-[300px] w-full">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dx={-10} tickFormatter={(val) => `Rs.${val}`} />
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <Tooltip
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                        formatter={(value: any) => [`Rs. ${value}`, 'Revenue']}
                      />
                      <Area type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-400 font-medium">No revenue data available yet.</div>
                )}
              </div>
            </div>

            {/* Top Models Bar Chart */}
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-50">
              <h3 className="text-lg font-bold text-slate-800 mb-6">Top Selling Models</h3>
              <div className="h-[300px] w-full">
                {barChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} dy={10} interval={0} tickFormatter={(val) => val.length > 10 ? val.substring(0, 10) + '...' : val} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                      <Tooltip
                        cursor={{ fill: '#f8fafc' }}
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        formatter={(value: any) => [`${value} units`, 'Sales']}
                      />
                      <Bar dataKey="sales" fill="#0d9488" radius={[6, 6, 0, 0]} barSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-400 font-medium">No sales data available yet.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Orders Section */}
      {activeTab === 'orders' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1">
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-50 overflow-hidden">
              <div className="p-8 border-b border-slate-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-50/30">
                <h3 className="text-xl font-bold text-slate-800">Recent Transactions</h3>
                <div className="relative w-full sm:w-64">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search ID, Customer, or Model..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm font-medium text-slate-700 shadow-sm"
                  />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50/50">
                      <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Order ID</th>
                      <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Customer Info</th>
                      <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Model Purchased</th>
                      <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Design</th>
                      <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Preview</th>
                      <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Payment Status</th>
                      <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {recentOrders.length > 0 ? (
                      recentOrders.map((order, i) => (
                        <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="px-8 py-6 font-bold text-sm text-slate-500 whitespace-nowrap group-hover:text-blue-600 transition-colors">
                            #{order.id}
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex flex-col gap-0.5">
                              <span className="font-bold text-sm text-slate-800">{order.customer}</span>
                              <span className="text-xs text-slate-500">{order.phone}</span>
                              <span className="text-[10px] text-slate-400 truncate max-w-[200px]">{order.address}</span>
                            </div>
                          </td>
                          <td className="px-8 py-6 text-sm font-medium text-slate-600 whitespace-nowrap">{order.model}</td>
                          <td className="px-8 py-6 text-center">
                            <div className="flex gap-2 justify-center">
                              {order.designImage ? (
                                <a
                                  href={`http://127.0.0.1:5000${order.designImage}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                                  title="Download Design Texture"
                                  download={`design_${order.id}.png`}
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                </a>
                              ) : (
                                <span className="text-xs text-slate-400 font-medium">-</span>
                              )}
                            </div>
                          </td>
                          <td className="px-8 py-6 text-center">
                            <div className="flex gap-2 justify-center">
                              {order.bottlePreviewImage ? (
                                <a
                                  href={`http://127.0.0.1:5000${order.bottlePreviewImage}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-teal-50 text-teal-600 hover:bg-teal-600 hover:text-white transition-all shadow-sm"
                                  title="Download 3D Preview Snapshot"
                                  download={`preview_${order.id}.png`}
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                </a>
                              ) : (
                                <span className="text-xs text-slate-400 font-medium">-</span>
                              )}
                            </div>
                          </td>

                          <td className="px-8 py-6">
                            <span className={`px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${order.status === 'Paid' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-8 py-6 text-sm font-black text-slate-800 whitespace-nowrap text-right">Rs. {order.amount.toLocaleString()}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="px-8 py-16 text-center">
                          <div className="flex flex-col items-center justify-center space-y-3">
                            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                            </div>
                            <p className="text-slate-400 font-medium">No order history available.</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Inventory Section */}
      {activeTab === 'inventory' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-extrabold text-slate-900">Inventory Catalog</h2>
            <div className="flex items-center gap-4">
              <span className="px-4 py-1.5 bg-slate-100 text-slate-600 rounded-full text-xs font-bold">{bottles.length} Active Models</span>
              <button
                onClick={openAddModal}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-2xl font-bold text-sm shadow-md hover:bg-blue-700 transition-all flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                Add New Model
              </button>
            </div>
          </div>

          {bottles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {bottles.map((m, i) => {
                const thumbUrl = m.thumbnail.startsWith('http') ? m.thumbnail : `http://127.0.0.1:5000${m.thumbnail}`;
                return (
                  <div key={i} className="bg-white rounded-[2rem] p-5 shadow-sm border border-slate-100 flex flex-col group relative transition-all hover:shadow-xl hover:shadow-slate-200/40 hover:-translate-y-1">
                    <div className="aspect-[4/5] bg-slate-50 rounded-[1.5rem] mb-5 overflow-hidden relative">
                      <img
                        src={thumbUrl}
                        alt={m.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                      />
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-black text-slate-700 uppercase tracking-widest shadow-sm">
                        {m.type || 'Custom'}
                      </div>
                    </div>
                    <h4 className="font-extrabold text-slate-800 text-lg truncate mb-1">{m.name}</h4>
                    <p className="font-black text-blue-600 text-base mb-6">Rs. {m.price}</p>

                    <div className="flex gap-2 mt-auto">
                      <button
                        onClick={() => openEditModal(m)}
                        className="flex-1 py-3 bg-slate-50 text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl text-xs font-bold transition-all border border-transparent hover:border-blue-100"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(m._id, m.name)}
                        className="flex-none w-12 py-3 bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-600 rounded-xl text-xs font-bold transition-all border border-transparent hover:border-rose-100 flex items-center justify-center"
                        title="Delete Model"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-[2.5rem] p-16 text-center shadow-sm border border-slate-50 flex flex-col items-center">
              <div className="w-24 h-24 bg-blue-50 rounded-[2rem] flex items-center justify-center mb-6 text-blue-500 animate-bounce-slow">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
              </div>
              <h3 className="text-2xl font-extrabold text-slate-800 mb-3">No 3D Models Configured</h3>
              <p className="text-slate-500 text-sm max-w-md mx-auto mb-8 leading-relaxed font-medium">You haven't added any customizable bottle models to your store yet. Upload your first GLB model and thumbnail to start accepting orders.</p>
              <button
                onClick={openAddModal}
                className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold text-sm shadow-xl shadow-blue-600/20 hover:bg-blue-700 hover:shadow-blue-600/40 hover:-translate-y-1 transition-all flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                Upload First Model
              </button>
            </div>
          )}
        </div>
      )}

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md p-8 animate-in fade-in zoom-in duration-300 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black text-slate-900">{isEditMode ? 'Edit' : 'Add New'} Model</h3>
              <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Model Name <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm font-medium text-slate-800"
                  placeholder="e.g. Infinity Flask"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Category <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    required
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm font-medium text-slate-800"
                    placeholder="e.g. Sports"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Base Price <span className="text-rose-500">*</span></label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">Rs.</span>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-12 pr-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm font-bold text-slate-800"
                      placeholder="2500"
                    />
                  </div>
                </div>
              </div>

              <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                    Thumbnail Image {!isEditMode && <span className="text-rose-500">*</span>}
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    ref={thumbnailFileInputRef}
                    onChange={handleThumbnailFileChange}
                    required={!isEditMode}
                    className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm file:mr-4 file:py-2.5 file:px-5 file:rounded-xl file:border-0 file:text-xs file:font-black file:uppercase file:tracking-wider file:bg-blue-600 file:text-white hover:file:bg-blue-700 transition-all font-medium text-slate-600"
                  />
                  {isEditMode && <p className="text-[10px] font-medium text-slate-400 mt-2 ml-1">Leave blank to keep existing thumbnail</p>}
                </div>
                <div className="pt-2 border-t border-slate-200">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 mt-2">
                    3D Database Model (.glb) {!isEditMode && <span className="text-rose-500">*</span>}
                  </label>
                  <input
                    type="file"
                    accept=".glb"
                    ref={modelFileInputRef}
                    onChange={handleModelFileChange}
                    required={!isEditMode}
                    className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm file:mr-4 file:py-2.5 file:px-5 file:rounded-xl file:border-0 file:text-xs file:font-black file:uppercase file:tracking-wider file:bg-teal-600 file:text-white hover:file:bg-teal-700 transition-all font-medium text-slate-600"
                  />
                  {isEditMode && <p className="text-[10px] font-medium text-slate-400 mt-2 ml-1">Leave blank to keep existing .glb model</p>}
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-6 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold text-sm hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-[2] px-6 py-4 bg-blue-600 text-white rounded-2xl font-bold text-sm shadow-xl shadow-blue-500/20 hover:bg-blue-700 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all"
                >
                  {isEditMode ? 'Save Changes' : 'Publish Model'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
