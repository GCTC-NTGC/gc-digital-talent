import { followUpDateOverdueInfo } from "./searchRequestUtils";

describe("followUpDateOverdueInfo", () => {
  const now = new Date("2026-07-10T19:00:00Z");

  test("is not overdue when follow-up date is tomorrow", () => {
    const followUpDate = new Date("2026-07-11T04:00:00Z");
    expect(followUpDateOverdueInfo(followUpDate, now)).toEqual({
      daysOverdue: -1,
      isOverdue: false,
      isDueToday: false,
    });
  });

  test("is due today, not overdue, when follow-up date is today", () => {
    const followUpDate = new Date("2026-07-10T04:00:00Z");
    expect(followUpDateOverdueInfo(followUpDate, now)).toEqual({
      daysOverdue: 0,
      isOverdue: false,
      isDueToday: true,
    });
  });

  test("is overdue when follow-up date was yesterday", () => {
    const followUpDate = new Date("2026-07-09T04:00:00Z");
    expect(followUpDateOverdueInfo(followUpDate, now)).toEqual({
      daysOverdue: 1,
      isOverdue: true,
      isDueToday: false,
    });
  });

  test("is not overdue when follow-up date is null", () => {
    expect(followUpDateOverdueInfo(null, now)).toEqual({
      daysOverdue: -1,
      isOverdue: false,
      isDueToday: false,
    });
  });
});
