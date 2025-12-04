# 🚀 Quick Start Guide

## Installation

```bash
cd lead-generation
npm install
```

## Configuration

Your API credentials are already configured in `.env`:
- ✅ Apollo API Key: Configured
- ✅ Netmind API Token: Configured

## Test Your Setup

```bash
npm test
```

## Run Examples

### 1. Search for Leads

```bash
npm run example:search
```

This will search for:
- Tech decision makers in San Francisco
- Marketing professionals
- Growing startups
- Companies using Salesforce

### 2. Enrich Lead Data

```bash
npm run example:enrich
```

**Note:** This consumes API credits!

### 3. Complete Workflow

```bash
npm run example:workflow
```

This demonstrates end-to-end workflows:
- Find and save decision makers
- Custom lead generation with filters
- Find companies with job openings

## Quick Usage

### Search for Tech Leaders

```javascript
import { workflow } from './index.js';

const results = await workflow.findDecisionMakers(
  'San Francisco',      // Location
  ['Tech Leaders'],     // List name
  25                    // Max results
);

console.log(`Found ${results.searched} leads`);
console.log(`Created ${results.created} contacts`);
```

### Custom Search

```javascript
import { search, contacts } from './index.js';

// 1. Search for leads
const people = await search.searchPeople({
  person_titles: ['VP Sales', 'Sales Director'],
  person_locations: ['New York'],
  person_seniorities: ['vp', 'director']
});

// 2. Create contacts
for (const person of people.data) {
  await contacts.createContact({
    first_name: person.first_name,
    last_name: person.last_name,
    email: person.email,
    title: person.title,
    organization_name: person.organization?.name,
    label_names: ['Sales Leads 2025']
  });
}
```

## Common Filters

### By Job Title
```javascript
person_titles: ['CEO', 'CTO', 'VP Engineering', 'Director']
```

### By Seniority
```javascript
person_seniorities: ['c_suite', 'vp', 'director', 'manager']
```

### By Location
```javascript
person_locations: ['San Francisco', 'New York', 'Boston']
```

### By Company Size
```javascript
organization_num_employees_ranges: ['51,200', '201,500', '501,1000']
```

### By Technology
```javascript
currently_using_any_of_technology_uids: ['salesforce', 'hubspot', 'google_analytics']
```

## Best Practices

1. **Start Small**: Test with small batches (10-25 leads)
2. **Save Credits**: Set `enrichData: false` unless needed
3. **Use Lists**: Organize contacts with `label_names`
4. **Rate Limiting**: System auto-limits requests (10/min default)
5. **Error Handling**: Check `success` field in all responses

## Next Steps

1. ✅ Review the full [README.md](./README.md)
2. ✅ Explore example scripts in `/examples`
3. ✅ Customize workflows for your use case
4. ✅ Integrate with your CRM/tools

## Need Help?

- **Full Documentation**: See [README.md](./README.md)
- **API Reference**: [Apollo.io API Docs](https://docs.apollo.io/)
- **MCP Server**: [NetMind AI Services](https://www.netmind.ai/AIServices/apollo-io)

## Architecture Overview

```
lead-generation/
├── modules/          # Core functionality
│   ├── search.js     # Find leads
│   ├── enrichment.js # Enrich data
│   ├── contacts.js   # Manage contacts
│   └── outreach.js   # Automation
├── workflows/        # Pre-built workflows
├── examples/         # Usage examples
└── config/           # Configuration
```

Each module is independent and can be used separately or combined in workflows.

---

**Ready to generate leads? Run `npm test` to verify your setup!**
