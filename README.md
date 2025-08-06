
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