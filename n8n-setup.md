# n8n Integration Setup

This document outlines how to set up the automated workflows in n8n for the Real Estate Lead Automation Platform.

## 1. Webhook Setup

First, create a new Webhook in n8n:
1. Add a **Webhook** node.
2. Set the HTTP Method to `POST`.
3. Set the Path to `leads-capture` (or anything you prefer).
4. Copy the "Test URL" or "Production URL".
5. Set this URL as your `N8N_WEBHOOK_URL` in the `.env.local` file of the Next.js app.

## 2. Workflow 1: New Lead Auto Response

This workflow triggers instantly when a new lead is captured.

**Nodes needed:**
1. **Webhook Node**: Configured as above.
2. **Send Email Node** (e.g., SMTP, Gmail, Postmark, SendGrid).
3. **Webhook Response Node** (Optional, to return a 200 OK immediately).

**Flow Setup:**
1. Connect the **Webhook** node to the **Send Email** node.
2. In the Email node, use expressions to map the incoming data:
   - **To**: `={{$json.body.email}}`
   - **Subject**: `Thanks for your property inquiry`
   - **Body/Text**: 
     ```
     Hi {{$json.body.name}},

     Thanks for your interest in our properties. 
     Our team has received your information (Phone: {{$json.body.phone}}) and will contact you shortly.

     Best regards,
     The Real Estate Team
     ```

## 3. Workflow 2: Lead Follow-Up Reminder

This workflow runs on a schedule to remind agents of uncontacted leads.

**Nodes needed:**
1. **Schedule Trigger Node** (Cron): Set it to run every morning at 9:00 AM (e.g., `0 9 * * *`).
2. **Postgres Node**: Connect to your Supabase PostgreSQL database.
   - **Operation**: Execute Query
   - **Query**: `SELECT * FROM leads WHERE status = 'New Lead' AND created_at < NOW() - INTERVAL '1 day';`
3. **If Node** (Optional): Check if any rows were returned.
4. **Send Email Node**: Send a digest or individual emails to the agent/team.

**Flow Setup:**
1. Connect **Schedule Trigger** -> **Postgres** -> **Send Email**.
2. If using an aggregate email, build a string containing all the names and phone numbers of the leads that need follow-up.
