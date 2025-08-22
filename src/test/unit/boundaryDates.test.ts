import getBoundaryDates from "@features/(processes)/_utils/boundaryDates";

describe('getBoundaryDates interval=12 (inclusive)', () => {
    it('ref 2024-10-31 => 2023-11-01..2024-10-31 (12 months)', () => {
        const { startDate, endDate } = getBoundaryDates(new Date('2024-10-31'), 12);
        expect(startDate).toEqual(new Date('2023-11-01'));
        expect(endDate).toEqual(new Date('2024-10-31'));
    });

    it('ref 2024-02-29 => 2023-03-01..2024-02-29 (leap year)', () => {
        const { startDate, endDate } = getBoundaryDates(new Date('2024-02-29'), 12);
        expect(startDate).toEqual(new Date('2023-03-01'));
        expect(endDate).toEqual(new Date('2024-02-29'));
    });

    it('ref 2025-02-28 => 2024-03-01..2025-02-28 (non-leap Feb)', () => {
        const { startDate, endDate } = getBoundaryDates(new Date('2025-02-28'), 12);
        expect(startDate).toEqual(new Date('2024-03-01'));
        expect(endDate).toEqual(new Date('2025-02-28'));
    });

    it('ref 2025-01-15 => 2024-02-01..2025-01-31 (year boundary)', () => {
        const { startDate, endDate } = getBoundaryDates(new Date('2025-01-15'), 12);
        expect(startDate).toEqual(new Date('2024-02-01'));
        expect(endDate).toEqual(new Date('2025-01-31'));
    });

    it('ref 2025-04-30 => 2024-05-01..2025-04-30 (30-day month)', () => {
        const { startDate, endDate } = getBoundaryDates(new Date('2025-04-30'), 12);
        expect(startDate).toEqual(new Date('2024-05-01'));
        expect(endDate).toEqual(new Date('2025-04-30'));
    });

    it('ref 2025-03-31 => 2024-04-01..2025-03-31 (31-day month)', () => {
        const { startDate, endDate } = getBoundaryDates(new Date('2025-03-31'), 12);
        expect(startDate).toEqual(new Date('2024-04-01'));
        expect(endDate).toEqual(new Date('2025-03-31'));
    });

    it('ref 2025-12-31 => 2025-01-01..2025-12-31 (end of year)', () => {
        const { startDate, endDate } = getBoundaryDates(new Date('2025-12-31'), 12);
        expect(startDate).toEqual(new Date('2025-01-01'));
        expect(endDate).toEqual(new Date('2025-12-31'));
    });

    it('ref 2025-07-10 => 2024-08-01..2025-07-31 (mid-month)', () => {
        const { startDate, endDate } = getBoundaryDates(new Date('2025-07-10'), 12);
        expect(startDate).toEqual(new Date('2024-08-01'));
        expect(endDate).toEqual(new Date('2025-07-31'));
    });

    it('ref 2025-10-27 => 2024-11-01..2025-10-31 (DST period example)', () => {
        const { startDate, endDate } = getBoundaryDates(new Date('2025-10-27'), 12);
        expect(startDate).toEqual(new Date('2024-11-01'));
        expect(endDate).toEqual(new Date('2025-10-31'));
    });

    it('ref 2024-11-01 => 2023-12-01..2024-11-30 (first day of month)', () => {
        const { startDate, endDate } = getBoundaryDates(new Date('2024-11-01'), 12);
        expect(startDate).toEqual(new Date('2023-12-01'));
        expect(endDate).toEqual(new Date('2024-11-30'));
    });

    it('ref 2024-01-31 => 2023-02-01..2024-01-31 (Jan end)', () => {
        const { startDate, endDate } = getBoundaryDates(new Date('2024-01-31'), 12);
        expect(startDate).toEqual(new Date('2023-02-01'));
        expect(endDate).toEqual(new Date('2024-01-31'));
    });
});