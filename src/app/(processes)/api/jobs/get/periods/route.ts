import { NextResponse } from 'next/server';

export async function GET() {
    // Mock data for suggested periods
    const suggestedPeriods = [
        {
            id: '1',
            startDate: '2023-06',
            endDate: '2023-11',
        },
        {
            id: '2',
            startDate: '2022-11',
            endDate: '2023-07',
        },
        {
            id: '3',
            startDate: '2021-02',
            endDate: '2021-06',
        },
    ];

    return NextResponse.json(suggestedPeriods);
}

