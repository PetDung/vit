"use client"

import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
    Tooltip
} from 'recharts';

const data = [
    {
        subject: 'Độ nhớt',
        A: 120,
        fullMark: 150,
    },
    {
        subject: 'Chịu nhiệt',
        A: 98,
        fullMark: 150,
    },
    {
        subject: 'Tuổi thọ',
        A: 86,
        fullMark: 150,
    },
    {
        subject: 'Chống mài mòn',
        A: 99,
        fullMark: 150,
    },
    {
        subject: 'Tẩy rửa',
        A: 85,
        fullMark: 150,
    },
    {
        subject: 'Tiết kiệm NL',
        A: 65,
        fullMark: 150,
    },
];

export function ProductSpecs() {
    return (
        <div className="w-full h-[300px] md:h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                    <PolarGrid stroke="#e5e5e5" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#888', fontSize: 12 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                    <Radar
                        name="Lesturbo Specs"
                        dataKey="A"
                        stroke="#FFD700"
                        strokeWidth={3}
                        fill="#FFD700"
                        fillOpacity={0.3}
                    />
                    <Tooltip
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
}
