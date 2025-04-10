import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { professionCategories } from "@/lib/constants";
import { apiRequest } from "@/lib/queryClient";
import { getUserLocation } from "@/lib/maps";
import { WorkerWithProfile } from "@/lib/types";

export default function NearbyWorkersMap() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

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

  const { data: nearbyWorkers, isLoading } = useQuery({
    queryKey: ["/api/search/workers"],
    queryFn: async () => {
      if (!userLocation) return [];
      
      const res = await apiRequest("POST", "/api/search/workers", {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        radius: 10, // 10 km radius
        profession: selectedCategory === "all" ? undefined : selectedCategory
      });
      
      return res.json() as Promise<WorkerWithProfile[]>;
    },
    enabled: !!userLocation
  });

  return (
    <section className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-heading font-semibold">Nearby Workers</h3>
        <Link href="/find-workers">
          <a className="text-primary-600 text-sm font-medium">See All</a>
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="map-container bg-neutral-100 relative">
          <div className="absolute inset-0">
            {/* Map would be rendered here using Google Maps API */}
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <p className="text-gray-500">Map loading...</p>
              {/* Worker markers would be added here */}
            </div>
          </div>
          
          {/* Map controls */}
          <div className="absolute bottom-4 right-4 flex flex-col gap-2">
            <button className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-neutral-700"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5 5 4 4 0 0 1-5-5 10 10 0 0 0-5-5 4 4 0 0 1 5-5Z" />
                <path d="M12 11a3 3 0 1 0 3 3" />
              </svg>
            </button>
            <button className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-neutral-700"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="M12 5v14" />
              </svg>
            </button>
            <button className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-neutral-700"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="p-4">
          <div className="flex gap-2 mb-4 overflow-x-auto py-1">
            <button 
              className={`px-4 py-2 ${selectedCategory === 'all' ? 'bg-primary-500 text-white' : 'bg-white border border-neutral-200'} rounded-full text-sm font-medium whitespace-nowrap`}
              onClick={() => setSelectedCategory('all')}
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
          
          <div className="flex justify-between items-center text-sm text-neutral-600 mb-2">
            <span>{isLoading ? "Loading workers..." : `${nearbyWorkers?.length || 0} workers found nearby`}</span>
            <div className="flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="21" y1="4" x2="14" y2="4" />
                <line x1="10" y1="4" x2="3" y2="4" />
                <line x1="21" y1="12" x2="12" y2="12" />
                <line x1="8" y1="12" x2="3" y2="12" />
                <line x1="21" y1="20" x2="16" y2="20" />
                <line x1="12" y1="20" x2="3" y2="20" />
                <line x1="14" y1="2" x2="14" y2="6" />
                <line x1="8" y1="10" x2="8" y2="14" />
                <line x1="16" y1="18" x2="16" y2="22" />
              </svg>
              <span>Filter</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
