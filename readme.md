# Getting Started

Welcome to your new CAP project.

It contains these folders and files, following our recommended project layout:

File or Folder | Purpose
---------|----------
`app/` | content for UI frontends goes here
`db/` | your domain models and data go here
`srv/` | your service models and code go here
`readme.md` | this getting started guide

## Next Steps

- Open a new terminal and run `cds watch`
- (in VS Code simply choose _**Terminal** > Run Task > cds watch_)
- Start with your domain model, in a CDS file in `db/`

## Learn More

Learn more at <https://cap.cloud.sap>.

This application manages hotel bookings for a small hotel chain. Hotel staff (Admins) manage hotel and room inventory, while customers browse rooms and create their own bookings. The system solves the problem of manual booking coordination by centralizing room availability, pricing, and guest records in one place. The main entities are Hotels, Rooms, Guests, and Bookings, with Bookings linking a Guest to a Room for a given date range and calculating the total price automatically.
