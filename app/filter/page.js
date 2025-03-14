"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export default function FilterByDate() {
  const [years, setYears] = useState([]);
  const [months, setMonths] = useState([]);
  const [dates, setDates] = useState([]);
  const [ips, setIps] = useState([]);

  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    axios.get("/api/records/years").then((res) => setYears(res.data));
  }, []);

  const handleYearSelect = async (year) => {
    setSelectedYear(year);
    setMonths([]);
    setDates([]);
    setIps([]);
    const res = await axios.get(`/api/records/year/${year}`);
    setMonths(res.data);
  };

  const handleMonthSelect = async (month) => {
    setSelectedMonth(month);
    setDates([]);
    setIps([]);
    const res = await axios.get(`/api/records/year/${selectedYear}/${month}`);
    setDates(res.data);
  };

  const handleDateSelect = async (date) => {
    setSelectedDate(date);
    const res = await axios.get(
      `/api/records/year/${selectedYear}/${selectedMonth}/${date}`
    );
    setIps(res.data);
  };

  return (
    <div>
      <h2>Filter by Date</h2>

      <label>Year: </label>
      {years.map((year) => (
        <button key={year} onClick={() => handleYearSelect(year)}>
          {year}
        </button>
      ))}

      {selectedYear && months.length > 0 && (
        <>
          <h3>Months</h3>
          {months.map((month) => (
            <button key={month} onClick={() => handleMonthSelect(month)}>
              {month}
            </button>
          ))}
        </>
      )}

      {selectedMonth && dates.length > 0 && (
        <>
          <h3>Dates</h3>
          {dates.map((date) => (
            <button key={date} onClick={() => handleDateSelect(date)}>
              {date}
            </button>
          ))}
        </>
      )}

      {selectedDate && ips.length > 0 && (
        <>
          <h3>
            IPs on {selectedYear}-{selectedMonth}-{selectedDate}
          </h3>
          <ul>
            {ips.map((ip) => (
              <li key={ip.ip}>{ip.ip}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
