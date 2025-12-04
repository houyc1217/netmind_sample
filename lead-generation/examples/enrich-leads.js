import { enrichment } from '../index.js';

/**
 * Example: Enrich Lead Data
 *
 * Demonstrates how to enrich people and organization data
 * NOTE: Enrichment consumes API credits
 */

async function main() {
  console.log('=== Lead Enrichment Examples ===\n');

  // Example 1: Enrich a single person by email
  console.log('1. Enriching person by email...');
  const personResult = await enrichment.enrichPerson({
    email: 'tim@apollo.io'
  });

  if (personResult.success && personResult.data) {
    console.log('Enriched person:', {
      name: personResult.data.name,
      title: personResult.data.title,
      email: personResult.data.email,
      company: personResult.data.organization?.name
    });
  } else {
    console.log('Person not found or enrichment failed');
  }

  // Example 2: Enrich person by name and company
  console.log('\n2. Enriching person by name and company domain...');
  const personResult2 = await enrichment.enrichPerson({
    first_name: 'Tim',
    last_name: 'Zheng',
    domain: 'apollo.io'
  });

  if (personResult2.success && personResult2.data) {
    console.log('Enriched person:', {
      name: personResult2.data.name,
      title: personResult2.data.title
    });
  }

  // Example 3: Bulk enrich multiple people
  console.log('\n3. Bulk enriching multiple people...');
  const peopleToEnrich = [
    { email: 'tim@apollo.io' },
    { first_name: 'Roy', last_name: 'Chung', domain: 'apollo.io' }
  ];

  const bulkResult = await enrichment.enrichPeopleBulk(peopleToEnrich);

  if (bulkResult.success) {
    console.log(`Successfully enriched ${bulkResult.data.filter(m => m.person).length} people`);
    bulkResult.data.forEach((match, index) => {
      if (match.person) {
        console.log(`  ${index + 1}. ${match.person.name} - ${match.person.title}`);
      }
    });
  }

  // Example 4: Enrich organization
  console.log('\n4. Enriching organization data...');
  const orgResult = await enrichment.enrichOrganization('apollo.io');

  if (orgResult.success && orgResult.data) {
    console.log('Enriched organization:', {
      name: orgResult.data.name,
      industry: orgResult.data.industry,
      employees: orgResult.data.estimated_num_employees,
      revenue: orgResult.data.estimated_annual_revenue
    });
  }

  // Example 5: Bulk enrich organizations
  console.log('\n5. Bulk enriching organizations...');
  const orgsToEnrich = ['apollo.io', 'microsoft.com', 'salesforce.com'];
  const bulkOrgResult = await enrichment.enrichOrganizationsBulk(orgsToEnrich);

  if (bulkOrgResult.success) {
    console.log(`Successfully enriched ${bulkOrgResult.data.filter(o => o).length} organizations`);
    bulkOrgResult.data.forEach(org => {
      if (org) {
        console.log(`  - ${org.name} (${org.estimated_num_employees} employees)`);
      }
    });
  }
}

main().catch(console.error);
