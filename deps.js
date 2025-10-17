#!/usr/bin/env node

/**
 * 🔄 Automated Dependency Management Script
 * Art Vista Gallery - Capstone Project
 * 
 * This script helps manage dependencies across both Frontend and Backend
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const projects = ['Backend', 'FrontEnd'];

console.log('🔄 Art Vista Gallery - Dependency Management\n');

/**
 * Execute command in specific directory
 */
function runCommand(command, directory) {
    try {
        console.log(`📁 ${directory}: ${command}`);
        const result = execSync(command, { 
            cwd: directory, 
            encoding: 'utf8',
            stdio: ['pipe', 'pipe', 'pipe']
        });
        return { success: true, output: result };
    } catch (error) {
        return { success: false, error: error.message, output: error.stdout };
    }
}

/**
 * Check for outdated packages
 */
function checkOutdated() {
    console.log('🔍 Checking for outdated packages...\n');
    
    projects.forEach(project => {
        console.log(`\n📦 ${project} - Outdated Packages:`);
        console.log('='.repeat(50));
        
        const result = runCommand('npm outdated', project);
        if (result.output) {
            console.log(result.output);
        } else {
            console.log('✅ All packages are up to date!');
        }
    });
}

/**
 * Run security audit
 */
function securityAudit() {
    console.log('\n🔒 Running Security Audit...\n');
    
    projects.forEach(project => {
        console.log(`\n🛡️ ${project} - Security Audit:`);
        console.log('='.repeat(50));
        
        const result = runCommand('npm audit', project);
        if (result.success && result.output.includes('found 0 vulnerabilities')) {
            console.log('✅ No vulnerabilities found!');
        } else {
            console.log(result.output || result.error);
        }
    });
}

/**
 * Update dependencies
 */
function updateDependencies(type = 'minor') {
    const updateCommands = {
        patch: 'ncu -u --target patch',
        minor: 'ncu -u --target minor', 
        latest: 'ncu -u'
    };

    console.log(`\n⬆️ Updating dependencies (${type})...\n`);
    
    projects.forEach(project => {
        console.log(`\n🔄 ${project} - Updating ${type} versions:`);
        console.log('='.repeat(50));
        
        // Check for updates first
        const checkResult = runCommand('ncu --format lines', project);
        if (checkResult.output && checkResult.output.trim()) {
            console.log('📋 Updates available:');
            console.log(checkResult.output);
            
            // Apply updates
            const updateResult = runCommand(updateCommands[type], project);
            if (updateResult.success) {
                console.log('✅ Dependencies updated!');
                
                // Install updated packages
                const installResult = runCommand('npm install', project);
                if (installResult.success) {
                    console.log('✅ Packages installed successfully!');
                } else {
                    console.log('❌ Installation failed:', installResult.error);
                }
            } else {
                console.log('❌ Update failed:', updateResult.error);
            }
        } else {
            console.log('✅ All dependencies are up to date!');
        }
    });
}

/**
 * Generate dependency report
 */
function generateReport() {
    console.log('\n📊 Generating Dependency Report...\n');
    
    const report = {
        generated: new Date().toISOString(),
        projects: {}
    };

    projects.forEach(project => {
        console.log(`📋 Analyzing ${project}...`);
        
        const packagePath = path.join(project, 'package.json');
        if (fs.existsSync(packagePath)) {
            const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
            
            const auditResult = runCommand('npm audit --json', project);
            let auditData = { vulnerabilities: {} };
            try {
                auditData = JSON.parse(auditResult.output || '{}');
            } catch (e) {
                // Ignore JSON parse errors
            }

            report.projects[project] = {
                dependencies: Object.keys(packageJson.dependencies || {}).length,
                devDependencies: Object.keys(packageJson.devDependencies || {}).length,
                vulnerabilities: Object.keys(auditData.vulnerabilities || {}).length,
                lastUpdated: fs.statSync(packagePath).mtime
            };
        }
    });

    const reportPath = 'dependency-report.json';
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`📄 Report saved to: ${reportPath}`);
    
    return report;
}

/**
 * Main execution
 */
function main() {
    const args = process.argv.slice(2);
    const command = args[0];

    switch (command) {
        case 'check':
            checkOutdated();
            break;
        case 'audit':
            securityAudit();
            break;
        case 'update':
            const updateType = args[1] || 'minor';
            updateDependencies(updateType);
            break;
        case 'report':
            generateReport();
            break;
        case 'full':
            console.log('🚀 Running full maintenance cycle...');
            checkOutdated();
            securityAudit();
            generateReport();
            break;
        default:
            console.log(`
🔄 Dependency Management Commands:

📋 Available Commands:
  check          - Check for outdated packages
  audit          - Run security audit
  update [type]  - Update dependencies (patch|minor|latest)
  report         - Generate dependency report
  full           - Run complete maintenance cycle

💡 Examples:
  node deps.js check
  node deps.js update minor
  node deps.js audit
  node deps.js full

🛡️ Security First:
  Always run 'audit' before 'update'
  Use 'patch' updates for production
  Use 'minor' for regular maintenance
  Use 'latest' only when needed
            `);
    }
}

// Run the script
main();