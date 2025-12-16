import type { Vaccine } from '../types/vaccine';

export const vaccines: Vaccine[] = [
    {
        id: 'hep-a',
        name: 'A型肝炎 (エイムゲン)',
        rules: [
            {
                doseNumber: 2,
                type: 'range',
                conditions: [
                    {
                        fromDose: 1,
                        min: { value: 2, unit: 'weeks' },
                        max: { value: 4, unit: 'weeks' }
                    }
                ]
            },
            {
                doseNumber: 3,
                type: 'range',
                conditions: [
                    {
                        fromDose: 1,
                        min: { value: 24, unit: 'weeks' }
                        // "以降" implies no max, or at least not specified
                    }
                ]
            }
        ]
    },
    {
        id: 'hep-b',
        name: 'B型肝炎',
        rules: [
            {
                doseNumber: 2,
                type: 'range',
                conditions: [
                    {
                        fromDose: 1,
                        min: { value: 4, unit: 'weeks' }
                    }
                ]
            },
            {
                doseNumber: 3,
                type: 'range',
                conditions: [
                    // "初回から20-24週以降" -> Interpreting as min 20 weeks
                    {
                        fromDose: 1,
                        min: { value: 20, unit: 'weeks' }
                    },
                    // "2回目から16-20週以降" -> Interpreting as min 16 weeks
                    {
                        fromDose: 2,
                        min: { value: 16, unit: 'weeks' }
                    }
                ]
            }
        ]
    },
    {
        id: 'rabies',
        name: '狂犬病',
        rules: [
            {
                doseNumber: 2,
                type: 'options',
                options: [
                    { fromDose: 1, interval: { value: 7, unit: 'days' } }
                ]
            },
            {
                doseNumber: 3,
                type: 'options',
                options: [
                    { fromDose: 1, interval: { value: 14, unit: 'days' } },
                    { fromDose: 1, interval: { value: 21, unit: 'days' } }
                ]
            }
        ]
    },
    {
        id: 'je',
        name: '日本脳炎',
        rules: [
            {
                doseNumber: 2,
                type: 'range',
                conditions: [
                    {
                        fromDose: 1,
                        min: { value: 1, unit: 'weeks' },
                        max: { value: 4, unit: 'weeks' }
                    }
                ]
            },
            {
                doseNumber: 3,
                type: 'range',
                conditions: [
                    {
                        fromDose: 2,
                        min: { value: 1, unit: 'years' }
                        // "1年後" -> Usually means exactly 1 year or after? 
                        // "Approx 1 year later". I'll treat as min 1 year.
                    }
                ]
            }
        ]
    }
];
