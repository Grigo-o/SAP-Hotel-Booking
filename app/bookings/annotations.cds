using HotelBookingService as service from '../../srv/service';

// Value helps for Room and Guest pickers
annotate service.Rooms with @cds.odata.valuelist @(
  UI.Identification: [{ Value: roomNumber }]
);
annotate service.Guests with @cds.odata.valuelist @(
  UI.Identification: [{ Value: lastName }]
);

annotate service.Bookings with {
  room       @title: 'Room'      @Common.Text: room.roomNumber  @Common.TextArrangement: #TextOnly;
  guest      @title: 'Guest'     @Common.Text: guest.lastName   @Common.TextArrangement: #TextOnly;
  checkIn    @title: 'Check-in';
  checkOut   @title: 'Check-out';
  totalPrice @title: 'Total Price';
  status     @title: 'Status';
};

annotate service.Bookings with @(
  UI.HeaderInfo: {
    TypeName       : 'Booking',
    TypeNamePlural : 'Bookings',
    Title          : { Value: room.roomNumber },
    Description    : { Value: guest.lastName }
  },

  UI.SelectionFields: [ room_ID, guest_ID, status, checkIn ],

  UI.LineItem: [
    { Value: room_ID },
    { Value: guest_ID },
    { Value: checkIn },
    { Value: checkOut },
    { Value: totalPrice },
    { Value: currency_code, Label: 'Currency' },
    { Value: status }
  ],

  UI.Facets: [
    { $Type: 'UI.ReferenceFacet', ID: 'Details', Label: 'Booking Details', Target: '@UI.FieldGroup#Details' },
    { $Type: 'UI.ReferenceFacet', ID: 'Pricing', Label: 'Pricing',         Target: '@UI.FieldGroup#Pricing' }
  ],

  UI.FieldGroup #Details: { Data: [
    { Value: room_ID },
    { Value: guest_ID },
    { Value: checkIn },
    { Value: checkOut },
    { Value: status }
  ]},

  UI.FieldGroup #Pricing: { Data: [
    { Value: totalPrice },
    { Value: currency_code, Label: 'Currency' }
  ]}
);