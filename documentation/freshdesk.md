# Freshdesk

Freshdesk is the customer service software used by GC Digital Talent for creating support tickets. There is no shared test environment. In order to test the creation of support tickets, either sign up for a free trial Freshdesk account or use the production account where [`FRESHDESK_API_TICKET_TAG` must be set to "test"](#environment-variables).

## Account

1. Navigate to [Freshdesk](https://www.freshworks.com/freshdesk/signup/)
2. Sign up for an account
3. Make note of the _domain_ upon account creation
4. Create custom string field for the ticket object named `page_url` (https://_domain_.freshdesk.com/a/admin/ticket_fields)
5. Create custom string field for the ticket object named `user_agent` (https://_domain_.freshdesk.com/a/admin/ticket_fields)
6. Create custom string field for the ticket object named `application_insights_user_id` (https://_domain_.freshdesk.com/a/admin/ticket_fields)
7. Create custom string field for the ticket object named `application_insights_session_id` (https://_domain_.freshdesk.com/a/admin/ticket_fields)

## Local setup

### Environment variables

These values are read by the API in `api/config/freshdesk.php`. The API logic for creating a ticket can be found within `api/app/Http/Controllers/SupportController.php` in the `createTicket` method. The frontend logic for creating a ticket can be found within `apps/web/src/pages/SupportPage/components/SupportForm/SupportForm.tsx`.

#### `api/.env`

- Set value of `FRESHDESK_API_ENDPOINT` to "https://_domain_.freshdesk.com/api/v2" where the _domain_ value can be found in [Freshdesk account](https://support.freshdesk.com/en/support/solutions/articles/237264-how-do-i-find-my-freshdesk-account-url-using-my-email-address-)
- Set value of `FRESHDESK_API_KEY` to string found in [Freshdesk account](https://support.freshdesk.com/en/support/solutions/articles/215517-how-to-find-your-api-key)
- Set value of `FRESHDESK_API_TICKET_TAG` to "test"

> [!NOTE]  
> Optional field that is not required for ticket creation locally but is used in production is `FRESHDESK_API_PRODUCT_ID`. The Freshdesk API has endpoints for [products](https://developers.freshdesk.com/api/#products) in case they need to be tested on a local environment.

## Create and view ticket

1. Navigate to [Support page](http://localhost:8000/en/support)
2. Fill out form fields
3. Submit form
4. Navigate to [Freshdesk](https://www.freshworks.com/freshdesk/login/)
5. Sign in to account using the _domain_ from account creation
6. Navigate to [Freshdesk Tickets page](https://_domain_.freshdesk.com/a/tickets/filters/all_tickets) to view tickets
