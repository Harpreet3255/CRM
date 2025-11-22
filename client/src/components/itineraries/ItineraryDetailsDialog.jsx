import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
// Removed ScrollArea import - using native scrolling instead
import { MapPin, Calendar, Users, DollarSign, Clock, FileDown, Edit, Send } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { downloadItineraryPDF } from "@/utils/pdfGenerator";

export default function ItineraryDetailsDialog({ itinerary, open, onClose }) {
    const [isExporting, setIsExporting] = useState(false);

    if (!itinerary) return null;

    const details = itinerary.ai_generated_json || {};
    const days = details.daily || [];

    const handleExportPDF = async () => {
        setIsExporting(true);
        try {
            await downloadItineraryPDF(itinerary, 'Triponic'); // TODO: Get company name from settings
            toast.success('PDF downloaded successfully!');
        } catch (error) {
            console.error('PDF export error:', error);
            toast.error('Failed to generate PDF');
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col">
                <DialogHeader>
                    <div className="flex items-center justify-between mr-8">
                        <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                            {itinerary.title || details.title || 'Trip Itinerary'}
                            {itinerary.status && (
                                <Badge variant="outline" className="ml-2 capitalize">
                                    {itinerary.status}
                                </Badge>
                            )}
                        </DialogTitle>
                    </div>
                    <DialogDescription className="flex flex-wrap gap-4 pt-2 text-sm">
                        <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {itinerary.destination}
                        </div>
                        <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {itinerary.duration} Days
                        </div>
                        <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {itinerary.travelers} Travelers
                        </div>
                        {itinerary.budget && (
                            <div className="flex items-center gap-1">
                                <DollarSign className="w-4 h-4" />
                                {itinerary.budget} Budget
                            </div>
                        )}
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto pr-4 max-h-[60vh]">
                    <div className="space-y-6 py-4">
                        {/* Summary */}
                        {details.summary && (
                            <div className="bg-slate-50 p-4 rounded-lg text-slate-700 italic border border-slate-100">
                                {details.summary}
                            </div>
                        )}

                        {/* Day by Day */}
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold border-b pb-2">Day-by-Day Plan</h3>
                            {days.length > 0 ? (
                                days.map((day, index) => (
                                    <div key={index} className="relative pl-6 border-l-2 border-slate-200 pb-6 last:pb-0">
                                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-purple-600 border-4 border-white shadow-sm" />
                                        <div className="mb-2">
                                            <span className="text-sm font-bold text-purple-600 uppercase tracking-wider">
                                                Day {day.day}
                                            </span>
                                            <h4 className="text-lg font-bold text-slate-900">{day.title}</h4>
                                        </div>

                                        <div className="space-y-3 text-slate-600">
                                            {day.morning && (
                                                <div className="grid grid-cols-[80px_1fr] gap-2">
                                                    <span className="text-xs font-semibold text-slate-400 uppercase mt-1">Morning</span>
                                                    <p>{day.morning}</p>
                                                </div>
                                            )}
                                            {day.afternoon && (
                                                <div className="grid grid-cols-[80px_1fr] gap-2">
                                                    <span className="text-xs font-semibold text-slate-400 uppercase mt-1">Afternoon</span>
                                                    <p>{day.afternoon}</p>
                                                </div>
                                            )}
                                            {day.evening && (
                                                <div className="grid grid-cols-[80px_1fr] gap-2">
                                                    <span className="text-xs font-semibold text-slate-400 uppercase mt-1">Evening</span>
                                                    <p>{day.evening}</p>
                                                </div>
                                            )}
                                        </div>

                                        {day.activities && day.activities.length > 0 && (
                                            <div className="mt-3 flex flex-wrap gap-2">
                                                {day.activities.map((act, i) => (
                                                    <Badge key={i} variant="secondary" className="text-xs">
                                                        {act}
                                                    </Badge>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="whitespace-pre-wrap text-slate-600">
                                    {itinerary.ai_generated_content}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="border-t border-slate-200 pt-4 mt-4 flex gap-3 justify-end">
                    <Button
                        variant="outline"
                        onClick={() => {
                            toast.info('Edit functionality coming soon');
                        }}
                        className="gap-2"
                    >
                        <Edit className="w-4 h-4" />
                        Edit
                    </Button>
                    <Button
                        variant="outline"
                        onClick={handleExportPDF}
                        disabled={isExporting}
                        className="gap-2"
                    >
                        <FileDown className="w-4 h-4" />
                        {isExporting ? 'Generating PDF...' : 'Export PDF'}
                    </Button>
                    <Button
                        onClick={() => {
                            toast.info('Send to client functionality coming soon');
                        }}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 gap-2"
                    >
                        <Send className="w-4 h-4" />
                        Send to Client
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
