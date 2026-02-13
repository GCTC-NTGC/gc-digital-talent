# Release Risk Assessment Tool

## Overview

The Release Risk Assessment Tool is a comprehensive QA automation script designed to analyze git changes between releases and generate detailed risk assessment reports. As a senior QA engineer, you can use this tool to systematically evaluate the risk profile of any release.

## Features

This tool analyzes the following risk categories:

### 1. **Functional Risk**
- Evaluates the scope of changes
- Analyzes API and GraphQL schema modifications
- Assesses frontend component changes
- Provides risk scoring based on the extent of changes

### 2. **Data Integrity Risk**
- Identifies database migrations
- Flags database-related file modifications
- Tracks deleted files that may affect data
- Provides specific file lists for review

### 3. **Security Risk**
- Detects authentication/authorization changes
- Identifies configuration modifications
- Flags security-sensitive files (password, token, credentials, etc.)
- Highlights critical security areas requiring review

### 4. **Backward Compatibility Risk**
- Analyzes API changes
- Evaluates GraphQL schema modifications
- Tracks deleted files that may break dependencies
- Assesses database migration impacts

### 5. **Test Coverage Gaps**
- Calculates test-to-production file ratios
- Identifies areas lacking test coverage
- Flags API changes without corresponding tests
- Recommends testing strategies

## Installation

No installation required! The tool is a standalone Node.js script that uses only built-in modules.

### Prerequisites

- Node.js >= 24.12.0
- Git repository with tags or commits to compare

## Usage

### Basic Usage

```bash
node scripts/release-risk-assessment.js \
  --release "Release Name" \
  --from v2.64.2 \
  --to v2.65.0
```

### Command Line Options

| Option | Alias | Required | Description |
|--------|-------|----------|-------------|
| `--release` | `-r` | No | Name of the release (e.g., "Be-e-e yourself") |
| `--from` | `-f` | **Yes** | Starting git ref (tag, branch, or commit SHA) |
| `--to` | `-t` | **Yes** | Ending git ref (tag, branch, or commit SHA) |
| `--output` | `-o` | No | Output file path (default: `release-risk-assessment-report.md`) |

### Examples

#### Example 1: Analyze a named release between two tags
```bash
node scripts/release-risk-assessment.js \
  --release "Be-e-e yourself" \
  --from v2.64.2 \
  --to v2.65.0 \
  --output be-e-e-yourself-risk-report.md
```

#### Example 2: Compare current branch with main
```bash
node scripts/release-risk-assessment.js \
  --from main \
  --to HEAD \
  --output current-changes-risk-report.md
```

#### Example 3: Analyze changes between commits
```bash
node scripts/release-risk-assessment.js \
  --release "Hotfix 123" \
  --from abc1234 \
  --to def5678
```

#### Example 4: Compare two recent releases
```bash
node scripts/release-risk-assessment.js \
  --release "Sprint 42" \
  --from v2.60.0 \
  --to v2.61.0
```

## Output

The tool generates a comprehensive Markdown report containing:

1. **Executive Summary**
   - Overall risk level and score (0-10 scale)
   - Total files changed, lines added/deleted
   - Number of PRs merged

2. **Change Statistics**
   - Detailed breakdown of changes
   - File additions, modifications, deletions

3. **Pull Requests Included**
   - List of all PR numbers in the release
   - Links to PRs (when available in commit messages)

4. **Risk Assessments** (5 categories)
   - Each with a risk level (LOW/MEDIUM/HIGH)
   - Detailed analysis and findings
   - Specific file lists for critical areas

5. **Recommendations**
   - Actionable items based on risk level
   - Deployment strategies
   - Testing requirements

6. **Detailed File Changes**
   - Categorized by type (migrations, API, GraphQL, auth, tests)
   - Truncated lists for large change sets

## Risk Scoring

Each risk category is scored on a 0-10 scale:
- **0-2**: LOW risk
- **3-6**: MEDIUM risk
- **7-10**: HIGH risk

The overall risk is the average of all five categories.

## Integration with CI/CD

### GitHub Actions Example

```yaml
name: Release Risk Assessment

on:
  push:
    tags:
      - 'v*'

jobs:
  assess-risk:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0  # Need full history for git comparisons
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '24'
      
      - name: Get previous tag
        id: prev_tag
        run: |
          PREV_TAG=$(git tag --sort=-v:refname | sed -n '2p')
          echo "prev_tag=$PREV_TAG" >> $GITHUB_OUTPUT
      
      - name: Generate Risk Assessment
        run: |
          node scripts/release-risk-assessment.js \
            --release "${{ github.ref_name }}" \
            --from "${{ steps.prev_tag.outputs.prev_tag }}" \
            --to "${{ github.ref_name }}"
      
      - name: Upload Report
        uses: actions/upload-artifact@v4
        with:
          name: risk-assessment-report
          path: release-risk-assessment-report.md
```

### Pre-release Checklist Integration

Add to your release process:

```markdown
## Pre-Release Checklist

- [ ] Run risk assessment tool
- [ ] Review risk assessment report
- [ ] Address HIGH risk items
- [ ] Plan mitigation for MEDIUM risk items
- [ ] Ensure test coverage meets standards
- [ ] Security review for auth/config changes
- [ ] Database migration testing complete
```

## Interpreting Results

### HIGH Risk Findings
- **Action Required**: Must be addressed before release
- Conduct thorough code review
- Implement additional testing
- Consider phased rollout or feature flags

### MEDIUM Risk Findings
- **Caution Advised**: Review carefully
- Ensure adequate test coverage
- Plan monitoring strategy
- Document known limitations

### LOW Risk Findings
- **Standard Process**: Follow normal procedures
- Include in regression testing
- Monitor post-deployment

## Best Practices

1. **Run Early and Often**
   - Generate reports during development
   - Use for sprint planning and risk management
   - Compare across multiple releases

2. **Combine with Other QA Tools**
   - Code coverage reports
   - Static analysis (CodeQL, ESLint, PHPStan)
   - End-to-end test results

3. **Track Trends**
   - Save reports for historical analysis
   - Monitor risk scores over time
   - Identify patterns in high-risk areas

4. **Share with Team**
   - Include in release notes
   - Discuss in deployment meetings
   - Use for stakeholder communication

## Limitations

- **PR Detection**: Relies on commit messages containing PR numbers (e.g., "#12345")
- **Pattern Matching**: File categorization uses pattern matching, may miss edge cases
- **Context**: Cannot understand semantic changes, only structural
- **False Positives**: May flag benign changes in sensitive areas

## Customization

The tool can be customized by modifying the following functions in the script:

- `analyzeFileChanges()`: Add or modify file categorization patterns
- `assess*Risk()`: Adjust scoring algorithms for each risk type
- `generateReport()`: Customize report format and content

## Troubleshooting

### "ambiguous argument" error
**Problem**: Git refs don't exist in the shallow clone

**Solution**: Fetch tags/history first:
```bash
git fetch --tags --depth=100
```

### No PRs detected
**Problem**: Commit messages don't follow PR merge pattern

**Solution**: The tool still works but won't list PRs. Ensure your git workflow includes PR numbers in merge commits.

### Large change sets cause slow analysis
**Problem**: Analyzing thousands of files is time-consuming

**Solution**: Use `--from` and `--to` to narrow the scope, or run the tool with specific commit ranges.

## Support

For issues or feature requests, please contact the QA team or open an issue in the repository.

## License

This tool is part of the GC Digital Talent project and follows the same license (AGPL-3.0).

---

**Version**: 1.0  
**Last Updated**: 2026-02-13  
**Maintained By**: Senior QA Engineering Team
