"use client";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useId, useState } from "react";

import { Button } from "@/shared/components/shadcn-ui/button";
import { Calendar } from "@/shared/components/shadcn-ui/calendar";
import { Card, CardContent } from "@/shared/components/shadcn-ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/shadcn-ui/popover";
import { ScrollArea } from "@/shared/components/shadcn-ui/scroll-area";
import { cn } from "@/shared/utils/lib/utils";

export function Pattern() {
  const id = useId();
  const today = new Date();
  const [date, setDate] = useState<Date>(today);
  const [time, setTime] = useState<string | null>(null);

  // Mock time slots data
  const timeSlots = [
    { available: false, time: "09:00" },
    { available: false, time: "09:30" },
    { available: true, time: "10:00" },
    { available: true, time: "10:30" },
    { available: true, time: "11:00" },
    { available: true, time: "11:30" },
    { available: false, time: "12:00" },
    { available: true, time: "12:30" },
    { available: true, time: "13:00" },
    { available: true, time: "13:30" },
    { available: true, time: "14:00" },
    { available: false, time: "14:30" },
    { available: false, time: "15:00" },
    { available: true, time: "15:30" },
    { available: true, time: "16:00" },
    { available: true, time: "16:30" },
    { available: true, time: "17:00" },
    { available: true, time: "17:30" },
  ];

  return (
    <Popover>
      <PopoverTrigger>
        <Button className="group/pick-date w-60 justify-between" id={id} variant={"outline"}>
          <span className={cn("truncate", date && "text-muted-foreground")}>
            {date ? format(date, "LLL dd, y") : "Pick a date"}
          </span>
          <CalendarIcon
            aria-hidden="true"
            className="text-muted-foreground/80 group-hover:text-foreground shrink-0 transition-colors"
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0">
        <Card className="p-0">
          <CardContent className="p-0">
            <div className="flex max-sm:flex-col">
              <Calendar
                disabled={[{ before: today }]}
                mode="single"
                onSelect={(newDate) => {
                  if (newDate) {
                    setDate(newDate);
                    setTime(null);
                  }
                }}
                selected={date}
              />
              <div className="relative w-full max-sm:h-48 sm:w-40">
                <div className="absolute inset-0 py-4 max-sm:border-t">
                  <ScrollArea className="h-full sm:border-s">
                    <div className="space-y-3">
                      <div className="flex h-5 shrink-0 items-center px-5">
                        <p className="text-sm font-medium">{format(date, "EEEE, d")}</p>
                      </div>
                      <div className="grid gap-1.5 px-5 max-sm:grid-cols-2">
                        {timeSlots.map(({ time: timeSlot, available }) => (
                          <Button
                            className="w-full"
                            disabled={!available}
                            key={timeSlot}
                            onClick={() => setTime(timeSlot)}
                            size="sm"
                            variant={time === timeSlot ? "default" : "outline"}
                          >
                            {timeSlot}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
}
