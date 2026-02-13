#!/usr/bin/env node

/**
 * Release Risk Assessment Tool
 * 
 * This tool generates a comprehensive risk assessment report for a given release
 * by analyzing PRs, git diffs, and the project structure.
 * 
 * Usage: node scripts/release-risk-assessment.js --release "Be-e-e yourself" --from v2.64.0 --to v2.65.0
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    release: null,
    from: null,
    to: null,
    output: 'release-risk-assessment-report.md'
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--release' || args[i] === '-r') {
      options.release = args[++i];
    } else if (args[i] === '--from' || args[i] === '-f') {
      options.from = args[++i];
    } else if (args[i] === '--to' || args[i] === '-t') {
      options.to = args[++i];
    } else if (args[i] === '--output' || args[i] === '-o') {
      options.output = args[++i];
    }
  }

  return options;
}

// Execute git command
function gitCommand(cmd) {
  try {
    return execSync(cmd, { cwd: repoRoot, encoding: 'utf-8' }).trim();
  } catch (error) {
    console.error(`Error executing: ${cmd}`);
    console.error(error.message);
    return '';
  }
}

// Get PRs between two tags/commits
function getPRsBetweenRefs(from, to) {
  const log = gitCommand(`git --no-pager log ${from}..${to} --oneline --grep="(#[0-9]\\+)"`);
  const prPattern = /#(\d+)/g;
  const prs = new Set();
  
  log.split('\n').forEach(line => {
    const matches = line.matchAll(prPattern);
    for (const match of matches) {
      prs.add(match[1]);
    }
  });

  return Array.from(prs);
}

// Get changed files between two refs
function getChangedFiles(from, to) {
  const output = gitCommand(`git --no-pager diff --name-status ${from}..${to}`);
  const files = {
    added: [],
    modified: [],
    deleted: [],
    renamed: []
  };

  output.split('\n').forEach(line => {
    if (!line) return;
    const parts = line.split('\t');
    const status = parts[0];
    const file = parts[1];

    if (status === 'A') files.added.push(file);
    else if (status === 'M') files.modified.push(file);
    else if (status === 'D') files.deleted.push(file);
    else if (status.startsWith('R')) files.renamed.push(file);
  });

  return files;
}

// Analyze file changes for risk categories
function analyzeFileChanges(changedFiles) {
  const analysis = {
    database: [],
    api: [],
    frontend: [],
    auth: [],
    config: [],
    tests: [],
    migrations: [],
    graphql: []
  };

  const allFiles = [
    ...changedFiles.added,
    ...changedFiles.modified,
    ...changedFiles.deleted
  ];

  allFiles.forEach(file => {
    if (file.includes('database/migrations')) analysis.migrations.push(file);
    else if (file.includes('database/')) analysis.database.push(file);
    else if (file.includes('/api/')) analysis.api.push(file);
    else if (file.includes('apps/') || file.includes('packages/')) analysis.frontend.push(file);
    else if (file.includes('auth') || file.includes('Auth') || file.includes('permission')) analysis.auth.push(file);
    else if (file.includes('.env') || file.includes('config/')) analysis.config.push(file);
    else if (file.includes('test') || file.includes('Test') || file.includes('.spec.') || file.includes('.test.')) analysis.tests.push(file);
    else if (file.includes('.graphql') || file.includes('graphql/')) analysis.graphql.push(file);
  });

  return analysis;
}

// Get diff statistics
function getDiffStats(from, to) {
  const output = gitCommand(`git --no-pager diff --stat ${from}..${to}`);
  const lines = output.split('\n');
  const lastLine = lines[lines.length - 1];
  
  // Parse stats like "123 files changed, 1234 insertions(+), 567 deletions(-)"
  const stats = {
    filesChanged: 0,
    insertions: 0,
    deletions: 0
  };

  const match = lastLine.match(/(\d+) files? changed(?:, (\d+) insertions?\(\+\))?(?:, (\d+) deletions?\(-\))?/);
  if (match) {
    stats.filesChanged = parseInt(match[1]) || 0;
    stats.insertions = parseInt(match[2]) || 0;
    stats.deletions = parseInt(match[3]) || 0;
  }

  return stats;
}

// Assess functional risk
function assessFunctionalRisk(fileAnalysis, stats) {
  let score = 0;
  let details = [];

  // High risk if many files changed
  if (stats.filesChanged > 100) {
    score += 3;
    details.push(`⚠️ HIGH: ${stats.filesChanged} files changed - extensive changes increase risk`);
  } else if (stats.filesChanged > 50) {
    score += 2;
    details.push(`⚠️ MEDIUM: ${stats.filesChanged} files changed`);
  } else {
    score += 1;
    details.push(`✓ LOW: ${stats.filesChanged} files changed - limited scope`);
  }

  // API changes
  if (fileAnalysis.api.length > 0) {
    score += 2;
    details.push(`⚠️ MEDIUM: ${fileAnalysis.api.length} API files changed - potential breaking changes`);
  }

  // GraphQL changes
  if (fileAnalysis.graphql.length > 0) {
    score += 2;
    details.push(`⚠️ MEDIUM: ${fileAnalysis.graphql.length} GraphQL schema files changed - API contract changes`);
  }

  // Frontend changes
  if (fileAnalysis.frontend.length > 20) {
    score += 2;
    details.push(`⚠️ MEDIUM: ${fileAnalysis.frontend.length} frontend files changed`);
  } else if (fileAnalysis.frontend.length > 0) {
    score += 1;
    details.push(`✓ LOW: ${fileAnalysis.frontend.length} frontend files changed`);
  }

  return {
    score: Math.min(score, 10), // Cap at 10
    level: score >= 7 ? 'HIGH' : score >= 4 ? 'MEDIUM' : 'LOW',
    details
  };
}

// Assess data integrity risk
function assessDataIntegrityRisk(fileAnalysis, changedFiles) {
  let score = 0;
  let details = [];

  // Database migrations
  if (fileAnalysis.migrations.length > 0) {
    score += 3;
    details.push(`⚠️ HIGH: ${fileAnalysis.migrations.length} database migration(s) - schema changes require careful review`);
    fileAnalysis.migrations.forEach(m => details.push(`  - ${m}`));
  }

  // Database-related files
  if (fileAnalysis.database.length > 0) {
    score += 2;
    details.push(`⚠️ MEDIUM: ${fileAnalysis.database.length} database-related files changed`);
  }

  // Deleted files
  if (changedFiles.deleted.length > 5) {
    score += 2;
    details.push(`⚠️ MEDIUM: ${changedFiles.deleted.length} files deleted - ensure data cleanup is handled`);
  } else if (changedFiles.deleted.length > 0) {
    score += 1;
    details.push(`✓ LOW: ${changedFiles.deleted.length} files deleted`);
  }

  if (score === 0) {
    details.push('✓ LOW: No database or data-related changes detected');
  }

  return {
    score: Math.min(score, 10),
    level: score >= 6 ? 'HIGH' : score >= 3 ? 'MEDIUM' : 'LOW',
    details
  };
}

// Assess security risk
function assessSecurityRisk(fileAnalysis, changedFiles) {
  let score = 0;
  let details = [];

  // Authentication/authorization changes
  if (fileAnalysis.auth.length > 0) {
    score += 3;
    details.push(`⚠️ HIGH: ${fileAnalysis.auth.length} auth-related files changed - security-critical`);
    fileAnalysis.auth.forEach(f => details.push(`  - ${f}`));
  }

  // Config changes
  if (fileAnalysis.config.length > 0) {
    score += 2;
    details.push(`⚠️ MEDIUM: ${fileAnalysis.config.length} configuration files changed`);
  }

  // Check for common security-sensitive patterns in file names
  const securitySensitivePatterns = ['password', 'token', 'secret', 'key', 'credential', 'session'];
  const sensitiveFiles = [...changedFiles.added, ...changedFiles.modified].filter(file =>
    securitySensitivePatterns.some(pattern => file.toLowerCase().includes(pattern))
  );

  if (sensitiveFiles.length > 0) {
    score += 2;
    details.push(`⚠️ MEDIUM: ${sensitiveFiles.length} security-sensitive files changed`);
    sensitiveFiles.forEach(f => details.push(`  - ${f}`));
  }

  if (score === 0) {
    details.push('✓ LOW: No obvious security-related changes detected');
  }

  return {
    score: Math.min(score, 10),
    level: score >= 6 ? 'HIGH' : score >= 3 ? 'MEDIUM' : 'LOW',
    details
  };
}

// Assess backward compatibility risk
function assessBackwardCompatibilityRisk(fileAnalysis, changedFiles) {
  let score = 0;
  let details = [];

  // API changes
  if (fileAnalysis.api.length > 0) {
    score += 2;
    details.push(`⚠️ MEDIUM: ${fileAnalysis.api.length} API files changed - may break client compatibility`);
  }

  // GraphQL schema changes
  if (fileAnalysis.graphql.length > 0) {
    score += 3;
    details.push(`⚠️ HIGH: ${fileAnalysis.graphql.length} GraphQL schema files changed - breaking changes possible`);
  }

  // Database migrations
  if (fileAnalysis.migrations.length > 0) {
    score += 2;
    details.push(`⚠️ MEDIUM: Database migrations present - ensure backward compatibility with existing data`);
  }

  // Deleted files
  if (changedFiles.deleted.length > 0) {
    score += 2;
    details.push(`⚠️ MEDIUM: ${changedFiles.deleted.length} files deleted - may break dependencies`);
  }

  if (score === 0) {
    details.push('✓ LOW: Minimal backward compatibility concerns');
  }

  return {
    score: Math.min(score, 10),
    level: score >= 7 ? 'HIGH' : score >= 4 ? 'MEDIUM' : 'LOW',
    details
  };
}

// Assess test coverage gaps
function assessTestCoverageGaps(fileAnalysis, stats) {
  let score = 0;
  let details = [];

  const productionFileCount = stats.filesChanged - fileAnalysis.tests.length;
  const testFileCount = fileAnalysis.tests.length;
  const testRatio = productionFileCount > 0 ? (testFileCount / productionFileCount) : 0;

  if (testRatio < 0.2) {
    score += 3;
    details.push(`⚠️ HIGH: Low test coverage - ${testFileCount} test files vs ${productionFileCount} production files (ratio: ${(testRatio * 100).toFixed(1)}%)`);
  } else if (testRatio < 0.5) {
    score += 2;
    details.push(`⚠️ MEDIUM: Moderate test coverage - ${testFileCount} test files vs ${productionFileCount} production files (ratio: ${(testRatio * 100).toFixed(1)}%)`);
  } else {
    score += 1;
    details.push(`✓ GOOD: ${testFileCount} test files vs ${productionFileCount} production files (ratio: ${(testRatio * 100).toFixed(1)}%)`);
  }

  // Specific file types without tests
  if (fileAnalysis.api.length > 0 && fileAnalysis.tests.filter(f => f.includes('api')).length === 0) {
    score += 2;
    details.push(`⚠️ MEDIUM: API changes without corresponding test changes`);
  }

  if (fileAnalysis.migrations.length > 0) {
    score += 1;
    details.push(`⚠️ LOW: Database migrations should be tested in staging environment`);
  }

  return {
    score: Math.min(score, 10),
    level: score >= 6 ? 'HIGH' : score >= 3 ? 'MEDIUM' : 'LOW',
    details
  };
}

// Generate markdown report
function generateReport(options, prs, changedFiles, fileAnalysis, stats, risks) {
  const report = [];
  const date = new Date().toISOString().split('T')[0];

  report.push(`# Release Risk Assessment Report`);
  report.push(`\n**Release Name:** ${options.release || 'Unnamed Release'}`);
  report.push(`**Version Range:** ${options.from} → ${options.to}`);
  report.push(`**Assessment Date:** ${date}`);
  report.push(`**Assessed By:** Senior QA Engineer (Automated Tool)`);
  report.push(`\n---\n`);

  // Executive Summary
  report.push(`## Executive Summary\n`);
  report.push(`This release includes changes across ${stats.filesChanged} files with ${stats.insertions} insertions and ${stats.deletions} deletions.`);
  report.push(`A total of ${prs.length} pull requests were merged.\n`);

  // Calculate overall risk
  const overallScore = (
    risks.functional.score +
    risks.dataIntegrity.score +
    risks.security.score +
    risks.backwardCompatibility.score +
    risks.testCoverage.score
  ) / 5;
  const overallLevel = overallScore >= 6 ? 'HIGH' : overallScore >= 3 ? 'MEDIUM' : 'LOW';

  report.push(`**Overall Risk Level:** ${overallLevel} (Score: ${overallScore.toFixed(1)}/10)\n`);
  report.push(`---\n`);

  // Change Statistics
  report.push(`## Change Statistics\n`);
  report.push(`| Metric | Count |`);
  report.push(`|--------|-------|`);
  report.push(`| Pull Requests | ${prs.length} |`);
  report.push(`| Files Changed | ${stats.filesChanged} |`);
  report.push(`| Lines Added | ${stats.insertions} |`);
  report.push(`| Lines Deleted | ${stats.deletions} |`);
  report.push(`| Files Added | ${changedFiles.added.length} |`);
  report.push(`| Files Modified | ${changedFiles.modified.length} |`);
  report.push(`| Files Deleted | ${changedFiles.deleted.length} |`);
  report.push(`\n---\n`);

  // Pull Requests
  report.push(`## Pull Requests Included\n`);
  if (prs.length > 0) {
    report.push(`Total PRs: ${prs.length}\n`);
    prs.forEach(pr => {
      report.push(`- PR #${pr}`);
    });
  } else {
    report.push(`No PRs detected (commit messages may not follow PR merge pattern).\n`);
  }
  report.push(`\n---\n`);

  // Risk Assessments
  function addRiskSection(title, risk) {
    report.push(`## ${title}\n`);
    report.push(`**Risk Level:** ${risk.level} (${risk.score}/10)\n`);
    report.push(`### Analysis:\n`);
    risk.details.forEach(detail => report.push(`${detail}\n`));
    report.push(`\n---\n`);
  }

  addRiskSection('Functional Risk', risks.functional);
  addRiskSection('Data Integrity Risk', risks.dataIntegrity);
  addRiskSection('Security Risk', risks.security);
  addRiskSection('Backward Compatibility Risk', risks.backwardCompatibility);
  addRiskSection('Test Coverage Gaps', risks.testCoverage);

  // Recommendations
  report.push(`## Recommendations\n`);
  
  if (risks.dataIntegrity.level === 'HIGH') {
    report.push(`1. **Data Integrity:** Review all database migrations thoroughly. Test rollback procedures. Backup data before deployment.\n`);
  }
  
  if (risks.security.level === 'HIGH') {
    report.push(`1. **Security:** Conduct security code review for authentication/authorization changes. Run security scanning tools.\n`);
  }
  
  if (risks.backwardCompatibility.level === 'HIGH') {
    report.push(`1. **Backward Compatibility:** Document all breaking changes. Plan phased rollout if possible. Communicate API changes to consumers.\n`);
  }
  
  if (risks.testCoverage.level === 'HIGH' || risks.testCoverage.level === 'MEDIUM') {
    report.push(`1. **Testing:** Increase test coverage for changed components. Run full regression test suite.\n`);
  }
  
  if (overallLevel === 'HIGH') {
    report.push(`1. **Deployment Strategy:** Consider canary deployment or feature flags for high-risk changes.\n`);
  }
  
  report.push(`1. **General:** Perform thorough smoke testing in staging environment before production deployment.\n`);
  report.push(`\n---\n`);

  // Detailed File Changes
  report.push(`## Detailed File Changes\n`);
  
  if (fileAnalysis.migrations.length > 0) {
    report.push(`### Database Migrations (${fileAnalysis.migrations.length})\n`);
    fileAnalysis.migrations.forEach(f => report.push(`- ${f}\n`));
  }
  
  if (fileAnalysis.api.length > 0) {
    report.push(`### API Changes (${fileAnalysis.api.length})\n`);
    fileAnalysis.api.slice(0, 20).forEach(f => report.push(`- ${f}\n`));
    if (fileAnalysis.api.length > 20) report.push(`... and ${fileAnalysis.api.length - 20} more\n`);
  }
  
  if (fileAnalysis.graphql.length > 0) {
    report.push(`### GraphQL Schema Changes (${fileAnalysis.graphql.length})\n`);
    fileAnalysis.graphql.forEach(f => report.push(`- ${f}\n`));
  }
  
  if (fileAnalysis.auth.length > 0) {
    report.push(`### Authentication/Authorization Changes (${fileAnalysis.auth.length})\n`);
    fileAnalysis.auth.forEach(f => report.push(`- ${f}\n`));
  }
  
  if (fileAnalysis.tests.length > 0) {
    report.push(`### Test Files (${fileAnalysis.tests.length})\n`);
    fileAnalysis.tests.slice(0, 20).forEach(f => report.push(`- ${f}\n`));
    if (fileAnalysis.tests.length > 20) report.push(`... and ${fileAnalysis.tests.length - 20} more\n`);
  }
  
  report.push(`\n---\n`);
  report.push(`\n*Report generated by Release Risk Assessment Tool v1.0*\n`);

  return report.join('');
}

// Main function
function main() {
  const options = parseArgs();

  console.log('╔════════════════════════════════════════════════╗');
  console.log('║  Release Risk Assessment Tool                  ║');
  console.log('╚════════════════════════════════════════════════╝\n');

  // Validate inputs
  if (!options.from || !options.to) {
    console.error('Error: --from and --to options are required');
    console.log('\nUsage:');
    console.log('  node scripts/release-risk-assessment.js --release "Release Name" --from v2.64.0 --to v2.65.0');
    console.log('\nOptions:');
    console.log('  --release, -r  Name of the release (optional)');
    console.log('  --from, -f     Starting git ref (tag, branch, or commit)');
    console.log('  --to, -t       Ending git ref (tag, branch, or commit)');
    console.log('  --output, -o   Output file path (default: release-risk-assessment-report.md)');
    process.exit(1);
  }

  console.log(`Analyzing release: ${options.release || 'Unnamed'}`);
  console.log(`Range: ${options.from} → ${options.to}\n`);

  // Gather data
  console.log('📊 Collecting data...');
  const prs = getPRsBetweenRefs(options.from, options.to);
  const changedFiles = getChangedFiles(options.from, options.to);
  const stats = getDiffStats(options.from, options.to);
  const fileAnalysis = analyzeFileChanges(changedFiles);

  console.log(`  ✓ Found ${prs.length} PRs`);
  console.log(`  ✓ Analyzed ${stats.filesChanged} changed files`);

  // Perform risk assessments
  console.log('\n🔍 Performing risk assessments...');
  const risks = {
    functional: assessFunctionalRisk(fileAnalysis, stats),
    dataIntegrity: assessDataIntegrityRisk(fileAnalysis, changedFiles),
    security: assessSecurityRisk(fileAnalysis, changedFiles),
    backwardCompatibility: assessBackwardCompatibilityRisk(fileAnalysis, changedFiles),
    testCoverage: assessTestCoverageGaps(fileAnalysis, stats)
  };

  console.log(`  ✓ Functional Risk: ${risks.functional.level}`);
  console.log(`  ✓ Data Integrity Risk: ${risks.dataIntegrity.level}`);
  console.log(`  ✓ Security Risk: ${risks.security.level}`);
  console.log(`  ✓ Backward Compatibility Risk: ${risks.backwardCompatibility.level}`);
  console.log(`  ✓ Test Coverage: ${risks.testCoverage.level}`);

  // Generate report
  console.log('\n📝 Generating report...');
  const report = generateReport(options, prs, changedFiles, fileAnalysis, stats, risks);

  // Write to file
  const outputPath = path.resolve(repoRoot, options.output);
  fs.writeFileSync(outputPath, report);

  console.log(`\n✅ Report generated: ${outputPath}`);
  console.log('\n' + '═'.repeat(50));
  
  // Print summary
  const overallScore = (
    risks.functional.score +
    risks.dataIntegrity.score +
    risks.security.score +
    risks.backwardCompatibility.score +
    risks.testCoverage.score
  ) / 5;
  const overallLevel = overallScore >= 6 ? 'HIGH' : overallScore >= 3 ? 'MEDIUM' : 'LOW';
  
  console.log(`\n🎯 Overall Risk: ${overallLevel} (${overallScore.toFixed(1)}/10)`);
  console.log(`\n📋 Review the full report at: ${options.output}\n`);
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export {
  getPRsBetweenRefs,
  getChangedFiles,
  analyzeFileChanges,
  assessFunctionalRisk,
  assessDataIntegrityRisk,
  assessSecurityRisk,
  assessBackwardCompatibilityRisk,
  assessTestCoverageGaps
};
