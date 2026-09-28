import cds from '@sap/cds';

export default class HotelBookingService extends cds.ApplicationService {
  init() {
    const { Bookings, Rooms, Guests } = this.entities;

    // Merge incoming data with the stored row (needed for partial UPDATEs)
    const resolve = async (req) => {
      const existing = req.event === 'UPDATE'
        ? await SELECT.one.from(Bookings).where({ ID: req.data.ID })
        : {};
      return { ...existing, ...req.data };
    };

    // 0. AUTHORIZATION: customers can only book for themselves
    this.before('CREATE', Bookings, async (req) => {
        if (!req.user.is('Customer') || req.user.is('Admin')) return;
        const guest = await SELECT.one.from(Guests).where({ email: req.user.attr.email });
        if (!guest) return req.reject(403, 'No guest profile linked to this user');
        req.data.guest_ID = guest.ID;
    });

    // 1. VALIDATION: dates
    this.before(['CREATE', 'UPDATE'], Bookings, async (req) => {
      const { checkIn, checkOut } = await resolve(req);
      if (!checkIn || !checkOut) return;

      const today = new Date().toISOString().slice(0, 10);
      if (req.event === 'CREATE' && checkIn < today)
        req.error(400, 'Check-in date cannot be in the past', 'checkIn');
      if (checkOut <= checkIn)
        req.error(400, 'Check-out date must be after check-in date', 'checkOut');
    });

    // 2. VALIDATION: room availability / overlapping bookings
    this.before(['CREATE', 'UPDATE'], Bookings, async (req) => {
      const { ID, room_ID, checkIn, checkOut, status } = await resolve(req);
      if (!room_ID || !checkIn || !checkOut || checkOut <= checkIn) return;
      if (status === 'CANCELLED') return;

      const room = await SELECT.one.from(Rooms).where({ ID: room_ID });
      if (!room) return req.error(404, 'Room not found', 'room_ID');
      if (!room.isAvailable)
        return req.error(400, `Room ${room.roomNumber} is not available for booking`, 'room_ID');

      const where = {
        room_ID,
        status: { '!=': 'CANCELLED' },
        checkIn: { '<': checkOut },
        checkOut: { '>': checkIn }
      };
      if (ID) where.ID = { '!=': ID };

      const clash = await SELECT.one.from(Bookings).where(where);
      if (clash)
        req.error(409, `Room ${room.roomNumber} is already booked from ${clash.checkIn} to ${clash.checkOut}`, 'room_ID');
    });

    // 3. COMPUTATION: total price and currency from room rate x nights
    this.before(['CREATE', 'UPDATE'], Bookings, async (req) => {
      const { room_ID, checkIn, checkOut } = await resolve(req);
      if (!room_ID || !checkIn || !checkOut || checkOut <= checkIn) return;

      const room = await SELECT.one.from(Rooms).where({ ID: room_ID });
      if (!room) return;

      const nights = Math.round((new Date(checkOut) - new Date(checkIn)) / 86400000);
      req.data.totalPrice = Number((nights * room.pricePerNight).toFixed(2));
      req.data.currency_code = room.currency_code;
    });

    // 4. FIELD MANIPULATION: default status on creation
    this.before('CREATE', Bookings, (req) => {
      req.data.status ??= 'PENDING';
    });

    // 5. EXTERNAL API: convert booking price via exchange-rate API
    this.on('convertBookingPrice', async (req) => {
      const { bookingID, targetCurrency } = req.data;
      const booking = await SELECT.one.from(Bookings).where({ ID: bookingID });
      if (!booking) return req.reject(404, 'Booking not found');

    if (req.user.is('Customer') && !req.user.is('Admin') && !req.user.is('Manager')) {
        const guest = await SELECT.one.from(Guests).where({ ID: booking.guest_ID });
        if (guest?.email !== req.user.attr.email)
            return req.reject(403, 'Not your booking');
    }

      const from = booking.currency_code;
      const to = targetCurrency.toUpperCase();
      let rate = 1;

      if (from !== to) {
        const res = await fetch(`https://api.frankfurter.dev/v1/latest?base=${from}&symbols=${to}`);
        if (!res.ok) return req.reject(502, 'Exchange rate service unavailable');
        const data = await res.json();
        rate = data.rates?.[to];
        if (!rate) return req.reject(400, `Unsupported currency: ${to}`);
      }

      return {
        originalAmount: booking.totalPrice,
        originalCurrency: from,
        targetCurrency: to,
        rate,
        convertedAmount: Number((booking.totalPrice * rate).toFixed(2))
      };
    });

    return super.init();
  }
}