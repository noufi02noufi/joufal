import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { getUserLocation } from "@/lib/maps";
import MarketCard from "@/components/MarketCard";
import { Market } from "@shared/schema";

export default function NearbyMarkets() {
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

  const { data: markets, isLoading } = useQuery({
    queryKey: ["/api/markets/nearby"],
    queryFn: async () => {
      if (!userLocation) return [];
      
      const res = await apiRequest("POST", "/api/markets/nearby", {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        radius: 10 // 10 km radius
      });
      
      return res.json() as Promise<Market[]>;
    },
    enabled: !!userLocation
  });

  return (
    <section className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-heading font-semibold">Nearby Markets</h3>
        <Link href="/markets">
          <a className="text-primary-600 text-sm font-medium">See All</a>
        </Link>
      </div>
      
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-4">Loading markets...</div>
        ) : !markets || markets.length === 0 ? (
          <div className="text-center py-4">No markets found nearby.</div>
        ) : (
          markets.map(market => (
            <MarketCard key={market.id} market={market} />
          ))
        )}
      </div>
    </section>
  );
}
