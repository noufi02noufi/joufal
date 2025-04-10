import { useState, useEffect } from "react";

export default function WelcomeSection() {
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Mock user data for the UI
  useEffect(() => {
    setUser({ name: "Ahmed" });
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality
    console.log("Searching for:", searchQuery);
  };

  return (
    <section className="mb-8">
      <h2 className="text-xl font-heading font-semibold mb-2">
        Hello, <span className="text-primary-600">{user?.name}</span> 👋
      </h2>
      <p className="text-neutral-600">What service do you need today?</p>
      
      <form onSubmit={handleSearch} className="mt-4">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search for services..." 
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
      </form>
    </section>
  );
}
