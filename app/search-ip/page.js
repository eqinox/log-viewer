"use client";
import { useState, useEffect } from "react";
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

export default function SearchByIP() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [ip, setIp] = useState("");
  const [records, setRecords] = useState([]);
  const [error, setError] = useState("");

  // Fetch records based on IP
  const fetchRecords = async (ipAddress) => {
    if (!ipAddress.trim()) return;

    try {
      const res = await axios.get(`/api/records/ip/${ipAddress}`);
      res.data.forEach((item) => {
        item.records = JSON.parse(item.records);
      });
      console.log("res", res.data);
      setRecords(res.data);
      setError("");
    } catch (err) {
      setError("No records found for this IP.");
      setRecords([]);
    }
  };

  // Handle form submit
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!ip.trim()) {
      setError("Please enter an IP address.");
      return;
    }

    // Update URL query params
    router.push(`?ip=${encodeURIComponent(ip)}`, { scroll: false });

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
    <div className="p-6">
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

      {error && <p className="text-red-500 mt-2">{error}</p>}

      {records.length > 0 && (
        <div>
          {records.map((rec, index) => (
            <HoverCard key={index}>
              <HoverCardTrigger asChild>
                <Button variant="link" className="text-white">
                  {rec.date}
                </Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-96">
                <ScrollArea className="h-72 rounded-md border">
                  <div className="p-2">
                    <h4 className="mb-4 text-md font-medium leading-none">
                      {rec.date}
                    </h4>
                    {rec.records.length > 0 &&
                      rec.records.map((innerRecord, index2) => (
                        <div key={index2}>
                          <div key={index2} className="text-xl">
                            {innerRecord.time}:{" "}
                            <strong>{innerRecord.name}</strong>{" "}
                            {innerRecord.action}
                          </div>
                          <Separator className="my-2" />
                        </div>
                      ))}
                    {rec.records.length === 0 && <div>No records found</div>}
                  </div>
                </ScrollArea>
              </HoverCardContent>
            </HoverCard>
          ))}
        </div>
      )}
    </div>
  );
}
