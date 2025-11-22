import React from "react";
import api from "@/api/client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Receipt,
  CreditCard
} from "lucide-react";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function TriponicFinance() {
  const { data: bookings = [] } = useQuery({
    queryKey: ['bookings'],
    queryFn: () => api.entities.Booking.list('-created_date'),
    initialData: [],
  });

  const stats = {
    totalRevenue: bookings.filter(b => b.payment_status === 'paid').reduce((sum, b) => sum + (b.selling_price || 0), 0),
    totalCommission: bookings.reduce((sum, b) => sum + (b.commission || 0), 0),
    pendingPayments: bookings.filter(b => b.payment_status === 'unpaid').reduce((sum, b) => sum + (b.selling_price || 0), 0),
  };

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-2">
          Finance Dashboard
        </h1>
        <p className="text-slate-600">
          Track revenue, expenses, and profitability
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-slate-200/60 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-sm text-slate-500 mb-1">Total Revenue</p>
            <p className="text-3xl font-bold text-slate-900">${stats.totalRevenue.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200/60 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl">
                <Receipt className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-sm text-slate-500 mb-1">Commission Earned</p>
            <p className="text-3xl font-bold text-slate-900">${stats.totalCommission.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200/60 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <TrendingDown className="w-5 h-5 text-orange-600" />
            </div>
            <p className="text-sm text-slate-500 mb-1">Pending Payments</p>
            <p className="text-3xl font-bold text-slate-900">${stats.pendingPayments.toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200/60 shadow-lg">
        <CardHeader className="border-b border-slate-100">
          <CardTitle>Revenue Trend</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={[
              { month: 'Jan', revenue: 12400 },
              { month: 'Feb', revenue: 15200 },
              { month: 'Mar', revenue: 18100 },
              { month: 'Apr', revenue: 16800 },
              { month: 'May', revenue: 21500 },
              { month: 'Jun', revenue: 24300 },
            ]}>
              <defs>
                <linearGradient id="colorRevenueTrend" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip />
              <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fill="url(#colorRevenueTrend)" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}