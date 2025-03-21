"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

function SearchByIPComponent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [ip, setIp] = useState("");
  const [records, setRecords] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showTableInitial, setShowTableInitial] = useState(false);

  // Fetch records based on IP
  const fetchRecords = async (ipAddress) => {
    if (!ipAddress.trim()) return;

    setLoading(true);
    setError("");

    try {
      const res = await axios.get(`/api/records/ip/${ipAddress}`);
      res.data.forEach((item) => {
        item.records = JSON.parse(item.records);
      });

      setRecords(res.data);
      setLoading(false);
      setShowTableInitial(true);
    } catch (err) {
      setError("No records found for this IP.");
      setRecords([]);
      setLoading(false);
      setShowTableInitial(true);
    }
  };

  // Handle form submit
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!ip.trim()) {
      setError("Please enter an IP address.");
      return;
    }

    // Update URL query params without reloading the page
    router.replace(`?ip=${encodeURIComponent(ip)}`, { scroll: false });

    // Fetch records
    fetchRecords(ip);
  };

  // Run once on mount to check query params
  useEffect(() => {
    const queryIp = searchParams.get("ip");
    if (queryIp) {
      setIp(queryIp);
      fetchRecords(queryIp);
    }
  }, [searchParams]);

  return (
    <div className="p-6 min-h-screen bg-gray-900 text-white flex flex-col items-center">
      <h2 className="text-lg font-bold mb-4">Search by IP</h2>

      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-sm items-center space-x-2"
      >
        <Input
          type="text"
          placeholder="Enter IP address"
          value={ip}
          onChange={(e) => setIp(e.target.value)}
          className="w-full bg-gray-800 text-white px-4 py-2 rounded-md transition-all duration-300 border-none 
             focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 
             placeholder-gray-400 selection:bg-blue-500 selection:text-white"
        />

        <Button type="submit" variant="secondary" className="cursor-pointer">
          Search
        </Button>
      </form>

      {loading && <p className="text-blue-500 mt-4">Loading records...</p>}
      {error && !loading && <p className="text-red-500 mt-2">{error}</p>}

      {records.length > 0 && !loading && (
        <div className="mt-6 w-full max-w-lg">
          {records.map((rec, index) => (
            <HoverCard key={index}>
              <HoverCardTrigger asChild>
                <Button variant="link" className="text-white">
                  {rec.date}
                </Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-96 bg-gray-800 border-gray-700 shadow-lg">
                <ScrollArea className="h-72 rounded-md border border-gray-700">
                  <div className="p-4">
                    <h4 className="mb-4 text-md font-medium leading-none">
                      {rec.date}
                    </h4>
                    {rec.records.length > 0 ? (
                      rec.records.map((innerRecord, index2) => (
                        <div key={index2} className="text-gray-300 text-sm">
                          <div className="mb-2">
                            <span className="text-blue-400">
                              {innerRecord.time}
                            </span>
                            :{" "}
                            <strong className="text-white">
                              {innerRecord.name}
                            </strong>{" "}
                            {innerRecord.action}
                          </div>
                          <Separator className="my-2 border-gray-600" />
                        </div>
                      ))
                    ) : (
                      <div className="text-gray-400">No records found</div>
                    )}
                  </div>
                </ScrollArea>
              </HoverCardContent>
            </HoverCard>
          ))}
        </div>
      )}
      {!loading && showTableInitial && records.length === 0 && (
        <div className="text-gray-400">No records found</div>
      )}
    </div>
  );
}

// ✅ Wrap inside Suspense to prevent Next.js SSR issues
export default function SearchByIPPage() {
  return (
    <Suspense fallback={<div className="text-white">Loading...</div>}>
      <SearchByIPComponent />
    </Suspense>
  );
}
