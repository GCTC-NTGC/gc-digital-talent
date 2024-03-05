---
name: "❗ New notification"
about: A new type of notification
title: "❗ [Notification] New notification"
labels: feature
assignees: ""
---

## ✨ Purpose

What is this notification intended to convey, and why?

## ❗ Trigger

How is this notification generated? Is it in response to some user action (eg submitting a request) or will it require a cron job which runs on a schedule (eg a job poster closes in 24 hours). If it requires a cron job, how often does it need to run?

## 👀 Audience

Who will get this notification? (eg all Request Responders, or only applicants with a draft application for related poster)

## 🌎 Copy (localized)

### Email templates (English and French)

Content of this notification if received as an email.

### In-app string (English and French)

How does this notification appear on the notifications page?

### Link

What page of the app is most relevant to this notification? (You will be sent there if you click this notification in-app.) Consider if this link should be part of the email template.

## 💾 Content

- What Notification Family does this belong to? (see #9555)
- What is the minimal set of data we need to store in the database in order to generate in-app string and link?

## ✅ Acceptance Criteria

- [ ] Email template exists in GC Notify
- [ ] Notification class exists in Laravel
- [ ] Notification is triggered by appropriate event and send to appropriate users (including NOT any users who are ignoring this notification's Notification Family)
- [ ] Notification type added to schema
- [ ] Notification type rendered appropriately on frontend
- [ ] Tests?

## 🛑 Blockers

Issues which must be completed before this one.

```[tasklist]
### Blocked By
- [ ] ticket number
```
