import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, MapPin, DollarSign, Calendar, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

const stages = [
  { id: 'new', label: 'New Leads', color: 'bg-blue-50 border-blue-200' },
  { id: 'contacted', label: 'Contacted', color: 'bg-purple-50 border-purple-200' },
  { id: 'qualified', label: 'Qualified', color: 'bg-yellow-50 border-yellow-200' },
  { id: 'proposal_sent', label: 'Proposal Sent', color: 'bg-orange-50 border-orange-200' },
  { id: 'won', label: 'Won', color: 'bg-green-50 border-green-200' },
];

export default function LeadKanban({ leads, onStatusChange, onLeadClick, isLoading }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {stages.map((stage) => (
          <Card key={stage.id} className="border-slate-200/60">
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <Skeleton key={i} className="h-32 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 overflow-x-auto">
      {stages.map((stage) => {
        const stageLeads = leads.filter(lead => lead.status === stage.id);
        
        return (
          <Card key={stage.id} className={`border-2 ${stage.color} min-h-[600px]`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-slate-900">
                  {stage.label}
                </CardTitle>
                <Badge variant="secondary" className="bg-white">
                  {stageLeads.length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {stageLeads.map((lead, index) => (
                <motion.div
                  key={lead.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => onLeadClick(lead)}
                  className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('leadId', lead.id);
                    e.dataTransfer.setData('currentStatus', lead.status);
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {lead.full_name?.charAt(0) || 'L'}
                      </span>
                    </div>
                    {lead.ai_score && (
                      <Badge variant="outline" className="bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border-green-200 text-xs">
                        {lead.ai_score}% match
                      </Badge>
                    )}
                  </div>

                  <h4 className="font-semibold text-slate-900 mb-2 group-hover:text-purple-600 transition-colors">
                    {lead.full_name}
                  </h4>

                  <div className="space-y-2">
                    {lead.destination && (
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <MapPin className="w-3 h-3" />
                        <span>{lead.destination}</span>
                      </div>
                    )}
                    
                    {lead.budget && (
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <DollarSign className="w-3 h-3" />
                        <span>${lead.budget.toLocaleString()}</span>
                      </div>
                    )}

                    {lead.travelers && (
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <Users className="w-3 h-3" />
                        <span>{lead.travelers} travelers</span>
                      </div>
                    )}

                    {lead.travel_dates && (
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <Calendar className="w-3 h-3" />
                        <span>{lead.travel_dates}</span>
                      </div>
                    )}

                    {lead.email && (
                      <div className="flex items-center gap-2 text-xs text-slate-600 truncate">
                        <Mail className="w-3 h-3" />
                        <span className="truncate">{lead.email}</span>
                      </div>
                    )}
                  </div>

                  {lead.tags && lead.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {lead.tags.slice(0, 2).map((tag, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}

              {stageLeads.length === 0 && (
                <div className="text-center py-8 text-slate-400 text-sm">
                  No leads in this stage
                </div>
              )}

              <div
                className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center text-sm text-slate-400 hover:border-purple-300 hover:text-purple-600 transition-colors"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const leadId = e.dataTransfer.getData('leadId');
                  const currentStatus = e.dataTransfer.getData('currentStatus');
                  if (leadId && currentStatus !== stage.id) {
                    onStatusChange(leadId, stage.id);
                  }
                }}
              >
                Drop leads here
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}