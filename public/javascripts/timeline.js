/**
    timeline.js
    ===========
    Author: Nick Francisci

    This file is responsible for creating and updating
    the dynamic elements in the timeline. The place to
    start here is the 'update' function, which updates
    or creates all dynamic elements on the page.

*/

// ----- CONSTANTS & CONFIG ----- //
var MS_PER_HOUR = 3600000;              // Number of milliseconds per hour

var MS_PER_MINUTE = 3600000/60;     // Number of milliseconds per minute
var MS_PER_DAY = 3600000*24;        // Number of milliseconds per day 
var DEFAULT_UPDATE_INTERVAL = 250;    // Default update interval in ms


var selectedDate = new Date();
var scrollingInterval;


// ----- UPDATE ----- //
/**
    update
    ------

    Responsible for creating or updating
    all dynamic elements on the timeline. If elements have
    been created or modified, calling update will likely
    set them up correctly.
*/
function update () {
    //Clear tick list
    hour_tick_list = document.querySelector("#hour-tick-list");
    hour_tick_list.innerHTML = "";
    // hour_tick_list2 = document.querySelector("#hour-tick-list");
    // hour_tick_list2.innerHTML = "";

    // Determine the pixel width of an hour
    var slider_value = document.querySelector('#scale-slider').value;
    this.num_hours = Math.pow(slider_value, 2);
    this.hour_width = hour_tick_list.offsetWidth / this.num_hours;

    var now = new Date();

    // Determine the pixel offset of the current-time-bar from the left
    this.now_offset = .25 * hour_tick_list.offsetWidth + ((now - selectedDate) / MS_PER_HOUR ) * this.hour_width;


    // hours being displayed
    if (slider_value > 3 && slider_value <= 8) {

            // Determine the pixel offset of the current-time-bar from the left
            this.now_offset = .25 * hour_tick_list.offsetWidth + ((now - selectedDate) / MS_PER_HOUR ) * hour_width;
            document.querySelector('#current-time-bar').style.left = this.now_offset + "px"

            // Calculate the start point of the first hour
            var hours_to_left = this.now_offset / this.hour_width;

            var hour_start = Math.floor(now.getHours() - hours_to_left);
            this.initial_offset = now_offset + ((hour2Date(hour_start) - now) / MS_PER_HOUR) * this.hour_width;
            var hour_tick = createHourTick(hour_start);
     
            hour_tick.style.left = initial_offset + "px";
            hour_tick_list.appendChild(hour_tick);

        for (var i = 1; i < num_hours + 2; i++) {
            var hour_tick = createHourTick(i + hour_start);
            hour_tick.style.left = initial_offset + "px";
            hour_tick_list.appendChild(hour_tick);
        }

        // console.log(hour_tick_list)

        updateElemOffset('.item');
        updateEventDuration();
    
    // every fifteenth minutes and hours being displayed

    } else if (slider_value <=3 && slider_value >=2) {

             // Determine the pixel offset of the current-time-bar from the left
            this.now_offset = .25 * hour_tick_list.offsetWidth + ((now - selectedDate) / MS_PER_HOUR ) * hour_width;
            document.querySelector('#current-time-bar').style.left = this.now_offset + "px"

            // Calculate the start point of the first hour
            var hours_to_left = this.now_offset / this.hour_width;

            var hour_start = Math.floor(now.getHours() - hours_to_left);
            this.initial_offset = now_offset + ((hour2Date(hour_start) - now) / MS_PER_HOUR) * this.hour_width;
            var hour_tick = createHourTick2(hour_start);
     
            hour_tick.style.left = initial_offset + "px";
            hour_tick_list.appendChild(hour_tick);

        for (var i = 1; i < num_hours + 2; i++) {
            var hour_tick = createHourTick2(i + hour_start);
            hour_tick.style.left = initial_offset + "px";
            hour_tick_list.appendChild(hour_tick);
        }

        // console.log(hour_tick_list)

        updateElemOffset('.item');
        updateEventDuration();

        // display minutes and hours

    } else if (slider_value <=2 && slider_value >=1) {

           slider_value = 1;

        num_hours = Math.pow(slider_value, 2);
        num_minutes = num_hours*60;
        this.hour_width = hour_tick_list.offsetWidth / num_hours;
        this.minute_width = hour_tick_list.offsetWidth / num_minutes;

        this.now_offset = .25 * hour_tick_list.offsetWidth + ((now - selectedDate) / MS_PER_HOUR) * hour_width;
        document.querySelector('#current-time-bar').style.left = this.now_offset + "px";

        // Calculate the start point of the first hour
        var hours_to_left = this.now_offset / this.hour_width;
        // Calculate the start point of the first minute
        var minutes_to_left = this.now_offset / this.minute_width;
 
        var now = new Date();
        hour_start = Math.floor(now.getHours() - hours_to_left);
        minute_start = Math.floor(now.getMinutes() + 2 - minutes_to_left);
        initial_offset = this.now_offset + ((minute2Date(minute_start) - now) / MS_PER_HOUR) * this.minute_width;
        
        // Create first minute tick and place it on timeline
        var minute_tick = createMinuteTick(hour_start, minute_start);

        minute_tick.style.left = initial_offset + "px";
        hour_tick_list.appendChild(minute_tick); 

        for (var i = 1; i < num_minutes + 2; i++) {
            var minute_tick = createMinuteTick(hour_start, i + minute_start);
            minute_tick.style.left = initial_offset + "px";
            hour_tick_list.appendChild(minute_tick);


    }

    // Update Item (Nodes & Events) Displays
    updateElemOffset('.item');
    updateEventDuration();
}
    // // Update Time-Bars
    updateBar('current', this.now_offset);
    updateBar('selected', .25 * hour_tick_list.offsetWidth);
    updateClock('current', now);
    updateClock('selected', selectedDate);


}
    

/**
    startUpdates
    ------

    This function updates the timeline immediately and starts
    a timer to update at regular intervals. The length of these
    intervals defaults to the constant DEFAULT_UPDATE_INTERVAL,
    but can be overriden by providing an argument, 'ms_interval'.
*/
function startUpdates(ms_interval) {
    // Default to the DEFAULT_UPDATE_INTERVAL
    ms_interval = ms_interval || DEFAULT_UPDATE_INTERVAL;

    update();
    setInterval(function () {update()}, ms_interval);
}


/**
    createHourTick
    -----

    Creates an DOM element (but does not add it to the dom)
    representing an hour on the timeline. It must be supplied
    with a number of hours starting at 1 = 1 AM. It will
    format AM/PM appropriately, and numbers over 24 will wrap.
*/
function createHourTick (value) {
    var hour_tick = document.createElement("LI");
    addDay(hour_tick,value);
    var text = document.createTextNode(hour2Date(value).format("hT"));
    hour_tick.appendChild(text);
    hour_tick.className = "hour-tick";
    hour_tick.style.width = this.hour_width + "px";
    return hour_tick
 
}

/**
    addDay
    -----
    A helper for createHourTick that adds a day marker each 24 hour
    period.
*/
function addDay(hour_node, value) {
    var container = document.createElement("DIV")

    var date = document.createTextNode(" ");
    // If the hour is the beginning of a day
    if (value % 24 === 0)
        date = document.createTextNode(hour2Date(value).format("ddd, mmm dS"));

    container.appendChild(date);
    hour_node.appendChild(container);
    return hour_node;
}

// hours and every fifteenth minutes being displayed 
function createHourTick2 (value) {
    var hour_tick = document.createElement("LI");
    var text = document.createTextNode(hour2Date(value).format("hT"));
    hour_tick.appendChild(text);
    hour_tick.className = "hour-tick";
    hour_tick.style.width = this.hour_width + "px";
    addMinute(hour_tick, value)
    return hour_tick
 
}

// hours and every fifth minutes being displayed
function createHourTick3 (value) {
    var hour_tick = document.createElement("LI");
    var text = document.createTextNode(hour2Date(value).format("hT"));
    hour_tick.appendChild(text);
    hour_tick.className = "hour-tick";
    hour_tick.style.width = this.hour_width + "px";
    addMinute2(hour_tick, value)
    return hour_tick
 
}

// repeats string s for n number of times 

function repeat(s, n){
    var a = [];
    while(a.length < n){
        a.push(s);
    }
    return a.join('');
}


//display every fifteenth minute
function addMinute(hour_node, value) {
    var container = document.createElement("DIV")

    var date = document.createTextNode(" ");
    // If the hour is the beginning of a day
    // if (value % 24 === 0)
    for (var i = 0; i < 61; i++) {

        var slider_value = document.querySelector('#scale-slider').value; 
        if  (slider_value == 2) {

                if (i==15 || i==30 || i==45){
                    date = document.createTextNode(repeat("\u00a0", 15)+i+" |")
                
                    container.appendChild(date);
                    hour_node.appendChild(container);
                }
            }

        if  (slider_value  == 2.1) {

                if (i==15 || i==30 || i==45 ){
                    date = document.createTextNode(repeat("\u00a0", 13)+i+" |")
                
                    container.appendChild(date);
                    hour_node.appendChild(container);
                }
            }

         if  (slider_value > 2.1 && slider_value  < 2.9) {
                c = Math.round(12 - (slider_value-2)*10)  
                // console.log(c)

            if (i==15 || i==30 || i==45 ){
                date = document.createTextNode(repeat("\u00a0", c)+i+" |")
            
                container.appendChild(date);
                hour_node.appendChild(container);
            } 
        }

        if  (slider_value ==3 ) {
               
            if (i==15 || i==30 || i==45){
                date = document.createTextNode(repeat("\u00a0", 3)+i+" |")
            
                container.appendChild(date);
                hour_node.appendChild(container);
            } 
        }

        if  (slider_value  == 2.9 ) {
               
            if (i==15 || i==30 || i==45 ){
                date = document.createTextNode(repeat("\u00a0", 4)+i+" |")
            
                container.appendChild(date);
                hour_node.appendChild(container);
            } 
        }

    }
    return hour_node;

}



function addDay(hour_node, value) {
    var container = document.createElement("DIV")

    var date = document.createTextNode(" ");
    // If the hour is the beginning of a day
    if (value % 24 === 0)
    date = document.createTextNode(hour2Date(value).format("ddd, mmm dS"));
    container.appendChild(date);
    hour_node.appendChild(container);
    return hour_node;

}


// value 1 -- hour,  value --- minutes
function addHour(minute_node, value1, value) {
    var container = document.createElement("DIV")
    var hour = document.createTextNode(" ");
    var now = new Date();
    minute_now = Math.floor(now.getMinutes())
    if (value % 60 === 0)
        if (minute_now >= 15){
             hour = document.createTextNode(hour2Date(value1+2).format("hT"));
        }else {
             hour = document.createTextNode(hour2Date(value1+1).format("hT"));
        }
   
    // console.log(hour)
    container.appendChild(hour);
    minute_node.appendChild(container);
    return minute_node;

}

// value 1 -- hour,  value --- minutes
function addHour2( value) {
    var container = document.createElement("DIV")
    var hour_tick = document.createElement("LI");
    // if (value%60 ==0)
    hour_tick = document.createTextNode(hour2Date(value).format("hT"))
  
    // console.log(hour)
    container.appendChild(hour_tick);
    minute_node.appendChild(container);
    return minute_node;

}

// value 1 -- hour , value 2 -- minute
function createMinuteTick (value1, value2) {
    var minute_tick = document.createElement("LI");
    addHour(minute_tick, value1, value2)
    var text = document.createTextNode(minute2Date(value1,value2).format("M"));
    minute_tick.appendChild(text);
    minute_tick.className = "hour-tick";
    minute_tick.style.width = this.minute_width + "px";
    return minute_tick
}

/**
    hour2Date
    -----

    A utility to convert a number representing an hour during
    the current day to a javascript Date object representing the
    given hour on the current day. Hours will wrap: EG hour2Date(28)
    would return a Date for 4AM tomorrow.
*/
function hour2Date(hour) {
    var now = new Date();
    now.setHours(hour);
    now.setMinutes(0);
    now.setSeconds(0);
    return now;
}

function minute2Date(hour,minute) {
    var now = new Date();
    now.setHours(hour);
    now.setMinutes(minute);
    now.setSeconds(0);
    return now;
}


// ----- ITEM UPDATE FUNCTIONS ----- //

/**
    updateElemOffset
    -----

    Sets the left offset of a set of elements matching the inputed
    query_selector so that they appear at an x-position appropriate
    for their 'data-start-date' attribute. When used regularly, this
    can be used to position timeline items at the right times.
*/
function updateElemOffset(query_selector) {
    var items = document.querySelectorAll(query_selector);
    for (var i=0; i < items.length; i++)
        items[i].style.left = date2XPos(items[i].getAttribute('data-start-date')) + 'px';
}


/**
    updateEventDuration
    -----

    Sets the width of all event items so that it is appropriate to
    their start and end times. This is especially important to refresh
    after scale events.
*/
function updateEventDuration() {
    var events = document.querySelectorAll('.event');
    var startDate;
    var endDate;

    for (var i=0; i < events.length; i++) {
        startDate = new Date(events[i].getAttribute('data-start-date'));
        endDate = new Date(events[i].getAttribute('data-end-date'));
        events[i].style.width = this.hour_width * (endDate-startDate) / MS_PER_HOUR + 'px';
    }
}


// ----- TIME BAR UPDATE FUNCTIONS ----- //

/**
    updateBar
    ----
    Updates horizontal bar location.
*/
function updateBar(name, offset) {
    document.querySelector('#' + name + '-time-bar').style.left = offset + "px";
}

/**
    updateClock
    -----
    Updates the time displayed next the referenced time bar.
*/
function updateClock(name, date) {
    document.querySelector("#" + name + "-date").innerHTML = date.format("fullDate");
    document.querySelector("#" + name + "-time").innerHTML = date.format("mediumTime");
}


// ----- POSITION/DATE CONVERSION FUNCTIONS ------ //

/**
    date2XPos
    ----

    A utility to convert from a javascript date object to the appropriate
    x-position on which it should appear on the screen (in pixels from the
    left) in order to be in sync with the timeline. This is especially useful
    in rendering data with associated dates to the screen. See also the inverse
    function, xPos2Date.
*/
function date2XPos(date) {
    var date = new Date(date);
    return this.now_offset + this.hour_width * ((date - new Date()) / MS_PER_HOUR);
}


/**
    xPos2Date
    ----

    A utility to convert from an onscreen x-position (in pixels from the
    left) to a javascript date object corresponding to the hour ticks on
    the timeline. This is especially useful in creating objects from
    click events. See also the inverse function, date2XPos.
*/
function xPos2Date(xpos) {
    // Calculate the time in hours relative to now
    var rel_time = (xpos - this.now_offset) / this.hour_width;
    var d = new Date ();
    d.setMilliseconds(MS_PER_HOUR * rel_time);
    return d;
}



// ------------------------------------ //
// --         EVENT CALLBACKS        -- //
// ------------------------------------ //


// ----- LEFT/RIGHT PAN ARROWS ------ //

/**
    scroll
    -----
    A function to be called on a mousedown that pans the timeline
    left or right depending on the value of speed. Positive values pan left,
    negative pans right.
*/
function scroll(event, speed) {
    if(event.which === 1) {
        stopScroll();       // Just in case.
        scrollStep(speed);  // Give one initial move so user can click just once for fine control
        this.scrollingInterval = setInterval(function() { scrollStep(speed) }, 200);
    }
}

/**
    scrollStep
    -----
    A helper that executes one step of the scroll function.
*/
function scrollStep (speed) {
    selectedDate.setMinutes(selectedDate.getMinutes() - this.num_hours * 60 * speed);
    update();
}

/**
    stopScroll
    -----
    A mouseup function to stop scrolling left or right.
*/
function stopScroll () {
    clearInterval(this.scrollingInterval);
}


// ----- CLICK TO SNAP ----- //
function snap (event) {
    selectedDate = xPos2Date(event.clientX);
    selectedDate.setMinutes(0);
    selectedDate.setSeconds(0);
    selectedDate.setMilliseconds(0);
    update();
}
