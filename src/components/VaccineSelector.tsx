import React from 'react';

import { vaccines } from '../data/vaccines';

interface Props {
    selectedVaccineId: string;
    onSelect: (id: string) => void;
}

export const VaccineSelector: React.FC<Props> = ({ selectedVaccineId, onSelect }) => {
    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
                ワクチンを選択
            </label>
            <select
                value={selectedVaccineId}
                onChange={(e) => onSelect(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
            >
                <option value="">選択してください</option>
                {vaccines.map((v) => (
                    <option key={v.id} value={v.id}>
                        {v.name}
                    </option>
                ))}
            </select>
        </div>
    );
};
