import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/Header";
import TabNavigation from "@/components/layout/TabNavigation";
import BottomNavigation from "@/components/layout/BottomNavigation";
import MarketCard from "@/components/MarketCard";
import { apiRequest } from "@/lib/queryClient";
import { getUserLocation } from "@/lib/maps";
import { Market } from "@shared/schema";

export default function Markets() {
  const [searchQuery, setSearchQuery] = useState("");
  const [marketType, setMarketType] = useState<string | undefined>(undefined);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  // Get user location
  useEffect(() => {
    const getLocation = async () => {
      try {
        const location = await getUserLocation();
        setUserLocation(location);
      } catch (error) {
        console.error("Error getting user location:", error);
        // Use a default location
        setUserLocation({ latitude: 28.4595, longitude: 77.0266 });
      }
    };

    getLocation();
  }, []);

  const { data: markets, isLoading } = useQuery({
    queryKey: ["/api/markets/nearby", marketType],
    queryFn: async () => {
      if (!userLocation) return [];
      
      const res = await apiRequest("POST", "/api/markets/nearby", {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        radius: 10, // 10 km radius
        type: marketType
      });
      
      return res.json() as Promise<Market[]>;
    },
    enabled: !!userLocation
  });

  // Filter markets by search query
  const filteredMarkets = markets?.filter(market => 
    market.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    market.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    market.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const marketTypes = [
    { id: "hardware", label: "Hardware" },
    { id: "paint", label: "Paint" },
    { id: "electrical", label: "Electrical" },
    { id: "tools", label: "Tools" },
    { id: "plumbing", label: "Plumbing" }
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <TabNavigation />
      
      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-heading font-bold mb-2">Nearby Markets</h1>
          <p className="text-neutral-600">Find materials and supplies for your projects</p>
        </div>
        
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search for markets or items..." 
              className="w-full pl-10 pr-4 py-3 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 absolute left-3 top-3.5 text-neutral-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </div>
        </div>
        
        {/* Market Type Filter */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Filter by Type</h2>
          <div className="flex gap-2 overflow-x-auto py-1">
            <button 
              className={`px-4 py-2 ${!marketType ? 'bg-primary-500 text-white' : 'bg-white border border-neutral-200'} rounded-full text-sm font-medium whitespace-nowrap`}
              onClick={() => setMarketType(undefined)}
            >
              All Types
            </button>
            
            {marketTypes.map(type => (
              <button 
                key={type.id}
                className={`px-4 py-2 ${marketType === type.id ? 'bg-primary-500 text-white' : 'bg-white border border-neutral-200'} rounded-full text-sm font-medium whitespace-nowrap`}
                onClick={() => setMarketType(type.id)}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>
        
        {/* Markets List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-4">Loading markets...</div>
          ) : !filteredMarkets || filteredMarkets.length === 0 ? (
            <div className="text-center py-8">
              <div className="bg-neutral-100 p-6 rounded-lg inline-block mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-neutral-400 mx-auto"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-1">No markets found</h3>
              <p className="text-neutral-500">
                {marketType 
                  ? `No ${marketType} shops found in your area.` 
                  : "No markets found in your area."}
              </p>
              <button 
                className="mt-4 px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium"
                onClick={() => {
                  setMarketType(undefined);
                  setSearchQuery("");
                }}
              >
                Clear Filters
              </button>
            </div>
          ) : (
            filteredMarkets.map(market => (
              <MarketCard key={market.id} market={market} />
            ))
          )}
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
}
