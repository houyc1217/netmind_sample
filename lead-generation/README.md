# Lead Generation Module

A minimal, modular lead generation system built on Apollo.io API, following 2025 best practices for scalable architecture and sales automation.

## Features

✅ **Modular Architecture** - Self-contained modules with clear interfaces
✅ **Lead Search** - Find people and organizations with advanced filtering
✅ **Data Enrichment** - Enrich contact and company data
✅ **Contact Management** - Create and manage contacts and accounts
✅ **Outreach Automation** - Sequences, tasks, and campaign management
✅ **Error Handling** - Robust error handling with retry logic
✅ **Rate Limiting** - Automatic rate limiting to respect API constraints
✅ **Workflows** - Pre-built workflows for common use cases

## Architecture

```
lead-generation/
├── config/           # Environment-based configuration
├── modules/          # Core functionality modules
│   ├── search.js     # Lead search
│   ├── enrichment.js # Data enrichment
│   ├── contacts.js   # Contact management
│   └── outreach.js   # Outreach automation
├── workflows/        # Orchestration workflows
├── utils/            # Utilities (logging, API client)
├── examples/         # Usage examples
└── index.js          # Main entry point
```

## Installation

```bash
cd lead-generation
npm install
```

## Configuration

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Add your API credentials to `.env`:
```env
APOLLO_API_KEY=your_apollo_api_key
NETMIND_API_TOKEN=your_netmind_api_token
```

## Quick Start

### Option 1: Use Pre-built Workflows

```javascript
import { workflow } from './index.js';

// Find and save decision makers
const results = await workflow.findDecisionMakers(
  'San Francisco',      // Location
  ['Tech Leaders'],     // Lists to add to
  25                    // Max results
);

console.log(`Created ${results.created} contacts`);
```

### Option 2: Use Individual Modules

```javascript
import { search, contacts } from './index.js';

// Search for leads
const searchResults = await search.searchPeople({
  person_titles: ['CTO', 'VP Engineering'],
  person_locations: ['San Francisco'],
  per_page: 10
});

// Create contacts
for (const person of searchResults.data) {
  await contacts.createContact({
    first_name: person.first_name,
    last_name: person.last_name,
    email: person.email,
    title: person.title,
    organization_name: person.organization?.name,
    label_names: ['Tech Leads']
  });
}
```

## Core Modules

### 1. Search Module

Find people and organizations with advanced filtering.

```javascript
import { search } from './index.js';

// Search for people
const people = await search.searchPeople({
  person_titles: ['CEO', 'CTO'],
  person_seniorities: ['c_suite'],
  person_locations: ['California'],
  organization_num_employees_ranges: ['51,200']
});

// Search for organizations
const orgs = await search.searchOrganizations({
  organization_locations: ['New York'],
  revenue_range: { min: 1000000, max: 10000000 }
});

// Preset searches
const techLeads = await search.searchTechDecisionMakers('Boston');
const salesLeads = await search.searchSalesLeaders('Texas');
const startups = await search.searchGrowingStartups('Austin');
```

### 2. Enrichment Module

Enrich contact and company data (costs API credits).

```javascript
import { enrichment } from './index.js';

// Enrich single person
const person = await enrichment.enrichPerson({
  email: 'john@example.com'
});

// Bulk enrich people (up to 10)
const people = await enrichment.enrichPeopleBulk([
  { email: 'john@example.com' },
  { first_name: 'Jane', last_name: 'Doe', domain: 'example.com' }
]);

// Enrich organization
const org = await enrichment.enrichOrganization('apollo.io');

// Bulk enrich organizations (up to 10)
const orgs = await enrichment.enrichOrganizationsBulk([
  'apollo.io',
  'salesforce.com'
]);
```

### 3. Contacts Module

Manage contacts and accounts in Apollo.

```javascript
import { contacts } from './index.js';

// Create contact
const contact = await contacts.createContact({
  first_name: 'John',
  last_name: 'Doe',
  email: 'john@example.com',
  title: 'CTO',
  organization_name: 'Example Corp',
  label_names: ['Tech Leads']
});

// Search contacts
const results = await contacts.searchContacts({
  q_keywords: 'engineering',
  per_page: 10
});

// Create account (company)
const account = await contacts.createAccount({
  name: 'Example Corp',
  domain: 'example.com'
});
```

### 4. Outreach Module

Automate outreach with sequences and tasks.

```javascript
import { outreach } from './index.js';

// Search sequences
const sequences = await outreach.searchSequences({
  q_name: 'sales outreach'
});

// Add contacts to sequence
await outreach.addContactsToSequence(
  sequenceId,
  [contactId1, contactId2],
  emailAccountId
);

// Create task
await outreach.createTask({
  user_id: userId,
  contact_ids: [contactId],
  priority: 'high',
  due_at: '2025-12-15T10:00:00Z',
  type: 'call',
  note: 'Follow up on demo request'
});
```

## Workflows

Complete end-to-end workflows combining multiple modules.

### Generate Leads Workflow

```javascript
import { workflow } from './index.js';

const results = await workflow.generateLeads({
  searchFilters: {
    person_titles: ['VP Sales', 'Sales Director'],
    person_locations: ['New York'],
    person_seniorities: ['vp', 'director']
  },
  enrichData: false,          // Set to true to enrich (costs credits)
  addToLists: ['Sales Leads'],
  sequenceId: 'optional_sequence_id',
  emailAccountId: 'email_account_id',
  maxResults: 25
});

console.log(results);
// {
//   searched: 25,
//   enriched: 0,
//   created: 23,
//   addedToSequence: 23,
//   errors: [...]
// }
```

### Preset Workflows

```javascript
// Find decision makers
await workflow.findDecisionMakers('San Francisco', ['Leaders'], 25);

// Find hiring companies
await workflow.findHiringCompanies('Software Engineer', 'California', 20);
```

## Examples

Run the example scripts:

```bash
# Search for leads
npm run example:search

# Enrich lead data
npm run example:enrich

# Complete workflow
npm run example:workflow
```

## Best Practices

### 1. Rate Limiting
The system automatically rate-limits requests. Adjust in `.env`:
```env
RATE_LIMIT=10  # requests per minute
```

### 2. Credit Management
Enrichment and some searches consume API credits:
- Set `enrichData: false` to save credits
- Use preset searches when possible
- Batch operations for efficiency

### 3. Error Handling
All modules return standardized responses:
```javascript
{
  success: true/false,
  data: [...],
  error: "error message" // if failed
}
```

### 4. Filtering Strategy
Start broad, then narrow:
1. Search by location and company size
2. Filter by seniority level
3. Refine by job title
4. Add technology/industry filters

### 5. Workflow Design
- **Search → Filter → Enrich → Store → Outreach**
- Process in batches (10-25 leads)
- Add to lists for segmentation
- Use sequences for automation

## API Reference

### Search Filters

**People Search:**
- `person_titles[]` - Job titles
- `person_locations[]` - Personal locations
- `person_seniorities[]` - Seniority levels (c_suite, vp, director, manager, senior, entry)
- `organization_locations[]` - Company HQ locations
- `organization_num_employees_ranges[]` - Employee ranges (e.g., "51,200")
- `contact_email_status[]` - Email status (verified, unverified, unavailable)
- `currently_using_any_of_technology_uids[]` - Technologies used

**Organization Search:**
- `organization_locations[]` - HQ locations
- `organization_num_employees_ranges[]` - Employee ranges
- `revenue_range` - {min, max} revenue
- `currently_using_any_of_technology_uids[]` - Technologies
- `q_organization_name` - Name keyword

### Task Types

- `call` - Phone call
- `outreach_manual_email` - Email
- `linkedin_step_connect` - LinkedIn connection
- `linkedin_step_message` - LinkedIn message
- `linkedin_step_view_profile` - View LinkedIn profile
- `action_item` - Generic action

## Resources

- **Apollo.io API Docs**: https://docs.apollo.io/
- **MCP Server**: https://www.netmind.ai/AIServices/apollo-io
- **Best Practices**: See references below

## Architecture Principles

Based on 2025 industry best practices:

1. **Modular Design** - Self-contained modules with clear boundaries
2. **API-First** - Standardized interfaces for integration
3. **Phased Implementation** - Start small, scale gradually
4. **Error Resilience** - Retry logic and graceful degradation
5. **Performance** - Rate limiting and batch operations
6. **Security** - Environment-based configuration

## Troubleshooting

### API Authentication Errors
- Verify API keys in `.env`
- Check if keys have required permissions
- Ensure master API key for certain endpoints

### Rate Limiting
- Increase delay between requests (RATE_LIMIT in .env)
- Reduce batch sizes
- Implement exponential backoff (built-in)

### No Results Found
- Broaden search filters
- Check filter combinations
- Verify location/title spelling

## Contributing

This is a minimal implementation. Extend by:
- Adding more preset workflows
- Implementing data validation
- Adding analytics/reporting
- Creating integrations with other tools

## License

MIT

---

## References

- [Lead Generation Best Practices 2025](https://mindstamp.com/blog/lead-generation-best-practices)
- [Apollo.io API Integration Guide](https://scrupp.com/blog/apollo-io-api-documentation)
- [Modular Architecture Best Practices](https://expertextend.de/en/modular-architecture-patterns-enterprise-systems/)
- [B2B Sales Automation with Apollo.io](https://www.flatlineagency.com/blog/b2b-sales-automation-with-apollo-io/)
