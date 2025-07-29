import { NextResponse } from 'next/server';

export async function GET() {
    const { INSTANCE_WARNING_HIDDEN, INSTANCE_WARNING_COLOR, INSTANCE_WARNING_TEXT } = process.env;
    return NextResponse.json({
        INSTANCE_WARNING_HIDDEN,
        INSTANCE_WARNING_COLOR,
        INSTANCE_WARNING_TEXT
    });
}