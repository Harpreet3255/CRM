import React, { useState } from "react";
import api from "@/api/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Search,
  FileText,
  Download,
  Send,
  Eye,
  DollarSign,
  Calendar,
  User
} from "lucide-react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { toast } from "sonner";

const statusColors = {
  draft: 'bg-slate-100 text-slate-700 border-slate-200',
  sent: 'bg-blue-100 text-blue-700 border-blue-200',
  paid: 'bg-green-100 text-green-700 border-green-200',
  overdue: 'bg-red-100 text-red-700 border-red-200',
  cancelled: 'bg-orange-100 text-orange-700 border-orange-200',
};

export default function Quotes() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');

  const { data: invoices = [], isLoading } = useQuery({
    queryKey: ['invoices'],
    queryFn: async () => {
      const response = await api.get('/invoices');
      return response.data.invoices || [];
    },
    initialData: [],
  });

  const updateInvoiceMutation = useMutation({
    mutationFn: ({ id, status }) => api.patch(`/invoices/${id}`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast.success('Invoice updated successfully');
    },
  });

  const filteredInvoices = invoices.filter(invoice =>
    invoice.client?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    invoice.id?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStatusChange = (invoiceId, newStatus) => {
    updateInvoiceMutation.mutate({ id: invoiceId, status: newStatus });
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-2">
              Invoices
            </h1>
            <p className="text-slate-600">
              Manage client invoices and payments
            </p>
          </div>
          <Button
            className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600"
            onClick={() => toast.info('Use Tono AI to create invoices: "create an invoice for [client name]"')}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Invoice (via Tono AI)
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search invoices by client name or ID..."
            className="pl-10"
          />
        </div>
      </motion.div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-24 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredInvoices.length === 0 ? (
        <Card className="border-slate-200/60">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No invoices yet</h3>
            <p className="text-slate-600 mb-4">Ask Tono AI to create your first invoice</p>
            <p className="text-sm text-slate-500">
              Example: "create an invoice for Pulkit Test"
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredInvoices.map((invoice, index) => (
            <motion.div
              key={invoice.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="border-slate-200/60 shadow-md hover:shadow-lg transition-all">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-bold text-slate-900 mb-1">
                            Invoice #{invoice.id.slice(0, 8)}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-slate-500">
                            <User className="w-4 h-4" />
                            {invoice.client?.full_name || 'Unknown Client'}
                          </div>
                        </div>
                        <Badge variant="outline" className={statusColors[invoice.status] || statusColors.draft}>
                          {invoice.status || 'draft'}
                        </Badge>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Created {format(new Date(invoice.created_at), 'MMM d, yyyy')}
                        </div>

                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4" />
                          <span className="font-semibold text-slate-900">
                            ${invoice.amount?.toLocaleString() || 0} USD
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toast.info('Invoice details coming soon')}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toast.info('PDF generation coming soon')}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        PDF
                      </Button>
                      {invoice.status === 'draft' && (
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-purple-600 to-blue-600"
                          onClick={() => handleStatusChange(invoice.id, 'sent')}
                        >
                          <Send className="w-4 h-4 mr-2" />
                          Send
                        </Button>
                      )}
                      {invoice.status === 'sent' && (
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-green-600 to-emerald-600"
                          onClick={() => handleStatusChange(invoice.id, 'paid')}
                        >
                          Mark Paid
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}