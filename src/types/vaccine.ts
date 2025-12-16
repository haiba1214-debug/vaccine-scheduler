export type IntervalUnit = 'days' | 'weeks' | 'months' | 'years';

export interface Interval {
    value: number;
    unit: IntervalUnit;
}

export interface ScheduleConstraint {
    start: Interval;
    end?: Interval; // If missing, implies "start" is the exact point or "onwards" depending on context?
    // User context: 
    // "2-4 weeks" -> start: 2w, end: 4w
    // "24 weeks onwards" -> start: 24w, end: undefined (infinite)
}

export interface VaccineRule {
    doseNumber: number;
    fromDose: number; // Relative to which dose
    constraint: ScheduleConstraint;
    alternatives?: ScheduleConstraint[]; // For "14 or 21 days" -> Main rule 14d, alternative 21d?
}

// But wait, Hep B has AND condition.
// Dose 3: From Dose 1 (20-24w) AND From Dose 2 (16-20w).
// So we need an array of conditions for a single dose.

export interface DoseCondition {
    fromDose: number;
    min: Interval; // Use min/max for clarity
    max?: Interval;
}

export interface DoseRule {
    doseNumber: number;
    // ALL conditions must be met (intersection of time windows)
    // Logic for Rabies "14 OR 21" is a disjunction (OR).
    // "20-24 AND 16-20" is conjunction (AND).
    // Most vaccines are AND. Rabies is special.

    type: 'range' | 'options';
    conditions?: DoseCondition[]; // Used if type is 'range'
    options?: { fromDose: number; interval: Interval }[]; // Used if type is 'options'
}

export interface Vaccine {
    id: string;
    name: string;
    rules: DoseRule[];
}
