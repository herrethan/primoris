(function ($, undefined) {
  "use strict";

  // start and end months for calendar year
  var startDate = moment('09-2016', 'MM-YYYY');
  var endDate = moment('07-2017', 'MM-YYYY');

  var now = moment();
  var events = {};

  var $document = $(document);

  var entryDate = function(dateString) {
    return moment(dateString, ['M-D-YYYY', 'MMM-D-YYYY']).format('MM-DD-YYYY');
  };

  var entryTime = function(dateString) {
    return moment(dateString, 'M-D-YYYY h:mma').format('h:mma');
  };

  var addNewEntry = function(id, entry) {
    if(events[id]) events[id].push(entry);
    else events[id] = [entry];
    delete(entry.date);
  };

  $document.ready(function () {

    // get calendar event entries from post
    var postContent = $('#post-content').text().replace(/[\n\r]/g, '');

    postContent.split('[EVENT]').forEach(function(eventString){

      if(eventString.indexOf('[name]') < 0 ||
         eventString.indexOf('[date]') < 0) return;

      var entry = {};

      eventString.split('[').forEach(function(prop){
        var key = _.toLower(prop.substring(0, prop.indexOf(']')));
        var value = _.trimStart(_.trimEnd(prop.substring(prop.indexOf(']')+1)));
        if(key === 'repeat') value = value.split(',');
        if(key.length && value.length) entry[key] = value;
      });

      // create a dictionary of entries
      addNewEntry(entryDate(entry.date), entry);

      if(!_.isEmpty(entry.repeat)){

        var parentTime = entry.time
        entry.repeat.forEach(function(date){

          var newEntry = jQuery.extend({}, entry);
          var dateFormatted = entryDate(date);
          var time = entryTime(date);
          if(time === '12:00am') newEntry.time = parentTime;
          else newEntry.time = time;

          addNewEntry(dateFormatted, newEntry);
          delete(newEntry.repeat);
        });
        delete(entry.repeat);
      }
    });

    // build whole calendar
    var $calendar = $('#calendar');
    var $buttonPrev = $('.calendar-arrows #prev');
    var $buttonNext = $('.calendar-arrows #next');
    var $postHeader = $('.post-header');
    var $postContent = $('.post-content');
    var weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    var dateIndex = moment(startDate);
    var $monthTitles = {};
    var $monthCalendars = {};

    while(dateIndex < endDate) {

      var monthName = moment.months(dateIndex.get('month'));
      var month = dateIndex.month();
      var days = weekdays.map(function(day){ return '<td>'+day+'</td>'});
      var daysInMonth = moment(dateIndex).daysInMonth();
      var weeks = [];
      var date = moment(dateIndex);
      var inMonth = false;

      // start on sunday of first week of month
      date.subtract(date.day(), 'days');

      do {
        // build week rows
        var week = '<tr>';
        weekdays.forEach(function(){
          var id = date.format('MM-DD-YYYY');
          inMonth = date.month() === month;
          week += '<td><div>';

          // clickable link cover for the day
          week += '<a href="javascript:;" class="date"';
          if(!inMonth) week += ' disabled';
          week += '><span>' + date.date() + '</span></a>';

          // add abbreviated event entries for calendar day
          if(events[id] && inMonth){
            week += '<div class="events">';
            events[id].forEach(function(entry, i){
              week += '<article class="event event-'+ entry.type +'">'+
                        // '<span class="event-time">'+ entry.time +'</span>'+
                        '<span class="event-name">'+ entry.name +'</span>'+
                      '</article>';
            });
            week += '</div>'
          }

          // add day full event entries for pop-up
          if(events[id] && inMonth){
            week += '<div class="calendar-popup">' +
                    '<h2>'+ date.format('dddd') + ', ' + monthName + ' ' + date.date() +'</h2><ul>';
            events[id].forEach(function(entry, i){
              week += '<li class="popup-entry event-'+ entry.type +'">'+
                        '<h3>'+ entry.time +': '+ entry.name +'</h3>'+
                        '<p>'+ (entry.description || '') +'</p>'+
                      '</li>';
            });
            week += '</ul></div>'
          }

          week += '</div></td>';
          date.add(1, 'days')
        });
        week += '</tr>';
        weeks.push(week);

      } while(inMonth);

      var $title = $('<h1 class="post-title">'+monthName+'</h1>');

      var $calendar = $(
        '<table class="calendar">\
          <thead>' + days.join('') + '</thead>\
          <tbody>' + weeks.join('') + '</tbody>\
        </table>');

      $monthTitles[dateIndex.format('MM-YYYY')] = $title;
      $monthCalendars[dateIndex.format('MM-YYYY')] = $calendar;
      $postHeader.append($title);
      $postContent.append($calendar);
      dateIndex.add(1, 'months');
    }

    var toMonth = function(date){

      var dateString = date.format('MM-YYYY');
      var startMonthString = startDate.format('MM-YYYY');
      var endMonthString = moment(endDate).subtract(1, 'months').format('MM-YYYY');

      _.each($monthCalendars, function(value, key){
        $monthTitles[key].removeClass('current');
        $monthCalendars[key].removeClass('current');
      });

      $monthTitles[dateString].addClass('current');
      $monthCalendars[dateString].addClass('current');
      $buttonPrev.prop('disabled', false);
      $buttonNext.prop('disabled', false);

      if(dateString === startMonthString) {
        $buttonPrev.prop('disabled', true)
      } else if(dateString === endMonthString) {
        $buttonNext.prop('disabled', true)
      }
    };

    $buttonPrev.bind('click', function(){
      toMonth(currentMonth.subtract(1, 'months'));
    });

    $buttonNext.bind('click', function(){
      toMonth(currentMonth.add(1, 'months'));
    });

    // show current month or closest to it
    var currentMonth;
    if(now < startDate) currentMonth = moment(startDate)
    else if(now > endDate) currentMonth = moment(endDate)
    else currentMonth = now;

    toMonth(currentMonth);

  });
})(jQuery);
