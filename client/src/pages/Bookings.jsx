import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plane, Hotel, Ticket, Car } from "lucide-react";
import { motion } from "framer-motion";

import FlightSearch from "../components/bookings/FlightSearch.jsx";
import HotelSearch from "../components/bookings/HotelSearch.jsx";
import ActivitySearch from "../components/bookings/ActivitySearch.jsx";
import CarRentalSearch from "../components/bookings/CarRentalSearch.jsx";

export default function Bookings() {
  return (
    <div className="p-6 lg:p-8 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-2">
          Bookings Center
        </h1>
        <p className="text-slate-600">
          Search and book flights, hotels, activities, and car rentals with AI-powered recommendations
        </p>
      </motion.div>

      <Tabs defaultValue="flights" className="space-y-6">
        <TabsList className="bg-white border border-slate-200 p-1 grid grid-cols-4 w-full lg:w-auto">
          <TabsTrigger 
            value="flights" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white"
          >
            <Plane className="w-4 h-4 mr-2" />
            Flights
          </TabsTrigger>
          <TabsTrigger 
            value="hotels"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white"
          >
            <Hotel className="w-4 h-4 mr-2" />
            Hotels
          </TabsTrigger>
          <TabsTrigger 
            value="activities"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-600 data-[state=active]:to-red-600 data-[state=active]:text-white"
          >
            <Ticket className="w-4 h-4 mr-2" />
            Activities
          </TabsTrigger>
          <TabsTrigger 
            value="cars"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-emerald-600 data-[state=active]:text-white"
          >
            <Car className="w-4 h-4 mr-2" />
            Car Rentals
          </TabsTrigger>
        </TabsList>

        <TabsContent value="flights">
          <FlightSearch />
        </TabsContent>

        <TabsContent value="hotels">
          <HotelSearch />
        </TabsContent>

        <TabsContent value="activities">
          <ActivitySearch />
        </TabsContent>

        <TabsContent value="cars">
          <CarRentalSearch />
        </TabsContent>
      </Tabs>
    </div>
  );
}