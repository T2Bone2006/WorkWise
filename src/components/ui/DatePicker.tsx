"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

function formatDate(date: Date | undefined) {
    if (!date) {
        return ""
    }
    return date.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    })
}

function isValidDate(date: Date | undefined) {
    if (!date) {
        return false
    }
    return !isNaN(date.getTime())
}

interface DatePickerProps {
    date?: Date
    setDate: (date: Date | undefined) => void
    disabled?: boolean
}

export function DatePicker({ date, setDate, disabled }: DatePickerProps) {
    const [open, setOpen] = React.useState(false)
    const [month, setMonth] = React.useState<Date | undefined>(date)
    const [value, setValue] = React.useState(formatDate(date))

    // Update value when date prop changes
    React.useEffect(() => {
        setValue(formatDate(date))
        if (date) {
            setMonth(date)
        }
    }, [date])

    return (
        <div className="relative flex gap-2">
            <Input
                id="date"
                value={value}
                placeholder="Select a date"
                className="bg-background pr-10"
                disabled={disabled}
                onChange={(e) => {
                    const newDate = new Date(e.target.value)
                    setValue(e.target.value)
                    if (isValidDate(newDate)) {
                        setDate(newDate)
                        setMonth(newDate)
                    }
                }}
                onKeyDown={(e) => {
                    if (e.key === "ArrowDown" && !disabled) {
                        e.preventDefault()
                        setOpen(true)
                    }
                }}
            />
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        id="date-picker"
                        variant="ghost"
                        disabled={disabled}
                        className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
                    >
                        <CalendarIcon className="size-3.5" />
                        <span className="sr-only">Select date</span>
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    className="w-auto overflow-hidden p-0"
                    align="end"
                    alignOffset={-8}
                    sideOffset={10}
                >
                    <Calendar
                        mode="single"
                        selected={date}
                        captionLayout="dropdown"
                        month={month}
                        onMonthChange={setMonth}
                        onSelect={(selectedDate) => {
                            setDate(selectedDate)
                            setValue(formatDate(selectedDate))
                            setOpen(false)
                        }}
                        disabled={(calendarDate) => {
                            const today = new Date()
                            today.setHours(0, 0, 0, 0)
                            return calendarDate < today
                        }}
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}