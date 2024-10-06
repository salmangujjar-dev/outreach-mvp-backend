export enum CompanySize {
  '1-10' = '1-10',
  '11-50' = '11-50',
  '51-200' = '51-200',
  '201-500' = '201-500',
  '501-1000' = '501-1000',
  '1001-5000' = '1001-5000',
  '5001-10000' = '5001-10000',
  '10001+' = '10001+',
}

export enum RevenueStages {
  '$0-$1M' = '$0-$1M',
  '$1M-$10M' = '$1M-$10M',
  '$10M-$25M' = '$10M-$25M',
  '$25M-$50M' = '$25M-$50M',
  '$50M-$100M' = '$50M-$100M',
  '$100M-$250M' = '$100M-$250M',
  '$250M-$500M' = '$250M-$500M',
  '$500M-$1B' = '$500M-$1B',
  '$1B-$10B' = '$1B-$10B',
  '$10B+' = '$10B+',
}

export class LeadDTO {
  unique_identifier: string;
  first_name: string;
  last_name: string;
  full_name: string;
  linkedin_url: string;
  linkedin_username: string;
  linkedin_id: string;
  twitter_url: string;
  twitter_username: string;
  work_email: string;
  industry: string;
  job_title: string;
  job_company_name: string;
  job_company_website: string;
  job_company_industry: string;
  job_company_12mo_employee_growth_rate: number;
  job_company_total_funding_raised: number;
  job_company_inferred_revenue: RevenueStages | null;
  job_company_employee_count: number;
  job_last_changed: string;
  job_last_verified: string;
  job_start_date: string;
  job_company_size: CompanySize | null;
  job_company_founded: number;
  job_company_location_region: string;
  location_name: string;
  location_country: string;
  skills: string[];
  education: {
    school: string;
    linkedin_url: string;
    start_date: string | null;
    end_date: string | null;
    degree_name: string | null;
    raw: string[];
    summary: string;
  };
  gender: string;
  company_employees: string;
  data_provider: string;
}

export class LeadResponseDTO {
  leads: LeadDTO[];
  scrollToken?: string | null;
  datasetVersion?: string | null;
  totalCount?: number;
  pageNumber?: number;
  pageSize?: number;
}
