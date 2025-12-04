import { search } from '../index.js';

/**
 * Example: Search for Leads
 *
 * Demonstrates how to search for people and organizations
 * using various filters and preset searches
 */

async function main() {
  console.log('=== Lead Search Examples ===\n');

  // Example 1: Search for tech decision makers
  console.log('1. Searching for tech decision makers in San Francisco...');
  const techLeads = await search.searchTechDecisionMakers('San Francisco', 1);

  if (techLeads.success) {
    console.log(`Found ${techLeads.data.length} tech decision makers`);
    if (techLeads.data[0]) {
      console.log('Sample result:', {
        name: techLeads.data[0].name,
        title: techLeads.data[0].title,
        company: techLeads.data[0].organization?.name
      });
    }
  }

  // Example 2: Custom people search
  console.log('\n2. Custom search for marketing managers...');
  const marketingLeads = await search.searchPeople({
    person_titles: ['Marketing Manager', 'Marketing Director'],
    person_seniorities: ['manager', 'director'],
    person_locations: ['United States'],
    organization_num_employees_ranges: ['51,200', '201,500'],
    per_page: 10
  });

  if (marketingLeads.success) {
    console.log(`Found ${marketingLeads.data.length} marketing professionals`);
  }

  // Example 3: Search for growing startups
  console.log('\n3. Searching for growing startups...');
  const startups = await search.searchGrowingStartups('New York', 1);

  if (startups.success) {
    console.log(`Found ${startups.data.length} growing startups`);
    if (startups.data[0]) {
      console.log('Sample startup:', {
        name: startups.data[0].name,
        employees: startups.data[0].estimated_num_employees,
        industry: startups.data[0].industry
      });
    }
  }

  // Example 4: Search organizations with specific technology
  console.log('\n4. Searching for companies using Salesforce...');
  const techCompanies = await search.searchOrganizations({
    currently_using_any_of_technology_uids: ['salesforce'],
    organization_locations: ['California'],
    per_page: 10
  });

  if (techCompanies.success) {
    console.log(`Found ${techCompanies.data.length} companies using Salesforce`);
  }
}

main().catch(console.error);
