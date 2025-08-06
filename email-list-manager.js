const fs = require('fs');
const { getCampaignStats, cleanEmailLists, calculateSpamScore, isEmailBlocked, checkEmailStatus } = require('./mail-marketing.js');

// Function to display email list statistics
function displayEmailStats() {
    console.log('📊 Email List Statistics');
    console.log('========================');
    
    const stats = getCampaignStats();
    
    console.log(`📧 Total emails sent: ${stats.totalEmailsSent}`);
    console.log(`🚫 Spam blocked: ${stats.totalSpamBlocked}`);
    console.log(`📧 Bounced: ${stats.totalBounced}`);
    console.log(`👥 Unique recipients: ${stats.uniqueRecipients}`);
    
    if (stats.lastCampaignDate) {
        console.log(`📅 Last campaign: ${new Date(stats.lastCampaignDate).toLocaleDateString()}`);
    }
    
    // Calculate delivery rate
    const totalAttempted = stats.totalEmailsSent + stats.totalSpamBlocked;
    const deliveryRate = totalAttempted > 0 ? ((stats.totalEmailsSent / totalAttempted) * 100).toFixed(2) : 0;
    console.log(`📈 Delivery rate: ${deliveryRate}%`);
    
    console.log('');
}

// Function to view spam emails
function viewSpamEmails(limit = 10) {
    console.log(`🚫 Recent Spam Emails (showing last ${limit})`);
    console.log('=====================================');
    
    if (!fs.existsSync('spam_emails.json')) {
        console.log('No spam emails found.');
        return;
    }
    
    const spamEmails = JSON.parse(fs.readFileSync('spam_emails.json', 'utf8'));
    const recentSpam = spamEmails.slice(-limit).reverse();
    
    recentSpam.forEach((record, index) => {
        console.log(`${index + 1}. ${record.email}`);
        console.log(`   Score: ${record.spamScore.score}`);
        console.log(`   Reason: ${record.reason}`);
        console.log(`   Date: ${new Date(record.addedAt).toLocaleDateString()}`);
        console.log('');
    });
}

// Function to view bounced emails
function viewBouncedEmails(limit = 10) {
    console.log(`📧 Recent Bounced Emails (showing last ${limit})`);
    console.log('=====================================');
    
    if (!fs.existsSync('bounced_emails.json')) {
        console.log('No bounced emails found.');
        return;
    }
    
    const bouncedEmails = JSON.parse(fs.readFileSync('bounced_emails.json', 'utf8'));
    const recentBounces = bouncedEmails.slice(-limit).reverse();
    
    recentBounces.forEach((record, index) => {
        console.log(`${index + 1}. ${record.email}`);
        console.log(`   Type: ${record.bounceType} bounce`);
        console.log(`   Code: ${record.bounceCode}`);
        console.log(`   Date: ${new Date(record.bouncedAt).toLocaleDateString()}`);
        console.log('');
    });
}

// Function to remove email from spam list
function removeFromSpamList(email) {
    if (!fs.existsSync('spam_emails.json')) {
        console.log('No spam emails file found.');
        return false;
    }
    
    const spamEmails = JSON.parse(fs.readFileSync('spam_emails.json', 'utf8'));
    const initialCount = spamEmails.length;
    
    const filteredEmails = spamEmails.filter(record => record.email !== email);
    
    if (filteredEmails.length === initialCount) {
        console.log(`Email ${email} not found in spam list.`);
        return false;
    }
    
    fs.writeFileSync('spam_emails.json', JSON.stringify(filteredEmails, null, 2));
    console.log(`✅ Removed ${email} from spam list.`);
    return true;
}

// Function to remove email from bounce list
function removeFromBounceList(email) {
    if (!fs.existsSync('bounced_emails.json')) {
        console.log('No bounced emails file found.');
        return false;
    }
    
    const bouncedEmails = JSON.parse(fs.readFileSync('bounced_emails.json', 'utf8'));
    const initialCount = bouncedEmails.length;
    
    const filteredEmails = bouncedEmails.filter(record => record.email !== email);
    
    if (filteredEmails.length === initialCount) {
        console.log(`Email ${email} not found in bounce list.`);
        return false;
    }
    
    fs.writeFileSync('bounced_emails.json', JSON.stringify(filteredEmails, null, 2));
    console.log(`✅ Removed ${email} from bounce list.`);
    return true;
}

// Function to test spam score for an email
function testSpamScore(email, subject = 'Test Subject', content = 'Test content') {
    console.log(`🔍 Testing spam score for: ${email}`);
    console.log('=====================================');
    
    const spamScore = calculateSpamScore(email, subject, content);
    
    console.log(`📊 Spam Score: ${spamScore.score}`);
    console.log(`🚨 Status: ${spamScore.score > 30 ? 'BLOCKED' : 'ALLOWED'}`);
    
    if (spamScore.reasons.length > 0) {
        console.log('📝 Reasons:');
        spamScore.reasons.forEach((reason, index) => {
            console.log(`   ${index + 1}. ${reason}`);
        });
    } else {
        console.log('✅ No spam indicators found.');
    }
    
    console.log('');
}

// Function to export clean email list
function exportCleanEmails(format = 'json') {
    console.log('📤 Exporting clean email list...');
    
    const cleanEmails = cleanEmailLists();
    
    if (format === 'csv') {
        const csvContent = 'email\n' + cleanEmails.join('\n');
        fs.writeFileSync('clean_emails.csv', csvContent);
        console.log('✅ Clean emails exported to clean_emails.csv');
    } else {
        console.log('✅ Clean emails exported to clean_emails.json');
    }
    
    console.log(`📊 Total clean emails: ${cleanEmails.length}`);
}

// Function to analyze email patterns
function analyzeEmailPatterns() {
    console.log('🔍 Email Pattern Analysis');
    console.log('=========================');
    
    if (!fs.existsSync('sent_emails.json')) {
        console.log('No sent emails found for analysis.');
        return;
    }
    
    const sentEmails = JSON.parse(fs.readFileSync('sent_emails.json', 'utf8'));
    const emails = sentEmails.map(record => record.email);
    
    // Domain analysis
    const domains = emails.map(email => email.split('@')[1]).sort();
    const domainCount = {};
    domains.forEach(domain => {
        domainCount[domain] = (domainCount[domain] || 0) + 1;
    });
    
    console.log('📊 Top Email Domains:');
    const topDomains = Object.entries(domainCount)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10);
    
    topDomains.forEach(([domain, count]) => {
        console.log(`   ${domain}: ${count} emails`);
    });
    
    console.log('');
    
    // Spam score distribution
    console.log('📊 Spam Score Distribution:');
    const spamScores = emails.map(email => calculateSpamScore(email, 'Test', 'Test').score);
    const scoreRanges = {
        '0-10': 0,
        '11-20': 0,
        '21-30': 0,
        '31+': 0
    };
    
    spamScores.forEach(score => {
        if (score <= 10) scoreRanges['0-10']++;
        else if (score <= 20) scoreRanges['11-20']++;
        else if (score <= 30) scoreRanges['21-30']++;
        else scoreRanges['31+']++;
    });
    
    Object.entries(scoreRanges).forEach(([range, count]) => {
        const percentage = ((count / emails.length) * 100).toFixed(1);
        console.log(`   ${range}: ${count} emails (${percentage}%)`);
    });
}

// Function to show help
function showHelp() {
    console.log('📧 Email List Manager - Available Commands');
    console.log('==========================================');
    console.log('');
    console.log('📊 stats                    - Show email statistics');
    console.log('📧 status                   - Check email sending status');
    console.log('🚫 spam [limit]             - View recent spam emails (default: 10)');
    console.log('📧 bounces [limit]          - View recent bounced emails (default: 10)');
    console.log('🧹 clean                    - Clean email lists and export clean emails');
    console.log('📤 export [format]          - Export clean emails (json/csv)');
    console.log('🔍 test <email>             - Test spam score for an email');
    console.log('📊 analyze                  - Analyze email patterns');
    console.log('❌ remove-spam <email>      - Remove email from spam list');
    console.log('❌ remove-bounce <email>    - Remove email from bounce list');
    console.log('❓ help                     - Show this help message');
    console.log('');
    console.log('Examples:');
    console.log('  node email-list-manager.js stats');
    console.log('  node email-list-manager.js spam 5');
    console.log('  node email-list-manager.js test user@example.com');
    console.log('  node email-list-manager.js export csv');
}

// Main function to handle command line arguments
function main() {
    const args = process.argv.slice(2);
    const command = args[0];
    const param = args[1];
    
    switch (command) {
        case 'stats':
            displayEmailStats();
            break;
            
        case 'status':
            checkEmailStatus();
            break;
            
        case 'spam':
            const spamLimit = param ? parseInt(param) : 10;
            viewSpamEmails(spamLimit);
            break;
            
        case 'bounces':
            const bounceLimit = param ? parseInt(param) : 10;
            viewBouncedEmails(bounceLimit);
            break;
            
        case 'clean':
            cleanEmailLists();
            break;
            
        case 'export':
            const format = param || 'json';
            exportCleanEmails(format);
            break;
            
        case 'test':
            if (!param) {
                console.log('❌ Please provide an email address to test.');
                console.log('Usage: node email-list-manager.js test <email>');
                return;
            }
            testSpamScore(param);
            break;
            
        case 'analyze':
            analyzeEmailPatterns();
            break;
            
        case 'remove-spam':
            if (!param) {
                console.log('❌ Please provide an email address to remove.');
                console.log('Usage: node email-list-manager.js remove-spam <email>');
                return;
            }
            removeFromSpamList(param);
            break;
            
        case 'remove-bounce':
            if (!param) {
                console.log('❌ Please provide an email address to remove.');
                console.log('Usage: node email-list-manager.js remove-bounce <email>');
                return;
            }
            removeFromBounceList(param);
            break;
            
        case 'help':
        default:
            showHelp();
            break;
    }
}

// Export functions for use in other scripts
module.exports = {
    displayEmailStats,
    viewSpamEmails,
    viewBouncedEmails,
    removeFromSpamList,
    removeFromBounceList,
    testSpamScore,
    exportCleanEmails,
    analyzeEmailPatterns
};

// Run if called directly
if (require.main === module) {
    main();
} 