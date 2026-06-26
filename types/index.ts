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

export interface Report {
  id: number;
  user: User;
  reportDate: string;
  completedYesterday: string;
  planToday: string;
  finishEstimation: string;
  blockers: string;
  mood: string;
  createdAt: string;
  completedAt: string;
}


export interface NewEmployee {
  id: number;
  fullName: string;
  email: string;
  isActive: boolean;
}
export interface NewReport {
  id: number;
  employee: NewEmployee;
  reportDate: string;
  completedYesterday: string;
  planToday: string;
  finishEstimation: string;
  blocker: string;
  mood: string;
  createdAt: string;
  completedAt: string;
}

export interface ReportsByUser {
  user: User;
  reports: Report[];
}

export interface ReportsByDate {
  date: string;
  reports: Report[];
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
}

export interface ListResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export type ViewMode = "all" | "by-user" | "by-date";

export type SortOrder = "asc" | "desc";

export interface ReportFilters {
  fromDate: string;
  toDate: string;
  sort: SortOrder;
  page: number;
  limit: number;
}

export interface NewStatusResponse {
  code: number;
  message: string;
  internalMsg: string;
}

export interface NewPaginationMeta {
  count: number;
  currentPage: number;
  perPage: number;
  total: number;
  totalPage: number;
}
export interface NewListResponse<T> {
  status: NewStatusResponse;
  result: T[];
  pagination: NewPaginationMeta;

}