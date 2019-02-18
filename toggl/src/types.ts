export class Client {
    name: string;
    at: string;
    id: number;
    wid: number;
}

export interface Invoice {
    hours: string;
    date: string;
    from: string;
    to: string;
    quote: number;
    amount: number;
}

export interface Worksheet {
    period: string;
    days: Day[];
    total: string;
    PT: string;
}

export interface Day {
    dayName: string;
    dayNumber: string;
    hours: string;
    description: string;
}


export class ReportData {
    client: string;
    description: string;
    dur: number;
    start: string;
    end: string;
    pid: number;
    user: string;
}

export class Report {
    total_grand: number;
    data: ReportData[] = [];
    total_count: number;
    per_page: number;
}

export class Project {
    id: number;
    name: string;
}

export class TimeEntry {
    id: number;
    start: string;
    description: string;
    pid: number;
    cid?: number;
}