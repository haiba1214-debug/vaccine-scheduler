import { addDays, addWeeks, addMonths, addYears } from 'date-fns';
import type { Interval, DoseRule } from '../types/vaccine';

export function addInterval(date: Date, interval: Interval): Date {
    switch (interval.unit) {
        case 'days': return addDays(date, interval.value);
        case 'weeks': return addWeeks(date, interval.value);
        case 'months': return addMonths(date, interval.value);
        case 'years': return addYears(date, interval.value);
    }
}

export type ScheduleCalculationResult =
    | { type: 'range'; start: Date; end?: Date }
    | { type: 'options'; dates: Date[] }
    | { type: 'not_ready'; missingDose: number }
    | { type: 'error'; message: string };

export function calculateDoseSchedule(
    rule: DoseRule,
    doseDates: Record<number, Date>
): ScheduleCalculationResult {
    // Check if required previous doses are present
    // Logic: Scan all dependencies in conditions/options to see if we have the base dates.

    if (rule.type === 'options' && rule.options) {
        const dates: Date[] = [];
        for (const opt of rule.options) {
            const baseDate = doseDates[opt.fromDose];
            if (!baseDate) return { type: 'not_ready', missingDose: opt.fromDose };
            dates.push(addInterval(baseDate, opt.interval));
        }
        return { type: 'options', dates };
    }

    if (rule.type === 'range' && rule.conditions) {
        let maxMinDate: Date | null = null; // The latest "early bound"
        let minMaxDate: Date | null = null; // The earliest "late bound" (if any) -> Actually we want intersection. 
        // Since we want "Must satisfy Condition A AND Condition B", 
        // Start Date = Max(StartA, StartB)
        // End Date = Min(EndA, EndB) (if they exist)

        for (const cond of rule.conditions) {
            const baseDate = doseDates[cond.fromDose];
            if (!baseDate) return { type: 'not_ready', missingDose: cond.fromDose };

            const startDate = addInterval(baseDate, cond.min);

            if (!maxMinDate || startDate > maxMinDate) {
                maxMinDate = startDate;
            }

            if (cond.max) {
                const endDate = addInterval(baseDate, cond.max);
                // If minMaxDate is null, this is the first max constraint.
                // If we already have a minMaxDate, take the smaller one (intersection).
                if (!minMaxDate || endDate < minMaxDate) {
                    minMaxDate = endDate;
                }
            }
        }

        if (!maxMinDate) return { type: 'error', message: 'No conditions defined' };

        // Check if window is valid
        if (minMaxDate && maxMinDate > minMaxDate) {
            return { type: 'error', message: 'Conflicting schedule constraints: Minimum date is AFTER Maximum date' };
        }

        return {
            type: 'range',
            start: maxMinDate,
            end: minMaxDate || undefined
        };
    }

    return { type: 'error', message: 'Invalid rule configuration' };
}
