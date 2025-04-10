import Header from "@/components/layout/Header";
import TabNavigation from "@/components/layout/TabNavigation";
import BottomNavigation from "@/components/layout/BottomNavigation";
import WelcomeSection from "@/components/home/WelcomeSection";
import QuickCategories from "@/components/home/QuickCategories";
import NearbyWorkersMap from "@/components/home/NearbyWorkersMap";
import WorkersList from "@/components/home/WorkersList";
import PostJobCTA from "@/components/home/PostJobCTA";
import RecentJobs from "@/components/home/RecentJobs";
import NearbyMarkets from "@/components/home/NearbyMarkets";

export default function Home() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <TabNavigation />
      
      <main className="container mx-auto px-4 py-6">
        <WelcomeSection />
        <QuickCategories />
        <NearbyWorkersMap />
        <WorkersList />
        <PostJobCTA />
        <RecentJobs />
        <NearbyMarkets />
      </main>
      
      <BottomNavigation />
    </div>
  );
}
