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
    return moment(dateString, 'M-D-YYYY h:mma').format('hh:mma');
  };

  $document.ready(function () {

    // get calendar events from post
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
      
      events[entryDate(entry.date)] = entry;
      delete(entry.date);

      if(_.isEmpty(entry.repeat)){
        // events[entryDate(entry.date)] = entry;
        // delete(entry.date);
      } else {
console.log('entry')
        
        var parentTime = entry.time
        entry.repeat.forEach(function(date){

          events[entryDate(date)] = entry;

          var time = entryTime(date);
          if(time === '12:00am') events[entryDate(date)].time = parentTime;
          else events[entryDate(date)].time = time;
          
          console.log(time, entry.time);
        })
      }

      // if(entry.repeat) entry.repeat = entry.repeat.split(',');

      // events.push(entry);
    });
console.log(events);

    // build whole calendar
    var $calendar = $('#calendar');
    var $buttonPrev = $('.calendar-arrows #prev');
    var $buttonNext = $('.calendar-arrows #next');
    var weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    var i = moment(startDate);
    var $monthTitles = {};
    var $monthCalendars = {};

    while(i < endDate) {

      var monthName = moment.months(i.get('month'));
      var month = i.month();
      var days = weekdays.map(function(day){ return '<td>'+day+'</td>'});
      var daysInMonth = moment(i).daysInMonth();
      var weeks = [];

      var date = moment(i);
      var inMonth = false;

      date.subtract(date.day(), 'days');
      
      do {
        // console.log(date.date(), date.month(), month);
        var week = '<tr>';
        weekdays.forEach(function(){
          inMonth = date.month() === month;
          week += '<td>';
          week += '<div class="date';
          if(!inMonth) week += ' muted';
          week += '">' + date.date() + '</div>';
          week += '</td>';
          date.add(1, 'days')
        });
        week += '</tr>';
        weeks.push(week);
        
      } while(inMonth);

      // console.log('hey ok');
      

      var $calendar = $(
      '<table class="calendar">\
        <thead>' + days.join('') + '</thead>\
        <tbody>' + weeks.join('') + '</tbody>\
      </table>');
      var $title = $('<h1 class="post-title">'+monthName+'</h1>');
      $monthTitles[i.format('MM-YYYY')] = $title;
      $monthCalendars[i.format('MM-YYYY')] = $calendar;
      $('.post-header').append($title);
      $('.post-content').append($calendar);
      i = i.add(1, 'months');
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
    }

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

    // console.log(startDate); 

  });
})(jQuery);
