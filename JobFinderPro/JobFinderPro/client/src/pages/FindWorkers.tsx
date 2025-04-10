import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import Header from "@/components/layout/Header";
import TabNavigation from "@/components/layout/TabNavigation";
import BottomNavigation from "@/components/layout/BottomNavigation";
import WorkerCard from "@/components/WorkerCard";
import { professionCategories } from "@/lib/constants";
import { apiRequest } from "@/lib/queryClient";
import { getUserLocation } from "@/lib/maps";
import { WorkerWithProfile } from "@/lib/types";

export default function FindWorkers() {
  const [location] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  
  // Extract profession from URL if present
  useEffect(() => {
    const params = new URLSearchParams(location.split("?")[1]);
    const profession = params.get("profession");
    if (profession) {
      setSelectedCategory(profession);
    }
  }, [location]);

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

  const { data: workers, isLoading } = useQuery({
    queryKey: ["/api/search/workers", selectedCategory],
    queryFn: async () => {
      if (!userLocation) return [];
      
      const res = await apiRequest("POST", "/api/search/workers", {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        radius: 10, // 10 km radius
        profession: selectedCategory
      });
      
      return res.json() as Promise<WorkerWithProfile[]>;
    },
    enabled: !!userLocation
  });

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <TabNavigation />
      
      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-heading font-bold mb-2">Find Workers</h1>
          <p className="text-neutral-600">Discover skilled professionals near you</p>
        </div>
        
        {/* Category Filter */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Filter by Category</h2>
          <div className="flex gap-2 overflow-x-auto py-1">
            <button 
              className={`px-4 py-2 ${!selectedCategory ? 'bg-primary-500 text-white' : 'bg-white border border-neutral-200'} rounded-full text-sm font-medium whitespace-nowrap`}
              onClick={() => setSelectedCategory(undefined)}
            >
              All
            </button>
            
            {professionCategories.map(category => (
              <button 
                key={category.id}
                className={`px-4 py-2 ${selectedCategory === category.value ? 'bg-primary-500 text-white' : 'bg-white border border-neutral-200'} rounded-full text-sm font-medium whitespace-nowrap`}
                onClick={() => setSelectedCategory(category.value)}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
        
        {/* Workers List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-4">Loading workers...</div>
          ) : !workers || workers.length === 0 ? (
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
              <h3 className="text-lg font-medium mb-1">No workers found</h3>
              <p className="text-neutral-500">
                {selectedCategory 
                  ? `No ${selectedCategory} professionals found in your area.` 
                  : "No professionals found in your area."}
              </p>
              <button 
                className="mt-4 px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium"
                onClick={() => setSelectedCategory(undefined)}
              >
                View All Categories
              </button>
            </div>
          ) : (
            workers.map(worker => (
              <WorkerCard key={worker.id} worker={worker} />
            ))
          )}
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
}
