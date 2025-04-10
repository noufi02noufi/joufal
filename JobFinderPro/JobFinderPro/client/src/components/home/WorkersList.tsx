import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { getUserLocation } from "@/lib/maps";
import WorkerCard from "@/components/WorkerCard";
import { WorkerWithProfile } from "@/lib/types";

export default function WorkersList() {
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

  const { data: workers, isLoading } = useQuery({
    queryKey: ["/api/search/workers"],
    queryFn: async () => {
      if (!userLocation) return [];
      
      const res = await apiRequest("POST", "/api/search/workers", {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        radius: 10 // 10 km radius
      });
      
      return res.json() as Promise<WorkerWithProfile[]>;
    },
    enabled: !!userLocation
  });

  if (isLoading) {
    return <div className="text-center py-4">Loading workers...</div>;
  }

  if (!workers || workers.length === 0) {
    return <div className="text-center py-4">No workers found nearby.</div>;
  }

  return (
    <section className="mb-8">
      <div className="space-y-4">
        {workers.map(worker => (
          <WorkerCard 
            key={worker.id} 
            worker={worker} 
          />
        ))}
      </div>
    </section>
  );
}
