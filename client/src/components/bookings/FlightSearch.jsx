import React, { useState } from 'react';
import api from "@/api/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Plane, 
  Clock, 
  TrendingUp, 
  Sparkles,
  Calendar,
  Users,
  ArrowRight,
  Star
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

// Mock flight data - in production, this would come from Skyscanner/Amadeus/Trip.com APIs
const mockFlights = [
  {
    id: 1,
    airline: "Emirates",
    flightNumber: "EK201",
    from: "JFK",
    to: "DXB",
    departTime: "23:55",
    arriveTime: "21:10+1",
    duration: "12h 15m",
    stops: 0,
    price: 1249,
    class: "Economy",
    aiScore: 95,
    carbonFootprint: "1.2 tons"
  },
  {
    id: 2,
    airline: "Qatar Airways",
    flightNumber: "QR701",
    from: "JFK",
    to: "DXB",
    departTime: "20:30",
    arriveTime: "19:45+1",
    duration: "13h 15m",
    stops: 1,
    price: 989,
    class: "Economy",
    aiScore: 88,
    carbonFootprint: "1.4 tons"
  },
  {
    id: 3,
    airline: "Etihad Airways",
    flightNumber: "EY101",
    from: "JFK",
    to: "DXB",
    departTime: "01:15",
    arriveTime: "23:30",
    duration: "12h 15m",
    stops: 0,
    price: 1399,
    class: "Business",
    aiScore: 92,
    carbonFootprint: "2.1 tons"
  },
];

export default function FlightSearch() {
  const [searchParams, setSearchParams] = useState({
    from: '',
    to: '',
    departDate: '',
    returnDate: '',
    passengers: 1,
    class: 'economy'
  });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [aiRecommendation, setAiRecommendation] = useState('');

  const handleSearch = async () => {
    if (!searchParams.from || !searchParams.to || !searchParams.departDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setResults(mockFlights);
      setLoading(false);
    }, 1500);

    // Get AI recommendation
    try {
      const aiResponse = await api.integrations.Core.InvokeLLM({
        prompt: `As a travel expert, provide a brief recommendation for flights from ${searchParams.from} to ${searchParams.to} for ${searchParams.passengers} passenger(s). Consider factors like best time to book, typical prices, and travel tips. Keep it to 2-3 sentences.`,
      });
      setAiRecommendation(aiResponse);
    } catch (error) {
      console.error('AI recommendation failed:', error);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-slate-200/60 shadow-lg">
        <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-blue-50 to-cyan-50">
          <CardTitle className="flex items-center gap-2">
            <Plane className="w-5 h-5 text-blue-600" />
            Search Flights
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="from">From</Label>
              <Input
                id="from"
                value={searchParams.from}
                onChange={(e) => setSearchParams({ ...searchParams, from: e.target.value })}
                placeholder="JFK - New York"
              />
            </div>

            <div>
              <Label htmlFor="to">To</Label>
              <Input
                id="to"
                value={searchParams.to}
                onChange={(e) => setSearchParams({ ...searchParams, to: e.target.value })}
                placeholder="DXB - Dubai"
              />
            </div>

            <div>
              <Label htmlFor="departDate">Depart Date</Label>
              <Input
                id="departDate"
                type="date"
                value={searchParams.departDate}
                onChange={(e) => setSearchParams({ ...searchParams, departDate: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="returnDate">Return Date (Optional)</Label>
              <Input
                id="returnDate"
                type="date"
                value={searchParams.returnDate}
                onChange={(e) => setSearchParams({ ...searchParams, returnDate: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="passengers">Passengers</Label>
              <Input
                id="passengers"
                type="number"
                min="1"
                value={searchParams.passengers}
                onChange={(e) => setSearchParams({ ...searchParams, passengers: e.target.value })}
              />
            </div>

            <div className="flex items-end">
              <Button
                onClick={handleSearch}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
              >
                {loading ? (
                  <>Searching...</>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Search Flights
                  </>
                )}
              </Button>
            </div>
          </div>

          {aiRecommendation && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200"
            >
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-purple-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-900 mb-1">AI Recommendation</p>
                  <p className="text-sm text-slate-700">{aiRecommendation}</p>
                </div>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {results.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-900">
              Found {results.length} flights
            </h3>
            <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
              Best prices guaranteed
            </Badge>
          </div>

          <AnimatePresence>
            {results.map((flight, index) => (
              <motion.div
                key={flight.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-slate-200/60 shadow-md hover:shadow-lg transition-all">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center">
                            <Plane className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900">{flight.airline}</h4>
                            <p className="text-sm text-slate-500">{flight.flightNumber}</p>
                          </div>
                          {flight.aiScore >= 90 && (
                            <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                              <Star className="w-3 h-3 mr-1" />
                              AI Pick
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-6">
                          <div>
                            <p className="text-2xl font-bold text-slate-900">{flight.departTime}</p>
                            <p className="text-sm text-slate-500">{flight.from}</p>
                          </div>

                          <div className="flex-1 flex flex-col items-center">
                            <div className="flex items-center gap-2 text-slate-400 mb-1">
                              <Clock className="w-4 h-4" />
                              <span className="text-xs">{flight.duration}</span>
                            </div>
                            <div className="w-full h-0.5 bg-slate-200 relative">
                              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600"></div>
                              <Plane className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-blue-600" />
                            </div>
                            <p className="text-xs text-slate-500 mt-1">
                              {flight.stops === 0 ? 'Direct' : `${flight.stops} stop(s)`}
                            </p>
                          </div>

                          <div>
                            <p className="text-2xl font-bold text-slate-900">{flight.arriveTime}</p>
                            <p className="text-sm text-slate-500">{flight.to}</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                          <Badge variant="outline">{flight.class}</Badge>
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            {flight.carbonFootprint} CO₂
                          </Badge>
                          {flight.aiScore && (
                            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                              AI Score: {flight.aiScore}/100
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-3">
                        <div className="text-right">
                          <p className="text-3xl font-bold text-slate-900">
                            ${flight.price}
                          </p>
                          <p className="text-sm text-slate-500">per person</p>
                        </div>
                        <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 w-full lg:w-auto">
                          Select Flight
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}