const nodemailer = require('nodemailer');
const fs = require('fs');
const dotenv = require("dotenv");

// Initialize environment variables
dotenv.config();

// Email configuration
const emailConfig = {
    host: process.env.HOSTINGER_SMTP_HOST, // or 'outlook', 'yahoo', etc.
    port: process.env.HOSTINGER_SMTP_PORT,
    secure: true,
    auth: {
        user: process.env.HOSTINGER_SMTP_USER,
        pass: process.env.HOSTINGER_SMTP_PASS
    }
};

console.log(emailConfig)
// Spam detection configuration
const spamConfig = {
    // Keywords that might trigger spam filters
    spamKeywords: [
        'free', 'limited time', 'act now', 'urgent', 'exclusive offer',
        'click here', 'buy now', 'discount', 'sale', 'offer expires',
        'money back', 'guarantee', 'no risk', 'investment opportunity'
    ],
    
    // Email patterns that are likely spam
    spamPatterns: [
        /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i, // Valid email format
        /^[a-z]+[0-9]+@/i, // Random letters + numbers
        /^[0-9]+@/i, // Numbers only at start
        /@(temp|disposable|10minutemail|guerrillamail|mailinator)\./i // Disposable emails
    ],
    
    // Bounce types to track
    bounceTypes: {
        hard: ['550', '554', '553', '550-5.1.1', '550-5.1.2', '550-5.2.1'],
        soft: ['421', '450', '451', '452', '550-5.2.2', '550-5.3.0'],
        spam: ['550-5.7.1', '550-5.7.9', '554-5.7.1', '554-5.7.9']
    }
};

// Function to generate email content from template
function generateEmailContent(projectName = '') {
    const companyName = 'PropertyLekh';
    const website = 'https://propertylekh.com';
    const contactEmail = 'info@propertylekh.com';
    const contactPhone = '+916261282518';
    const logoUrl = 'https://propertylekh.com/emailtemp/logo_for_dark_full.jpg'; // Replace with actual logo URL

    const baseContent = {
        subject: '🚀 Manage Your Real Estate Projects Smartly – Start FREE with PropertyLekh',
        greeting: 'Dear Developer/Colonizer,',
        intro: `We're excited to introduce <strong>PropertyLekh</strong> – a powerful SaaS platform designed for colonizers and real estate developers. 
        <br><br>
        Get started with our <strong>free plan</strong> to manage plots, infra expenses, payroll & more — and upgrade anytime as your needs grow.`,
        features: [
            '📍 Plot & Project Mapping Tools',
            '💰 Infrastructure Expense Tracking',
            '👨‍💼 Payroll Management System',
            '📊 Real-Time Dashboards & Reports',
            '📁 Automated Document Generation (Sale Deed, Registry)',
            '🧾 Payment & Installment Tracking System',
            '📝 Project Monitoring',
            '📂 Document Management & Digital Storage'
        ],
        services: [
            '🛠️ Manage multiple projects in one dashboard',
            '📂 Digitize all your approvals and documents',
            '🔐 Cloud-based access and backup',
            '📞 Free onboarding and support included'
        ],
        specialOffer: '🎁 Start today with our FREE plan – only upgrade when you need advanced features.',
        footer: {
            reason: 'You are receiving this email because you’re in the real estate or construction industry.',
            unsubscribe: 'To stop receiving updates, reply with "UNSUBSCRIBE".',
            copyright: `© 2025 ${companyName}. All rights reserved.`
        }
    };

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>${baseContent.subject}</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background: #f6f6f6;
                color: #333;
                line-height: 1.6;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                background: #fff;
                border-radius: 10px;
                overflow: hidden;
                box-shadow: 0 0 20px rgba(0,0,0,0.05);
            }
            .header {
                background: linear-gradient(135deg, #4b6cb7 0%, #182848 100%);
                color: white;
                padding: 30px 20px;
                text-align: center;
            }
            .logo {
                max-width: 150px;
                margin-bottom: 20px;
            }
            .content {
                padding: 30px 20px;
            }
            .cta-button {
                background: #28a745;
                color: white;
                padding: 12px 30px;
                text-decoration: none;
                border-radius: 5px;
                display: inline-block;
                font-weight: bold;
                margin: 30px 0;
            }
            .section-title {
                color: #4b6cb7;
                font-size: 18px;
                margin-top: 30px;
                margin-bottom: 10px;
            }
            ul {
                padding-left: 20px;
                margin: 10px 0 20px;
            }
            .footer {
                background: #f0f0f0;
                padding: 20px;
                text-align: center;
                font-size: 12px;
                color: #666;
            }
            .contact-info {
                margin-top: 30px;
                padding: 15px;
                border: 1px solid #ddd;
                background: #f9f9f9;
                border-radius: 6px;
                font-size: 14px;
                line-height: 1.5;
            }
            p {
                margin: 15px 0;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <img src="${logoUrl}" alt="PropertyLekh Logo" class="logo" />
                <h1>🏗️ PropertyLekh</h1>
                <p>Manage Your Projects with Ease — Start Free Today</p>
            </div>
    
            <div class="content">
                <h2>${baseContent.greeting}</h2>
                <p>${baseContent.intro}</p>
    
                <h3 class="section-title">🔧 Key Features</h3>
                <ul>${baseContent.features.map(f => `<li>${f}</li>`).join('')}</ul>
    
                <h3 class="section-title">💼 What You Can Do</h3>
                <ul>${baseContent.services.map(s => `<li>${s}</li>`).join('')}</ul>
    
                <div style="text-align: center;">
                    <a href="${website}" class="cta-button">🚀 Start Free Now</a>
                </div>
    
                <div class="contact-info">
                    <strong>📞 Contact Us:</strong><br>
                    Phone: <a href="tel:${contactPhone}">${contactPhone}</a><br>
                    Email: <a href="mailto:${contactEmail}">${contactEmail}</a><br>
                    Website: <a href="${website}">${website}</a>
                </div>
    
                <p><strong>${baseContent.specialOffer}</strong></p>
            </div>
    
            <div class="footer">
                <p>${baseContent.footer.reason}</p>
                <p>${baseContent.footer.unsubscribe}</p>
                <p>${baseContent.footer.copyright}</p>
            </div>
        </div>
    </body>
    </html>`;
    

    const text = `
${baseContent.subject}

${baseContent.greeting}

PropertyLekh – SaaS for colonizers & developers.

Free plan includes:
${baseContent.features.join('\n')}

What you can do:
${baseContent.services.join('\n')}

${baseContent.specialOffer}

Start now: ${website}
Email: ${contactEmail}
Phone: ${contactPhone}

${baseContent.footer.reason}
${baseContent.footer.unsubscribe}
${baseContent.footer.copyright}
`;

    return {
        subject: baseContent.subject,
        html,
        text
    };
}



// Marketing email template (simplified - now uses the function above)
const emailTemplate = generateEmailContent();

// Function to calculate spam score
function calculateSpamScore(email, subject, content) {
    let score = 0;
    const reasons = [];
    
    // Check email format
    if (!spamConfig.spamPatterns[0].test(email)) {
        score += 10;
        reasons.push('Invalid email format');
    }
    
    // Check for disposable email domains
    if (spamConfig.spamPatterns[3].test(email)) {
        score += 20;
        reasons.push('Disposable email domain');
    }
    
    // Check for random patterns
    if (spamConfig.spamPatterns[1].test(email) || spamConfig.spamPatterns[2].test(email)) {
        score += 15;
        reasons.push('Suspicious email pattern');
    }
    
    // Check subject line for spam keywords
    const subjectLower = subject.toLowerCase();
    spamConfig.spamKeywords.forEach(keyword => {
        if (subjectLower.includes(keyword)) {
            score += 5;
            reasons.push(`Spam keyword in subject: ${keyword}`);
        }
    });
    
    // Check content for spam keywords
    const contentLower = content.toLowerCase();
    spamConfig.spamKeywords.forEach(keyword => {
        if (contentLower.includes(keyword)) {
            score += 3;
            reasons.push(`Spam keyword in content: ${keyword}`);
        }
    });
    
    // Check for excessive capitalization
    const capsRatio = (subject.match(/[A-Z]/g) || []).length / subject.length;
    if (capsRatio > 0.7) {
        score += 10;
        reasons.push('Excessive capitalization in subject');
    }
    
    // Check for excessive exclamation marks
    const exclamationCount = (subject.match(/!/g) || []).length;
    if (exclamationCount > 2) {
        score += 8;
        reasons.push('Excessive exclamation marks');
    }
    
    return { score, reasons };
}

// Function to store spam/blocked emails
function storeSpamEmail(email, projectData, reason, spamScore) {
    const spamFile = 'spam_emails.json';
    let spamEmails = [];
    
    if (fs.existsSync(spamFile)) {
        spamEmails = JSON.parse(fs.readFileSync(spamFile, 'utf8'));
    }
    
    spamEmails.push({
        email: email,
        addedAt: new Date().toISOString(),
        projectData: projectData,
        reason: reason,
        spamScore: spamScore,
        status: 'blocked'
    });
    
    fs.writeFileSync(spamFile, JSON.stringify(spamEmails, null, 2));
    console.log(`🚫 Email blocked as spam: ${email} (Score: ${spamScore.score})`);
}

// Function to store bounced emails
function storeBouncedEmail(email, bounceType, bounceCode, projectData) {
    const bounceFile = 'bounced_emails.json';
    let bouncedEmails = [];
    
    if (fs.existsSync(bounceFile)) {
        bouncedEmails = JSON.parse(fs.readFileSync(bounceFile, 'utf8'));
    }
    
    bouncedEmails.push({
        email: email,
        bouncedAt: new Date().toISOString(),
        bounceType: bounceType, // 'hard', 'soft', 'spam'
        bounceCode: bounceCode,
        projectData: projectData,
        status: 'bounced'
    });
    
    fs.writeFileSync(bounceFile, JSON.stringify(bouncedEmails, null, 2));
    console.log(`📧 Email bounced: ${email} (${bounceType} bounce - ${bounceCode})`);
}

// Function to check if email is already blocked
function isEmailBlocked(email) {
    // Check spam emails
    if (fs.existsSync('spam_emails.json')) {
        const spamEmails = JSON.parse(fs.readFileSync('spam_emails.json', 'utf8'));
        if (spamEmails.some(record => record.email === email)) {
            return { blocked: true, reason: 'spam', source: 'spam_emails.json' };
        }
    }
    
    // Check bounced emails
    if (fs.existsSync('bounced_emails.json')) {
        const bouncedEmails = JSON.parse(fs.readFileSync('bounced_emails.json', 'utf8'));
        const hardBounces = bouncedEmails.filter(record => record.bounceType === 'hard');
        if (hardBounces.some(record => record.email === email)) {
            return { blocked: true, reason: 'hard_bounce', source: 'bounced_emails.json' };
        }
    }
    
    return { blocked: false };
}

// Function to load processed data
function loadProcessedData() {
    try {
        if (fs.existsSync('emails.json')) {
            const data = JSON.parse(fs.readFileSync('eamils.json', 'utf8'));
            return data.filter(project => {
                // Check if email is valid and not blocked
                const isValidEmail = project.email && project.email.includes('@') && project.email !== 'Error fetching';
                const isBlocked = isEmailBlocked(project.email);
                
                if (isValidEmail && !isBlocked.blocked) {
                    return true;
                } else if (isBlocked.blocked) {
                    console.log(`⏭️ Skipping blocked email: ${project.email} (${isBlocked.reason})`);
                }
                return false;
            });
        }
        return [];
    } catch (error) {
        console.error('Error loading processed data:', error);
        return [];
    }
}

// Function to create email transporter
function createTransporter() {
    return nodemailer.createTransport(emailConfig);
}

// Function to send email
async function sendEmail(transporter, to, subject, html, text) {
    try {
        const mailOptions = {
            from: emailConfig.auth.user,
            to: to,
            subject: subject,
            html: html,
            text: text
        };

        const result = await transporter.sendMail(mailOptions);
        return { success: true, messageId: result.messageId };
    } catch (error) {
        // Check if it's a bounce error
        const errorMessage = error.message.toLowerCase();
        let bounceType = null;
        let bounceCode = null;
        
        // Check for hard bounces
        if (spamConfig.bounceTypes.hard.some(code => errorMessage.includes(code))) {
            bounceType = 'hard';
            bounceCode = spamConfig.bounceTypes.hard.find(code => errorMessage.includes(code));
        }
        // Check for soft bounces
        else if (spamConfig.bounceTypes.soft.some(code => errorMessage.includes(code))) {
            bounceType = 'soft';
            bounceCode = spamConfig.bounceTypes.soft.find(code => errorMessage.includes(code));
        }
        // Check for spam bounces
        else if (spamConfig.bounceTypes.spam.some(code => errorMessage.includes(code))) {
            bounceType = 'spam';
            bounceCode = spamConfig.bounceTypes.spam.find(code => errorMessage.includes(code));
        }
        
        return { 
            success: false, 
            error: error.message,
            bounceType: bounceType,
            bounceCode: bounceCode
        };
    }
}

// Function to track sent emails
function trackSentEmail(email, projectData) {
    const trackingFile = 'sent_emails.json';
    let sentEmails = [];
    
    if (fs.existsSync(trackingFile)) {
        sentEmails = JSON.parse(fs.readFileSync(trackingFile, 'utf8'));
    }
    
    sentEmails.push({
        email: email,
        sentAt: new Date().toISOString(),
        projectData: projectData,
        status: 'sent'
    });
    
    fs.writeFileSync(trackingFile, JSON.stringify(sentEmails, null, 2));
}

// Main email marketing function
async function runEmailMarketing(limit = null) {
    console.log('🚀 Starting Email Marketing Campaign...');
    
    if (limit) {
        console.log(`📧 Campaign limit: ${limit} emails`);
    }
    
    // Load processed data
    const projects = loadProcessedData();
    console.log(`📊 Loaded ${projects.length} projects with valid email addresses`);
    
    if (projects.length === 0) {
        console.log('❌ No valid email addresses found. Please run the scraper first.');
        return;
    }
    
    // Filter out already sent emails
    const alreadySentEmails = new Set();
    if (fs.existsSync('sent_emails.json')) {
        const sentEmails = JSON.parse(fs.readFileSync('sent_emails.json', 'utf8'));
        sentEmails.forEach(record => alreadySentEmails.add(record.email));
        console.log(`📤 Already sent emails: ${alreadySentEmails.size}`);
    }
    
    // Filter projects to exclude already sent emails
    const unsentProjects = projects.filter(project => !alreadySentEmails.has(project.email));
    console.log(`📧 Unsent emails available: ${unsentProjects.length}`);
    
    if (unsentProjects.length === 0) {
        console.log('❌ No new emails to send. All emails have already been sent.');
        return;
    }
    
    // Apply limit if specified
    const projectsToSend = limit ? unsentProjects.slice(0, limit) : unsentProjects;
    console.log(`📧 Will send emails to: ${projectsToSend.length} recipients`);
    
    // Create transporter
    const transporter = createTransporter();
    
    // Test email configuration
    try {
        await transporter.verify();
        console.log('✅ Email configuration verified successfully');
    } catch (error) {
        console.error('❌ Email configuration failed:', error.message);
        console.log('Please check your email credentials in the environment variables.');
        return;
    }
    
    // Send emails
    let successCount = 0;
    let failureCount = 0;
    let spamBlockedCount = 0;
    let bounceCount = 0;
    
    console.log('📧 Starting to send emails...');
    
    for (let i = 0; i < projectsToSend.length; i++) {
        const project = projectsToSend[i];
        const email = project.email;
        
        console.log(`📤 Sending email ${i + 1}/${projectsToSend.length} to: ${email}`);
        
        // Double-check to ensure email hasn't been sent during this session
        if (alreadySentEmails.has(email)) {
            console.log(`⏭️ Skipping already sent email: ${email}`);
            continue;
        }
        
        // Calculate spam score before sending
        const spamScore = calculateSpamScore(email, emailTemplate.subject, emailTemplate.html);
        
        // Block emails with high spam score
        if (spamScore.score > 30) {
            storeSpamEmail(email, project, spamScore.reasons.join(', '), spamScore);
            spamBlockedCount++;
            console.log(`🚫 Email blocked due to high spam score: ${email} (Score: ${spamScore.score})`);
            continue;
        }
        
        // Generate personalized email content
        const personalizedEmail = generateEmailContent(project.projectName);
        
        const result = await sendEmail(
            transporter,
            email,
            personalizedEmail.subject,
            personalizedEmail.html,
            personalizedEmail.text
        );
        
        if (result.success) {
            console.log(`✅ Email sent successfully to ${email}`);
            trackSentEmail(email, project);
            alreadySentEmails.add(email); // Add to set to prevent duplicates in same session
            successCount++;
        } else {
            console.log(`❌ Failed to send email to ${email}: ${result.error}`);
            
            // Handle bounces
            if (result.bounceType) {
                storeBouncedEmail(email, result.bounceType, result.bounceCode, project);
                bounceCount++;
            }
            
            failureCount++;
        }
        
        // Add delay between emails to avoid rate limiting
        if (i < projectsToSend.length - 1) {
            console.log('⏳ Waiting 2 seconds before next email...');
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }
    
    console.log('\n📊 Email Marketing Campaign Summary:');
    console.log(`✅ Successfully sent: ${successCount} emails`);
    console.log(`❌ Failed: ${failureCount} emails`);
    console.log(`🚫 Spam blocked: ${spamBlockedCount} emails`);
    console.log(`📧 Bounced: ${bounceCount} emails`);
    console.log(`📈 Success rate: ${((successCount / projectsToSend.length) * 100).toFixed(2)}%`);
    
    // Save campaign report
    const campaignReport = {
        campaignDate: new Date().toISOString(),
        totalEmails: projectsToSend.length,
        successCount: successCount,
        failureCount: failureCount,
        spamBlockedCount: spamBlockedCount,
        bounceCount: bounceCount,
        successRate: ((successCount / projectsToSend.length) * 100).toFixed(2) + '%',
        limit: limit || 'unlimited'
    };
    
    fs.writeFileSync('campaign_report.json', JSON.stringify(campaignReport, null, 2));
    console.log('📄 Campaign report saved to campaign_report.json');
    
    // Show remaining emails info
    const remainingEmails = unsentProjects.length - projectsToSend.length;
    if (remainingEmails > 0) {
        console.log(`📧 Remaining unsent emails: ${remainingEmails}`);
        console.log(`💡 Run again with: npm run email ${remainingEmails} (or any number you prefer)`);
    }
}

// // Function to check email status
// function checkEmailStatus(email) {
//     const trackingFile = 'sent_emails.json';
//     if (fs.existsSync(trackingFile)) {
//         const sentEmails = JSON.parse(fs.readFileSync(trackingFile, 'utf8'));
//         const emailRecord = sentEmails.find(record => record.email === email);
//         return emailRecord || null;
//     }
//     return null;
// }

// Function to get campaign statistics
function getCampaignStats() {
    const trackingFile = 'sent_emails.json';
    const spamFile = 'spam_emails.json';
    const bounceFile = 'bounced_emails.json';
    const reportFile = 'campaign_report.json';
    
    let stats = {
        totalEmailsSent: 0,
        totalSpamBlocked: 0,
        totalBounced: 0,
        lastCampaignDate: null,
        uniqueRecipients: 0
    };
    
    if (fs.existsSync(trackingFile)) {
        const sentEmails = JSON.parse(fs.readFileSync(trackingFile, 'utf8'));
        stats.totalEmailsSent = sentEmails.length;
        stats.uniqueRecipients = new Set(sentEmails.map(record => record.email)).size;
        
        if (sentEmails.length > 0) {
            stats.lastCampaignDate = sentEmails[sentEmails.length - 1].sentAt;
        }
    }
    
    if (fs.existsSync(spamFile)) {
        const spamEmails = JSON.parse(fs.readFileSync(spamFile, 'utf8'));
        stats.totalSpamBlocked = spamEmails.length;
    }
    
    if (fs.existsSync(bounceFile)) {
        const bouncedEmails = JSON.parse(fs.readFileSync(bounceFile, 'utf8'));
        stats.totalBounced = bouncedEmails.length;
    }
    
    if (fs.existsSync(reportFile)) {
        const report = JSON.parse(fs.readFileSync(reportFile, 'utf8'));
        stats.lastCampaignReport = report;
    }
    
    return stats;
}

// Function to clean email lists
function cleanEmailLists() {
    console.log('🧹 Cleaning email lists...');
    
    const stats = getCampaignStats();
    console.log(`📊 Current statistics:`);
    console.log(`- Total emails sent: ${stats.totalEmailsSent}`);
    console.log(`- Spam blocked: ${stats.totalSpamBlocked}`);
    console.log(`- Bounced: ${stats.totalBounced}`);
    
    // Create clean email list (excluding spam and hard bounces)
    const cleanEmails = [];
    
    if (fs.existsSync('sent_emails.json')) {
        const sentEmails = JSON.parse(fs.readFileSync('sent_emails.json', 'utf8'));
        const spamEmails = fs.existsSync('spam_emails.json') ? 
            JSON.parse(fs.readFileSync('spam_emails.json', 'utf8')) : [];
        const bouncedEmails = fs.existsSync('bounced_emails.json') ? 
            JSON.parse(fs.readFileSync('bounced_emails.json', 'utf8')) : [];
        
        const blockedEmails = new Set([
            ...spamEmails.map(record => record.email),
            ...bouncedEmails.filter(record => record.bounceType === 'hard').map(record => record.email)
        ]);
        
        sentEmails.forEach(record => {
            if (!blockedEmails.has(record.email)) {
                cleanEmails.push(record.email);
            }
        });
    }
    
    // Save clean email list
    fs.writeFileSync('clean_emails.json', JSON.stringify(cleanEmails, null, 2));
    console.log(`✅ Clean email list saved with ${cleanEmails.length} emails`);
    
    return cleanEmails;
}

// Function to check email sending status and remaining emails
function checkEmailStatus() {
    console.log('📊 Email Sending Status');
    console.log('======================');
    
    // Load processed data
    const projects = loadProcessedData();
    console.log(`📧 Total valid emails: ${projects.length}`);
    
    // Check already sent emails
    const alreadySentEmails = new Set();
    if (fs.existsSync('sent_emails.json')) {
        const sentEmails = JSON.parse(fs.readFileSync('sent_emails.json', 'utf8'));
        sentEmails.forEach(record => alreadySentEmails.add(record.email));
        console.log(`📤 Already sent: ${alreadySentEmails.size} emails`);
    }
    
    // Calculate remaining emails
    const unsentEmails = projects.filter(project => !alreadySentEmails.has(project.email));
    console.log(`📧 Remaining to send: ${unsentEmails.length} emails`);
    
    if (unsentEmails.length > 0) {
        console.log('\n💡 Quick send commands:');
        console.log(`  npm run email:20     # Send next 20 emails`);
        console.log(`  npm run email:50     # Send next 50 emails`);
        console.log(`  npm run email:100    # Send next 100 emails`);
        console.log(`  npm run email        # Send all remaining emails`);
        console.log(`  npm run email 15  # Send custom number (15)`);
    } else {
        console.log('✅ All emails have been sent!');
    }
    
    console.log('');
}

// Export functions for use in other scripts
module.exports = {
    runEmailMarketing,
    checkEmailStatus,
    getCampaignStats,
    loadProcessedData,
    cleanEmailLists,
    calculateSpamScore,
    isEmailBlocked
};

// Run if called directly
if (require.main === module) {
    const args = process.argv.slice(2);
    const limit = args[0] ? parseInt(args[0]) : null;
    
    if (limit && (isNaN(limit) || limit <= 0)) {
        console.log('❌ Invalid limit. Please provide a positive number.');
        console.log('Usage: node mail-marketing.js [limit]');
        console.log('Examples:');
        console.log('  node mail-marketing.js        # Send all unsent emails');
        console.log('  node mail-marketing.js 20     # Send next 20 emails');
        console.log('  node mail-marketing.js 50     # Send next 50 emails');
        process.exit(1);
    }
    
    runEmailMarketing(limit).catch(console.error);
} 