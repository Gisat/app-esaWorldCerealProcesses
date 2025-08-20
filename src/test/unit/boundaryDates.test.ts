import getBoundaryDates from "@features/(processes)/_utils/boundaryDates";

function expectYMD(date: Date, y: number, mZeroBased: number, d: number) {
    expect(date.getFullYear()).toBe(y);
    expect(date.getMonth()).toBe(mZeroBased); // 0 = Jan
    expect(date.getDate()).toBe(d);
}

describe('getBoundaryDates (interval = 12)', () => {
    it('end-of-month with 31 days (2024-10-31)', () => {
        const { startDate, endDate } = getBoundaryDates(new Date('2024-10-31'), 12);
        expectYMD(startDate, 2023, 9, 1);  // 2023-10-01
        expectYMD(endDate, 2024, 9, 31);   // 2024-10-31
    });

    it('leap year February (2024-02-29)', () => {
        const { startDate, endDate } = getBoundaryDates(new Date('2024-02-29'), 12);
        expectYMD(startDate, 2023, 1, 1);  // 2023-02-01
        expectYMD(endDate, 2024, 1, 29);   // 2024-02-29
    });

    it('non-leap February (2025-02-28)', () => {
        const { startDate, endDate } = getBoundaryDates(new Date('2025-02-28'), 12);
        expectYMD(startDate, 2024, 1, 1);  // 2024-02-01
        expectYMD(endDate, 2025, 1, 28);   // 2025-02-28
    });

    it('year boundary (2025-01-15)', () => {
        const { startDate, endDate } = getBoundaryDates(new Date('2025-01-15'), 12);
        expectYMD(startDate, 2024, 0, 1);  // 2024-01-01
        expectYMD(endDate, 2025, 0, 31);   // 2025-01-31
    });

    it('month with 30 days (2025-04-30)', () => {
        const { startDate, endDate } = getBoundaryDates(new Date('2025-04-30'), 12);
        expectYMD(startDate, 2024, 3, 1);  // 2024-04-01
        expectYMD(endDate, 2025, 3, 30);   // 2025-04-30
    });

    it('month with 31 days (2025-03-31)', () => {
        const { startDate, endDate } = getBoundaryDates(new Date('2025-03-31'), 12);
        expectYMD(startDate, 2024, 2, 1);  // 2024-03-01
        expectYMD(endDate, 2025, 2, 31);   // 2025-03-31
    });

    it('December end-of-year (2025-12-31)', () => {
        const { startDate, endDate } = getBoundaryDates(new Date('2025-12-31'), 12);
        expectYMD(startDate, 2024, 11, 1); // 2024-12-01
        expectYMD(endDate, 2025, 11, 31);  // 2025-12-31
    });

    it('mid-month (2025-07-10)', () => {
        const { startDate, endDate } = getBoundaryDates(new Date('2025-07-10'), 12);
        expectYMD(startDate, 2024, 6, 1);  // 2024-07-01
        expectYMD(endDate, 2025, 6, 31);   // 2025-07-31
    });

    it('DST boundary region example (2025-10-27)', () => {
        const { startDate, endDate } = getBoundaryDates(new Date('2025-10-27'), 12);
        expectYMD(startDate, 2024, 9, 1);  // 2024-10-01
        expectYMD(endDate, 2025, 9, 31);   // 2025-10-31
    });

    it('first day of month (2024-11-01)', () => {
        const { startDate, endDate } = getBoundaryDates(new Date('2024-11-01'), 12);
        expectYMD(startDate, 2023, 10, 1); // 2023-11-01
        expectYMD(endDate, 2024, 10, 30);  // 2024-11-30
    });
});