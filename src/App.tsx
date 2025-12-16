import { useState, useMemo } from 'react';
import { parseISO, format } from 'date-fns';
import { Calendar, Syringe, AlertCircle, CheckCircle2 } from 'lucide-react';
import { vaccines } from './data/vaccines';
import { VaccineSelector } from './components/VaccineSelector';
import { DoseDateInput } from './components/DoseDateInput';
import { calculateDoseSchedule } from './utils/scheduler';
import type { ScheduleCalculationResult } from './utils/scheduler';

function App() {
  const [selectedVaccineId, setSelectedVaccineId] = useState<string>('');
  const [doseDates, setDoseDates] = useState<Record<number, string>>({});

  const selectedVaccine = useMemo(() =>
    vaccines.find(v => v.id === selectedVaccineId),
    [selectedVaccineId]
  );

  const handleVaccineChange = (id: string) => {
    setSelectedVaccineId(id);
    setDoseDates({}); // Reset dates when vaccine changes
  };

  const handleDateChange = (doseNumber: number, date: string) => {
    setDoseDates(prev => ({ ...prev, [doseNumber]: date }));
  };

  const renderScheduleResult = (result: ScheduleCalculationResult) => {
    if (result.type === 'not_ready') return null;
    if (result.type === 'error') {
      return (
        <div className="mt-2 text-sm text-red-600 flex items-center">
          <AlertCircle className="w-4 h-4 mr-1" />
          {result.message}
        </div>
      );
    }

    if (result.type === 'range' && result.start) {
      return (
        <div className="mt-2 text-sm bg-blue-50 p-3 rounded-md border border-blue-100">
          <div className="font-semibold text-blue-800 mb-1">推奨接種期間:</div>
          <div className="text-blue-900">
            {format(result.start, 'yyyy/MM/dd')}
            {result.end ? ` 〜 ${format(result.end, 'yyyy/MM/dd')}` : ' 以降'}
          </div>
        </div>
      );
    }

    if (result.type === 'options' && result.dates) {
      return (
        <div className="mt-2 text-sm bg-blue-50 p-3 rounded-md border border-blue-100">
          <div className="font-semibold text-blue-800 mb-1">推奨接種日:</div>
          <ul className="list-disc list-inside text-blue-900">
            {result.dates.map((d, i) => (
              <li key={i}>{format(d, 'yyyy/MM/dd')}</li>
            ))}
          </ul>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-indigo-600 p-6 flex items-center">
          <Syringe className="text-white w-8 h-8 mr-3" />
          <h1 className="text-xl font-bold text-white">
            ワクチン接種スケジュール
          </h1>
        </div>

        <div className="p-6">
          <VaccineSelector
            selectedVaccineId={selectedVaccineId}
            onSelect={handleVaccineChange}
          />

          {!selectedVaccine && (
            <div className="text-center text-gray-500 py-8">
              <Calendar className="w-12 h-12 mx-auto mb-2 opacity-20" />
              <p>ワクチンを選択してスケジュールを開始してください</p>
            </div>
          )}

          {selectedVaccine && (
            <div className="space-y-6">
              {/* Always show Dose 1 Input */}
              <div className="border-l-4 border-indigo-500 pl-4 py-1">
                <DoseDateInput
                  doseNumber={1}
                  date={doseDates[1] || ''}
                  onChange={(d) => handleDateChange(1, d)}
                />
              </div>

              {/* Loop through rules to show subsequent doses */}
              {selectedVaccine.rules.map((rule) => {
                // Parse current inputs to Dates
                const parsedDates: Record<number, Date> = {};
                Object.entries(doseDates).forEach(([k, v]) => {
                  if (v) parsedDates[Number(k)] = parseISO(v);
                });

                const result = calculateDoseSchedule(rule, parsedDates);

                // Show this block if we have valid inputs for calculation OR if users already inputted data for this dose
                // Actually, let's always show the container, but maybe disabled state?

                // For simplicity: Always render the block for the dose defined in rules
                const isCompleted = !!doseDates[rule.doseNumber];

                return (
                  <div key={rule.doseNumber} className={`border-l-4 pl-4 py-1 ${isCompleted ? 'border-green-500' : 'border-gray-200'}`}>

                    <div className="flex justify-between items-start">
                      <DoseDateInput
                        doseNumber={rule.doseNumber}
                        date={doseDates[rule.doseNumber] || ''}
                        onChange={(d) => handleDateChange(rule.doseNumber, d)}
                      />
                      {isCompleted && <CheckCircle2 className="w-5 h-5 text-green-500 mt-8" />}
                    </div>

                    {!isCompleted && renderScheduleResult(result)}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
