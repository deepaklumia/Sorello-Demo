# Insmeal POS System Documentation

## Overview

The POS (Point of Sale) system is part of the Insmeal Corporate Backend. It allows POS devices to interact with the Insmeal platform using API key-based authentication. POS devices can manage restaurant status, process orders, handle payments, communicate with customers, and sync data.

---

## Authentication

### API Key Authorization

All POS endpoints use a custom Lambda authorizer (`apiKeyAuthorizer`).

**How it works:**
- The POS device sends its API key in the `Authorization` header.
- The authorizer looks up the key in the `WEBSOCKET_APIKEY_DB` DynamoDB table.
- The key must have `status: true` and `kind: "POS"`.
- The key must have an `is_authorized` array listing the permitted API paths.
- If authorized, the `restaurant_id` linked to the key is passed as `principalId` to downstream handlers.

**Middleware Chain for POS requests:**
```
Request → apiKeyAuthorizer (Lambda) → apikeyAuthToken (Middy) → verifyAuth → handler
```

1. **apiKeyAuthorizer** — Validates API key, checks `kind === "POS"`, checks path permissions, sets `principalId = restaurant_id`.
2. **apikeyAuthToken** — Resolves `restaurant_id` and sets it on `context` and authorizer claims.
3. **verifyAuth** — Validates the Cognito JWT token in the request.
4. **CheckRestaurantOpen** (optional) — Validates the restaurant is open before processing orders.

---

## POS API Endpoints

All POS routes are prefixed with `/pos`.

---

### 1. Get Restaurant Detail

| | |
|---|---|
| **Endpoint** | `GET /pos/restaurant/detail/get` |
| **Auth** | `apiKeyAuthorizer` |
| **Handler** | `services/pos/restaurant.js` |

Fetches full restaurant details for the authenticated POS device.

**Response:**
```json
{
  "id": "restaurant-id",
  "name": "Restaurant Name",
  ...
}
```

---

### 2. Get Restaurant Status

| | |
|---|---|
| **Endpoint** | `GET /pos/restaurant/getStatus` |
| **Auth** | `apiKeyAuthorizer` + `verifyAuth` |
| **Handler** | `services/pos/posgetStatus.js` |

Returns current open/close status, restaurant name, and tagline.

**Response:**
```json
{
  "restaurant_open": true,
  "restaurant_name": "Restaurant Name",
  "tagline": "Tagline text"
}
```

---

### 3. Set Restaurant Status

| | |
|---|---|
| **Endpoint** | `POST /pos/restaurant/setStatus` |
| **Auth** | `apiKeyAuthorizer` + `verifyAuth` |
| **Handler** | `services/pos/posrestaurantStatus.js` |

Opens or closes the restaurant from the POS device.

**Request Body:**
```json
{
  "status": true
}
```

**Response:**
```json
{ "status": "restaurant open successfully!" }
```

---

### 4. List Orders

| | |
|---|---|
| **Endpoint** | `POST /pos/restaurant/orders/list` |
| **Auth** | `apiKeyAuthorizer` + `verifyAuth` + `CheckRestaurantOpen` |
| **Handler** | `services/pos/order.js` |

Returns a paginated list of restaurant orders. Supports date range and filter.

**Query Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `filter` | string | Optional: `today`, `week`, etc. |

**Request Body:**
```json
{
  "start": 1700000000000,
  "end": 1700086400000
}
```

---

### 5. Get Order Detail

| | |
|---|---|
| **Endpoint** | `GET /pos/order/{orderId}/data` |
| **Auth** | `apiKeyAuthorizer` |
| **Handler** | `services/menu/order.js → orderDetail` |

Retrieves full details of a specific order.

---

### 6. Update Order Status

| | |
|---|---|
| **Endpoint** | `PATCH /pos/restaurant/status/{orderId}/update` |
| **Auth** | `apiKeyAuthorizer` |
| **Handler** | `services/menu/order.js → status` |

Updates the state of an order.

**Request Body:**
```json
{
  "state": "Accepted"
}
```

---

### 7. Update Menu Item Stock

| | |
|---|---|
| **Endpoint** | `PATCH /pos/restaurant/menuitem/{item_id}/stock/update` |
| **Auth** | `apiKeyAuthorizer` |
| **Handler** | `services/menu/stock.js` |

Updates in-stock availability of a menu item.

---

### 8. Get Menu List

| | |
|---|---|
| **Endpoint** | `GET /pos/menu/list` |
| **Auth** | `apiKeyAuthorizer` |
| **Handler** | `services/menu/listitem.js → main` |

Returns the full structured menu for the restaurant.

---

### 9. Process POS Payment

| | |
|---|---|
| **Endpoint** | `POST /pos/restaurant/payment/pay` |
| **Auth** | `apiKeyAuthorizer` + `checkRestaurantOpen` |
| **Handler** | `services/pos/payment.js` |

Processes a credit card payment via the Magensa MPPG v3 payment gateway and creates an order on success.

**Request Body:**
```json
{
  "amount": 50.00,
  "card": {
    "name_on_card": "John Doe",
    "card_number": "4111111111111111",
    "expiration_date": "1225",
    "cvv": "123"
  },
  "table_number": "5",
  "email": "customer@example.com",
  "mobile_no": "1234567890",
  "zip_code": "10001"
}
```

**Response (Approved):**
```json
{
  "payment_status": "APPROVED",
  "transaction_id": "uuid",
  "authorized_amount": 50.00
}
```

**Response (Declined):**
```json
{
  "payment_error": "payment declined, insufficient funds."
}
```

**Notes:**
- Supports `Rapid Connect v3 - Pilot` and `Rapid Connect v3 - Production` processors (amounts sent in cents).
- Automatically initiates a VOID refund if the authorized amount differs from requested amount.
- Payment gateway: `https://mppg.magensa.net/v3/MPPGv3Service.svc`

---

### 10. Generate Scan Pay URL

| | |
|---|---|
| **Endpoint** | `POST /pos/create-scan-pay-url` |
| **Auth** | `apiKeyAuthorizer` |
| **Handler** | `services/pos/generateScanPayUrl.js` |

Generates a unique scan-to-pay URL for a given amount that the customer scans to complete payment.

**Request Body:**
```json
{
  "amount": 25.50
}
```

**Response:**
```json
{
  "url": "https://<SCAN_PAY_BASE_URL>/<uuid>"
}
```

---

### 11. Send SMS to Customer

| | |
|---|---|
| **Endpoint** | `POST /pos/restaurant/message/send` |
| **Auth** | `apiKeyAuthorizer` |
| **Handler** | `services/pos/message.js` |

Sends an SMS to one or multiple customers via AWS SNS.

**Request Body:**
```json
{
  "subject": "Order Ready",
  "body": "Your order is ready for pickup.",
  "phone_number": "+11234567890"
}
```

Or multiple numbers:
```json
{
  "phone_number": ["+11234567890", "+10987654321"]
}
```

**Validation:** Phone numbers must be 10 digits (auto-prefixed with `+1`) or 12 chars starting with `+1`. Duplicates are removed.

---

### 12. Send Email to Customer

| | |
|---|---|
| **Endpoint** | `POST /pos/restaurant/email/send` |
| **Auth** | `apiKeyAuthorizer` |
| **Handler** | `services/pos/email.js` |

Sends an email via AWS SES. Sent from `notification@insmeal.com`.

**Request Body:**
```json
{
  "subject": "Your Receipt",
  "body": "Thank you for your order.",
  "email_id": "customer@example.com"
}
```

Or multiple emails:
```json
{
  "email_id": ["a@example.com", "b@example.com"]
}
```

---

### 13. Batch Post POS Orders

| | |
|---|---|
| **Endpoint** | `POST /pos/restaurant/batch/orders` |
| **Auth** | `apiKeyAuthorizer` + `verifyAuth` + `CheckRestaurantOpen` |
| **Handler** | `services/pos/post_orders.js` |

Batch-saves offline POS orders into the Insmeal order system. Normalizes POS order format to Insmeal format.

**Request Body:**
```json
{
  "data": [
    {
      "uuid": "{order-uuid}",
      "status": "Completed",
      "type": "Dine-In",
      "service_time": "2024-01-01 12:00:00",
      "customer": {
        "name": "John",
        "email": "john@example.com",
        "phone_number": "1234567890"
      },
      "items": [
        {
          "name": "Burger",
          "price": 12.00,
          "quantity": 2,
          "options": []
        }
      ],
      "charges": {
        "subtotal": 24.00,
        "tax": 2.00,
        "total": 26.00
      },
      "payment": { "method": "card" },
      "data": {
        "order": {
          "orig": {},
          "grand_total": 26.00
        }
      }
    }
  ]
}
```

**Order State Mapping:**

| POS Status | Insmeal State |
|------------|---------------|
| PENDING | Pending |
| ACCEPTED | Accepted |
| PREPARED | Prepared |
| COMPLETED | Completed |
| DECLINED | Declined |

**Order Type Mapping:**

| POS Type | Insmeal Type |
|----------|--------------|
| DELIVERY | Delivery |
| PICKUP | Pickup |
| DINEIN | Dine-In |

---

### 14. Request License API Key

| | |
|---|---|
| **Endpoint** | `POST /pos/restaurant/license/apikey` |
| **Auth** | `apiKeyAuthorizer` + `verifyAuth` |
| **Handler** | `services/apikey/addapikey.js` |

Generates and stores a `LICENSE`-kind API key for the POS device registration.

---

### 15. Get License API Key Data

| | |
|---|---|
| **Endpoint** | `GET /pos/restaurant/license/data/apikey` |
| **Auth** | `apiKeyAuthorizer` + `verifyAuth` |
| **Handler** | `services/apikey/license.js` |

**Query Parameter:** `device_id`

Retrieves data associated with a specific license/device.

---

### 16. Post Data from POS Device

| | |
|---|---|
| **Endpoint** | `POST /pos/restaurant/license/data` |
| **Auth** | `apiKeyAuthorizer` + `verifyAuth` |
| **Handler** | `services/pos/postdata.js` |

**Query Parameter:** `device_id` (required, must be APPROVED)

Posts key-value data from the POS device to the Insmeal platform.

**Request Body:**
```json
{
  "your_data_key": { ...payload }
}
```

---

### 17. Retrieve Data from POS Device

| | |
|---|---|
| **Endpoint** | `GET /pos/restaurant/license/data/fetch` |
| **Auth** | `apiKeyAuthorizer` + `verifyAuth` |
| **Handler** | `services/pos/retrievedata.js` |

**Query Parameters:**

| Param | Required | Description |
|-------|----------|-------------|
| `device_id` | Yes | Verified device ID |
| `key` | Yes | Data key to retrieve |

Fetches data previously posted by the POS device for a given key.

---

## DynamoDB Tables Used by POS

| Env Variable | Purpose |
|---|---|
| `WEBSOCKET_APIKEY_DB` | API keys, kind (POS/LICENSE/RESTAURANT), restaurant mapping |
| `ORDER` | Normalized order records |
| `POS_ORDER_DB` | Raw POS order payloads |
| `RESTAURANT_DB` | Restaurant details and payment gateway config |
| `CORPORATE_DATA_DB` | Key-value data posted by POS devices |
| `POS_DATA_DB` | POS data logs per key/restaurant |
| `CORPORATE_MESSAGE_DB` | SMS messages sent to customers |
| `SCAN_ORDER_DB` | Scan-to-pay payment records |
| `PAYMENT` | Payment transaction logs |

---

## API Key Record Schema (`WEBSOCKET_APIKEY_DB`)

| Field | Type | Description |
|-------|------|-------------|
| `api_key` | String (PK) | The API key value |
| `created` | Number (SK) | Creation timestamp |
| `restaurant_id` | String | Linked restaurant |
| `kind` | String | `POS`, `LICENSE`, or `RESTAURANT` |
| `status` | Boolean | `true` = active |
| `is_authorized` | Array\<String\> | Permitted API path patterns |
| `id` | String | Device ID (for LICENSE keys) |
| `permissions` | Array\<String\> | WebSocket message kinds allowed |

---

## WebSocket Integration (POS)

The POS system uses the `websocket` service for real-time communication.

- **Connection URL:** `wss://<endpoint>?apikey=<POS_API_KEY>`
- **Auth:** `apiKeyAuthorizer` validates the API key on connect.

**Routes:**

| Route | Description |
|-------|-------------|
| `$connect` | Stores connection with `restaurantId` and optional `device_id` |
| `$disconnect` | Removes connection record |
| `message` | Broadcasts a message to all restaurant connections |
| `pos` | Peer-to-peer chat filtered by device `permissions` array |

---

## Error Responses

All endpoints return a consistent error structure:

```json
{
  "error": "Error message here"
}
```

| Status Code | Meaning |
|-------------|---------|
| 200 | Success |
| 400 | Bad Request / ApiError |
| 401 | Unauthorized (invalid/disabled API key) |
| 500 | Internal Server Error |

---

## Deployment

POS is deployed as part of the `insmeal-corporate-backend` Serverless service.

```bash
cd corporateDash/backend
sls deploy --stage develop   # Development
sls deploy --stage stage     # Staging
sls deploy --stage prod      # Production
```

CI/CD is handled via `.github/workflows/CorporateBackend.yml`, triggered on push/PR to any branch under `corporateDash/backend/**`.
