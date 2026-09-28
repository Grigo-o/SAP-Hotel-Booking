using { cuid, managed, Currency } from '@sap/cds/common';

namespace my.hotelbooking;

entity Hotels : cuid, managed {
    name : String(100) not null;
    city : String(100);
    address : String(200);
    rooms : Association to many Rooms on rooms.hotel = $self;
}

entity Rooms : cuid, managed {
    hotel : Association to Hotels not null;
    roomNumber : String(10) not null;
    type : String(50); // single, double, suite
    pricePerNight : Decimal(9, 2) not null;
    currency : Currency;
    capacity : Integer default 1;
    isAvailable : Boolean default true;
    bookings : Association to many Bookings on bookings.room = $self;
}

entity Guests : cuid, managed {
  firstName   : String(100) not null;
  lastName    : String(100) not null;
  email       : String(100) not null;
  phone       : String(50);
  bookings    : Association to many Bookings on bookings.guest = $self;
}

entity Bookings : cuid, managed {
  room        : Association to Rooms not null;
  guest       : Association to Guests not null;
  checkIn     : Date not null;
  checkOut    : Date not null;
  totalPrice  : Decimal(9,2);
  currency    : Currency;
  status      : String(20) default 'PENDING'; // PENDING, CONFIRMED, CANCELLED
}