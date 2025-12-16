import React from 'react';

interface Props {
    doseNumber: number;
    date: string;
    onChange: (date: string) => void;
}

export const DoseDateInput: React.FC<Props> = ({ doseNumber, date, onChange }) => {
    return (
        <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {doseNumber}回目の接種日
            </label>
            <input
                type="date"
                value={date}
                onChange={(e) => onChange(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
            />
        </div>
    );
};
