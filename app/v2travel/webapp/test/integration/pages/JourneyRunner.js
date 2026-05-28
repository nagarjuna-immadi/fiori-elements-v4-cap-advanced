sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"nap/fe/v2travel/test/integration/pages/TravelList",
	"nap/fe/v2travel/test/integration/pages/TravelObjectPage",
	"nap/fe/v2travel/test/integration/pages/BookingObjectPage"
], function (JourneyRunner, TravelList, TravelObjectPage, BookingObjectPage) {
    'use strict';

    var runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('nap/fe/v2travel') + '/test/flp.html#app-preview',
        pages: {
			onTheTravelList: TravelList,
			onTheTravelObjectPage: TravelObjectPage,
			onTheBookingObjectPage: BookingObjectPage
        },
        async: true
    });

    return runner;
});

