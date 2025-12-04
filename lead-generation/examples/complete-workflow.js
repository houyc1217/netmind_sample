import { workflow } from '../index.js';

/**
 * Example: Complete Lead Generation Workflow
 *
 * Demonstrates end-to-end lead generation:
 * 1. Search for leads
 * 2. (Optional) Enrich data
 * 3. Create contacts in Apollo
 * 4. (Optional) Add to sequence
 */

async function main() {
  console.log('=== Complete Lead Generation Workflow ===\n');

  // Workflow 1: Find and save decision makers
  console.log('Workflow 1: Finding tech decision makers...');
  const results1 = await workflow.findDecisionMakers(
    'San Francisco',
    ['Tech Leaders Q4 2025'],
    10 // Max 10 results
  );

  console.log('Results:', {
    searched: results1.searched,
    created: results1.created,
    errors: results1.errors?.length || 0
  });

  // Workflow 2: Custom workflow with enrichment
  console.log('\n\nWorkflow 2: Custom lead generation with filters...');
  const results2 = await workflow.generateLeads({
    searchFilters: {
      person_titles: ['VP Sales', 'Sales Director'],
      person_seniorities: ['vp', 'director'],
      person_locations: ['New York', 'Boston'],
      organization_num_employees_ranges: ['51,200', '201,500']
    },
    enrichData: false, // Set to true to enrich (costs credits)
    addToLists: ['Sales Leaders'],
    maxResults: 10
  });

  console.log('Results:', {
    searched: results2.searched,
    created: results2.created,
    errors: results2.errors?.length || 0
  });

  // Workflow 3: Find hiring companies
  console.log('\n\nWorkflow 3: Finding companies hiring engineers...');
  const results3 = await workflow.findHiringCompanies(
    'Software Engineer',
    'California',
    15
  );

  if (results3.companies) {
    console.log(`Found ${results3.count} companies with engineering openings`);
    console.log('\nSample companies:');
    results3.companies.slice(0, 3).forEach(company => {
      console.log(`  - ${company.name} (${company.estimated_num_employees} employees)`);
    });
  }

  // Workflow 4: Full workflow with sequence (requires setup)
  /*
  console.log('\n\nWorkflow 4: Full workflow with sequence...');
  const results4 = await workflow.generateLeads({
    searchFilters: {
      person_titles: ['Marketing Manager'],
      person_locations: ['United States']
    },
    enrichData: false,
    addToLists: ['Marketing Outreach'],
    sequenceId: 'YOUR_SEQUENCE_ID', // Get from sequences
    emailAccountId: 'YOUR_EMAIL_ACCOUNT_ID', // Get from email accounts
    maxResults: 5
  });

  console.log('Results:', {
    searched: results4.searched,
    created: results4.created,
    addedToSequence: results4.addedToSequence,
    errors: results4.errors?.length || 0
  });
  */
}

main().catch(console.error);
