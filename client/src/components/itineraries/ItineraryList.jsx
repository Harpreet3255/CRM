import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  MapPin, 
  Calendar, 
  Users, 
  DollarSign,
  Share2,
  FileText,
  Edit,
  Sparkles
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { format } from "date-fns";

const statusColors = {
  draft: 'bg-slate-100 text-slate-700 border-slate-200',
  sent: 'bg-blue-100 text-blue-700 border-blue-200',
  approved: 'bg-green-100 text-green-700 border-green-200',
  booked: 'bg-purple-100 text-purple-700 border-purple-200',
  in_progress: 'bg-orange-100 text-orange-700 border-orange-200',
  completed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
};

export default function ItineraryList({ itineraries, isLoading }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <Card key={i} className="border-slate-200/60">
            <CardContent className="p-6">
              <Skeleton className="h-32 w-full mb-4" />
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (itineraries.length === 0) {
    return (
      <Card className="border-slate-200/60">
        <CardContent className="p-12 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-8 h-8 text-purple-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No itineraries yet</h3>
          <p className="text-slate-600 mb-4">Create your first AI-powered itinerary to get started</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {itineraries.map((itinerary, index) => (
        <motion.div
          key={itinerary.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <Card className="border-slate-200/60 shadow-md hover:shadow-xl transition-all group overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600"></div>
            
            <CardContent className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-purple-600 transition-colors">
                    {itinerary.title}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <MapPin className="w-4 h-4" />
                    {itinerary.destination}
                  </div>
                </div>
                {itinerary.ai_generated && (
                  <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                    <Sparkles className="w-3 h-3 mr-1" />
                    AI
                  </Badge>
                )}
              </div>

              <div className="space-y-2">
                {itinerary.start_date && (
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {format(new Date(itinerary.start_date), 'MMM d, yyyy')}
                      {itinerary.end_date && ` - ${format(new Date(itinerary.end_date), 'MMM d')}`}
                    </span>
                  </div>
                )}

                {itinerary.travelers && (
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Users className="w-4 h-4" />
                    <span>{itinerary.travelers} travelers</span>
                  </div>
                )}

                {itinerary.total_cost && (
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <DollarSign className="w-4 h-4" />
                    <span>${itinerary.total_cost.toLocaleString()}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <Badge variant="outline" className={statusColors[itinerary.status] || statusColors.draft}>
                  {itinerary.status || 'draft'}
                </Badge>
                
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost">
                    <Share2 className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost">
                    <FileText className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {itinerary.days && itinerary.days.length > 0 && (
                <div className="pt-2">
                  <p className="text-xs text-slate-500">
                    {itinerary.days.length} days planned
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}