"use client";

import { useCallback, useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DateRangeProps {
  value: [Date | null, Date | null];
  onChange: (value: [Date | null, Date | null]) => void;
  className?: string;
}

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
}

export function DateRange({ value, onChange, className }: DateRangeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [startInputValue, setStartInputValue] = useState("");
  const [endInputValue, setEndInputValue] = useState("");

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (value[0]) {
      setStartInputValue(formatDate(value[0]));
    }
    if (value[1]) {
      setEndInputValue(formatDate(value[1]));
    }
  }, [value]);

  useEffect(() => {
    if (value[0] && value[0].getTime() !== currentDate.getTime()) {
      setCurrentDate(new Date(value[0]));
    }
  }, [value, currentDate]); // Added currentDate to dependencies

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const years = Array.from(
    { length: 10 },
    (_, i) => currentDate.getFullYear() + i
  );

  const getDaysInMonth = (date: Date): CalendarDay[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days: CalendarDay[] = [];
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    for (let i = 0; i < firstDay.getDay(); i++) {
      const prevDate = new Date(year, month, -i);
      days.push({ date: prevDate, isCurrentMonth: false });
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
      const currentDate = new Date(year, month, i);
      days.push({ date: currentDate, isCurrentMonth: true });
    }

    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      const nextDate = new Date(year, month + 1, i);
      days.push({ date: nextDate, isCurrentMonth: false });
    }

    return days;
  };

  const handleDateClick = (date: Date) => {
    if (!value[0] || (value[0] && value[1])) {
      onChange([date, null]);
    } else if (value[0] && !value[1]) {
      const [start, end] = [value[0], date].sort(
        (a, b) => a.getTime() - b.getTime()
      );
      onChange([start, end]);
    }
  };

  const handleQuickSelection = (start: Date, end: Date) => {
    onChange([start, end]);
    setIsOpen(false);
  };

  const formatDate = (date: Date | null): string => {
    if (!date) return "";
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const parseDate = (dateStr: string): Date | null => {
    const parts = dateStr.split("/");
    if (parts.length !== 3) return null;

    const [day, month, year] = parts.map(Number);
    if (isNaN(day) || isNaN(month) || isNaN(year)) return null;

    const date = new Date(year, month - 1, day);
    return isNaN(date.getTime()) ? null : date;
  };

  const handleInputChange = useCallback(
    (inputValue: string, isStart: boolean) => {
      const date = parseDate(inputValue);
      if (date) {
        if (isStart) {
          onChange([date, value[1] && date <= value[1] ? value[1] : null]);
        } else {
          onChange([value[0] && value[0] <= date ? value[0] : null, date]);
        }
      }
    },
    [onChange, value]
  );

  const handleMonthChange = (monthIndex: string) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(Number(monthIndex));
    setCurrentDate(newDate);
  };

  const handleYearChange = (yearStr: string) => {
    const newDate = new Date(currentDate);
    newDate.setFullYear(Number(yearStr));
    setCurrentDate(newDate);
  };

  const isInRange = (date: Date): boolean => {
    if (value[0] && value[1]) {
      return date >= value[0] && date <= value[1];
    }
    if (value[0] && hoverDate) {
      return (
        (date >= value[0] && date <= hoverDate) ||
        (date <= value[0] && date >= hoverDate)
      );
    }
    return false;
  };

  const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between w-[300px] py-2 text-sm ${className}`}
      >
        <span className="text-black underline">
          {value[0] || value[1]
            ? `${formatDate(value[0])} ~ ${formatDate(value[1])}`
            : "Maak uw keuze"}
        </span>
      </button>

      {isOpen && (
        <div className="absolute top-[-4px] bg-white border shadow-lg z-50 w-[40vw]">
          <div className="flex gap-4 px-4 py-1">
            <div className="flex-1">
              <input
                type="text"
                value={startInputValue}
                onChange={(e) => {
                  setStartInputValue(e.target.value);
                  handleInputChange(e.target.value, true);
                }}
                placeholder="dd/MM/yyyy"
                className="w-full px-3 py-2 border rounded text-sm"
                maxLength={10}
              />
            </div>
            <div className="flex-1">
              <input
                type="text"
                value={endInputValue}
                onChange={(e) => {
                  setEndInputValue(e.target.value);
                  handleInputChange(e.target.value, false);
                }}
                placeholder="dd/MM/yyyy"
                className="w-full px-3 py-2 border rounded text-sm"
                maxLength={10}
              />
            </div>
          </div>

          <div className="flex w-full">
            {[0, 1].map((offset) => {
              const monthDate = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth() + offset
              );
              return (
                <div key={offset} className="p-2 w-full">
                  <div className="flex items-center justify-between mb-1 w-full">
                    <button
                      onClick={() =>
                        setCurrentDate(
                          new Date(
                            currentDate.getFullYear(),
                            currentDate.getMonth() - 1
                          )
                        )
                      }
                      className="p-1 hover:bg-gray-100 rounded-full"
                      disabled={offset !== 0}
                    >
                      <ChevronLeft className="h-4 w-4 text-gray-600" />
                    </button>
                    <div className="flex items-center gap-2">
                      <Select
                        value={monthDate.getMonth().toString()}
                        onValueChange={(value) => handleMonthChange(value)}
                      >
                        <SelectTrigger className="w-[100px] h-8 text-xs">
                          <SelectValue>
                            {months[monthDate.getMonth()]}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {months.map((month, index) => (
                            <SelectItem
                              key={index}
                              value={index.toString()}
                              className="text-xs"
                            >
                              {month}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select
                        value={monthDate.getFullYear().toString()}
                        onValueChange={(value) => handleYearChange(value)}
                      >
                        <SelectTrigger className="w-[80px] h-8 text-xs">
                          <SelectValue>
                            {monthDate.getFullYear().toString()}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {years.map((year) => (
                            <SelectItem
                              key={year}
                              value={year.toString()}
                              className="text-xs"
                            >
                              {year.toString()}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <button
                      onClick={() =>
                        setCurrentDate(
                          new Date(
                            currentDate.getFullYear(),
                            currentDate.getMonth() + 1
                          )
                        )
                      }
                      className="p-1 hover:bg-gray-100 rounded-full"
                      disabled={offset !== 1}
                    >
                      <ChevronRight className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                  <div className="grid grid-cols-7 gap-1 w-full">
                    {weekDays.map((day) => (
                      <div
                        key={day}
                        className="text-center text-xs text-gray-500 h-6 flex items-center justify-center"
                      >
                        {day}
                      </div>
                    ))}
                    {getDaysInMonth(monthDate).map(
                      ({ date, isCurrentMonth }, index) => (
                        <button
                          key={index}
                          onClick={() => handleDateClick(date)}
                          onMouseEnter={() => setHoverDate(date)}
                          onMouseLeave={() => setHoverDate(null)}
                          className={`h-6 w-6 text-xs rounded-md flex items-center justify-center
                          ${!isCurrentMonth && "text-gray-300"}
                          ${
                            isCurrentMonth &&
                            !isInRange(date) &&
                            "text-gray-700 hover:bg-gray-100"
                          }
                          ${isInRange(date) && "bg-blue-100 text-blue-800"}
                          ${
                            (value[0]?.getTime() === date.getTime() ||
                              value[1]?.getTime() === date.getTime()) &&
                            "bg-blue-500 text-white"
                          }
                          ${
                            value[0] &&
                            !value[1] &&
                            hoverDate &&
                            date > value[0] &&
                            date <= hoverDate &&
                            "bg-blue-50"
                          }
                        `}
                        >
                          {date.getDate()}
                        </button>
                      )
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-2 px-2 py-2 border-t w-full">
            <button
              className="text-blue-500 hover:text-blue-600 text-xs"
              onClick={() => {
                const today = new Date();
                handleQuickSelection(today, today);
              }}
            >
              Today
            </button>
            <button
              className="text-blue-500 hover:text-blue-600 text-xs"
              onClick={() => {
                const today = new Date();
                const yesterday = new Date(today);
                yesterday.setDate(yesterday.getDate() - 1);
                handleQuickSelection(yesterday, yesterday);
              }}
            >
              Yesterday
            </button>
            <button
              className="text-blue-500 hover:text-blue-600 text-xs"
              onClick={() => {
                const today = new Date();
                const last7Days = new Date(today);
                last7Days.setDate(last7Days.getDate() - 6);
                handleQuickSelection(last7Days, today);
              }}
            >
              Last 7 Days
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="ml-auto bg-blue-100 text-blue-500 px-4 py-1 rounded text-xs"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

