sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"my/hotelbooking/bookings/test/integration/pages/BookingsList.gen",
	"my/hotelbooking/bookings/test/integration/pages/BookingsObjectPage.gen"
], function (JourneyRunner, BookingsListGenerated, BookingsObjectPageGenerated) {
    'use strict';

    const runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('my/hotelbooking/bookings') + '/test/flp.html#app-preview',
        pages: {
			onTheBookingsListGenerated: BookingsListGenerated,
			onTheBookingsObjectPageGenerated: BookingsObjectPageGenerated
        },
        async: true
    });

    return runner;
});

