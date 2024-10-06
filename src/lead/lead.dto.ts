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
  '$0-$1m' = '$0-$1m',
  '$1m-$10m' = '$1m-$10m',
  '$10m-$25m' = '$10m-$25m',
  '$25m-$50m' = '$25m-$50m',
  '$50m-$100m' = '$50m-$100m',
  '$100m-$250m' = '$100m-$250m',
  '$250m-$500m' = '$250m-$500m',
  '$500m-$1b' = '$500m-$1b',
  '$1b-$10b' = '$1b-$10b',
  '$10b+' = '$10b+',
}

export class PDLDTO {
  id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  sex: string;
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

export class LeadDTO {
  uniqueIdentifier: string;
  firstName: string;
  lastName: string;
  fullName: string;
  linkedinUrl: string;
  linkedinUsername: string;
  linkedinId: string;
  twitterUrl: string;
  twitterUsername: string;
  workEmail: string;
  industry: string;
  jobTitle: string;
  jobCompanyName: string;
  jobCompanyWebsite: string;
  jobCompanyIndustry: string;
  jobCompany12moEmployeeGrowthRate: number;
  jobCompanyTotalFundingRaised: number;
  jobCompanyInferredRevenue: RevenueStages | null;
  jobCompanyEmployeeCount: number;
  jobLastChanged: string;
  jobLastVerified: string;
  jobStartDate: string;
  jobCompanySize: CompanySize | null;
  jobCompanyFounded: number;
  jobCompanyLocationRegion: string;
  locationName: string;
  locationCountry: string;
  skills: string[];
  education: {
    school: string;
    linkedinUrl: string;
    startDate: string | null;
    endDate: string | null;
    degreeName: string | null;
    raw: string[];
    summary: string;
  };
  gender: string;
  companyEmployees: string;
  dataProvider: string;
}

export class LeadResponseDTO {
  leads: LeadDTO[];
  scrollToken?: string | null;
  datasetVersion?: string | null;
  totalCount?: number;
  pageNumber?: number;
  pageSize?: number;
}
