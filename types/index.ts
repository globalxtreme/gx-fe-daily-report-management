export interface User {
  id: number;
  name: string;
  slackId: string;
}

export interface AuthUser {
  id: string;
  fullName: string;
  givenName: string;
  email: string;
  jobPositionName: string;
  departmentName: string;
}

export interface AuthEmployee {
  status: StatusResponse;
  result: EmployeeFull;
}

export interface EmployeeFull {
  id: number;
  fullName: string;
  email: string;
  isActive: boolean;
  slackEmail: string;
  slackId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Employee {
  id: number;
  fullName: string;
  email: string;
  isActive: boolean;
}
export interface Report {
  id: number;
  employee: Employee;
  reportDate: string;
  completedYesterday: string;
  planToday: string;
  finishEstimation: string;
  blocker: string;
  mood: string;
  createdAt: string;
  completedAt: string;
}

export interface ReportsByEmployee {
  employee: Employee;
  employeeId: string;
  count: number
  dailyReports: Report[];
  pagination: PaginationMeta;
}

export interface ReportsByDate {
  date: string;
  count: number
  dailyReports: Report[];
  pagination: PaginationMeta;
}

export type ViewMode = "all" | "by-employee" | "by-date";

export type SortOrder = "asc" | "desc";

export interface ReportFilters {
  fromDate: string;
  toDate: string;
  sort: SortOrder;
  page: number;
  limit: number;
}

export interface StatusResponse {
  code: number;
  message: string;
  internalMsg: string;
}

export interface PaginationMeta {
  count: number;
  currentPage: number;
  perPage: number;
  total: number;
  totalPage: number;
}
export interface ListResponse<T> {
  status: StatusResponse;
  result: T[];
  pagination: PaginationMeta;

}