# Hotel Booking System

A fullstack business application built with SAP Cloud Application Programming Model (CAP) and SAP Fiori Elements.

## Business Scenario

This application manages hotel bookings for a small hotel chain. Hotel staff (Admins) manage hotel and room inventory, while customers browse rooms and create their own bookings. The system solves the problem of manual booking coordination by centralizing room availability, pricing, and guest records in one place. The main entities are Hotels, Rooms, Guests, and Bookings, with Bookings linking a Guest to a Room for a given date range and calculating the total price automatically.

## Project Structure

File or Folder | Purpose
---------|----------
`app/bookings` | Fiori Elements List Report + Object Page UI
`db/schema.cds` | Domain model: Hotels, Rooms, Guests, Bookings
`db/data/` | Sample CSV data
`srv/service.cds` | OData V4 service definitions, roles, draft config
`srv/service.js` | Custom handlers: validation, computation, external API call
`test.http` | API test requests for all roles and scenarios

## Data Model

- **Hotels** → has many **Rooms**
- **Rooms** → has many **Bookings**
- **Guests** → has many **Bookings**

## Business Logic

- Check-in/check-out date validation (no past dates, check-out after check-in)
- Overlapping booking prevention per room
- Automatic total price calculation (nights × room rate)
- Default booking status on creation
- Customers are auto-linked to their own guest profile by email
- External exchange-rate API (`api.frankfurter.dev`) via the `convertBookingPrice` function

## Roles

| Role | Permissions |
|---|---|
| Admin | Full CRUD on all entities |
| Manager | Read/create/update Bookings, no delete |
| Customer | Read Hotels/Rooms, read/update only own Bookings and Guest profile, can create Bookings |

## Running Locally

npm install
cds watch


- OData service: `http://localhost:4004/odata/v4/hotel-booking/`
- Fiori app: `http://localhost:4004/my.hotelbooking.bookings/index.html`

Test users (mocked auth): `admin/admin`, `manager/manager`, `saba/saba` (Customer, linked to guest `saba.grigolia@example.com`), `john/john` (Customer).

## Learn More

Built with the SAP Cloud Application Programming Model — <https://cap.cloud.sap>.