import { TSearchLeads } from './campaign.dto';

function addTermsQuery(field: string, values: any[], mustClauses: any[]) {
  if (values && values.length > 0) {
    mustClauses.push({
      terms: {
        [field]: values,
      },
    });
  }
}

export function generateESQuery(createDTO: TSearchLeads) {
  const mustClauses: any[] = [];

  addTermsQuery('countries', createDTO.locations, mustClauses);
  addTermsQuery('industry', createDTO.industries, mustClauses);
  addTermsQuery('job_company_size', createDTO.companySizes, mustClauses);

  mustClauses.push(
    { exists: { field: 'linkedin_url' } },
    { exists: { field: 'location_name' } },
    { exists: { field: 'industry' } },
    { exists: { field: 'job_title' } },
    { exists: { field: 'twitter_url' } },
    { exists: { field: 'work_email' } },
  );

  return mustClauses;
}
