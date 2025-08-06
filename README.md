### **Custom Email Limits**
You can now specify how many emails to send:

```bash
# Send specific number of emails
npm run email:20     # Send next 20 emails
npm run email:50     # Send next 50 emails
npm run email:100    # Send next 100 emails

# Send custom number
node mail-marketing.js 15  # Send 15 emails
node mail-marketing.js 75  # Send 75 emails
```

### 2. **Duplicate Prevention**
- **Automatic Detection**: Checks `sent_emails.json` before sending
- **Session Protection**: Prevents duplicates during the same session
- **Smart Filtering**: Only sends to unsent email addresses
- **Progress Tracking**: Shows remaining emails after each campaign

### 3. **Status Checking**
```bash
# Check email sending status
npm run manage status
```

This shows:
- Total valid emails available
- Already sent emails count
- Remaining emails to send
- Quick command suggestions

### 4. **Enhanced Campaign Flow**

**Before Sending:**
- Loads all valid emails from scraper data
- Filters out already sent emails
- Applies your specified limit
- Shows exactly how many will be sent

**During Sending:**
- Double-checks each email hasn't been sent
- Tracks progress in real-time
- Prevents duplicates within the same session

**After Sending:**
- Shows campaign summary
- Displays remaining emails count
- Suggests next command to run

## 📊 Example Output:

```
🚀 Starting Email Marketing Campaign...
📊 Campaign limit: 20 emails
📊 Loaded 150 projects with valid email addresses
📤 Already sent emails: 30
📧 Unsent emails available: 120
📧 Will send emails to: 20 recipients

📧 Starting to send emails...
📧 Sending email 1/20 to: user1@example.com
✅ Email sent successfully to user1@example.com
...

📊 Email Marketing Campaign Summary:
✅ Successfully sent: 18 emails
❌ Failed: 2 emails
🚫 Spam blocked: 0 emails
🚫 Bounced: 1 emails
📈 Success rate: 90.00%

📧 Remaining unsent emails: 100
💡 Run again with: npm run email 100 (or any number you prefer)
``` 

## emails.json Example Format

```json
[
  {
    "email": "exmple@proeprtylekh.com",
  },
]
```

## .env Example

```
# SMTP configuration for Hostinger or your email provider
HOSTINGER_SMTP_HOST=smtp.hostinger.com
HOSTINGER_SMTP_PORT=465
HOSTINGER_SMTP_USER=your@email.com
HOSTINGER_SMTP_PASS=your_app_password

# Gmail example (if using email-config.js)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

## Available Commands

### NPM Scripts

- `npm run email`         - Send emails to all unsent recipients (default batch)
- `npm run email:20`      - Send next 20 emails
- `npm run email:50`      - Send next 50 emails
- `npm run email:100`     - Send next 100 emails
- `npm run manage`        - Manage email list and check status
- `npm run marketing`     - Run the marketing script
- `npm run test`          - Run the scraper in test mode (first 10 projects)

### Node Commands

- `node scraper.js`               - Run the full scraper for all projects
- `node scraper-test.js`          - Run the scraper for the first 10 projects (test mode)
- `node mail-marketing.js`        - Send emails to all unsent recipients (default batch)
- `node mail-marketing.js 15`     - Send next 15 emails
- `node mail-marketing.js 75`     - Send next 75 emails
- `node email-list-manager.js`    - Manage email list and check status
- `node marketing.js`             - Run the marketing script 