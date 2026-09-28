using { my.hotelbooking as db } from '../db/schema';

service HotelBookingService @(requires: 'authenticated-user') {

  @restrict: [
    { grant: 'READ', to: ['Customer', 'Manager'] },
    { grant: '*',    to: 'Admin' }
  ]
  entity Hotels as projection on db.Hotels;

  @restrict: [
    { grant: 'READ', to: ['Customer', 'Manager'] },
    { grant: '*',    to: 'Admin' }
  ]
  entity Rooms as projection on db.Rooms;

  @restrict: [
    { grant: 'READ', to: 'Manager' },
    { grant: 'READ', to: 'Customer', where: 'email = $user.email' },
    { grant: '*',    to: 'Admin' }
  ]
  entity Guests as projection on db.Guests;
  
  @odata.draft.enabled
  @restrict: [
    { grant: ['READ', 'CREATE', 'UPDATE'], to: 'Manager' },
    { grant: ['READ', 'UPDATE'], to: 'Customer', where: 'guest.email = $user.email' },
    { grant: 'CREATE', to: 'Customer' },
    { grant: '*', to: 'Admin' }
  ]
  entity Bookings as projection on db.Bookings;

  function convertBookingPrice(bookingID : UUID, targetCurrency : String(3)) returns {
    originalAmount   : Decimal(9,2);
    originalCurrency : String(3);
    targetCurrency   : String(3);
    rate             : Decimal(12,6);
    convertedAmount  : Decimal(9,2);
  };

}