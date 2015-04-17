// Define constants
MS_PER_HOUR = 3600000

function updateTicks () {
    //Clear tick list
    this.hour_tick_list = document.querySelector("#hour-tick-list");
    this.hour_tick_list.innerHTML = "";

    // Determine the pixel offset of the current-time-bar from the left
    this.now_offset = .25 * this.hour_tick_list.offsetWidth;
    document.querySelector('#current-time-bar').style.left = this.now_offset + "px";

    // Determine  the pixel width of an hour
    var slider_value = document.querySelector('#scale-slider').value;
    this.num_hours = Math.pow(slider_value, 2);
    this.hour_width = this.hour_tick_list.offsetWidth / this.num_hours;

    // Calculate the start point of the first hour
    var hours_to_left = this.now_offset / this.hour_width;
    var now = new Date();
    this.hour_start = Math.floor(now.getHours() - hours_to_left);
    this.initial_offset = this.now_offset + ((hourToDate(this.hour_start) - now) / MS_PER_HOUR) * this.hour_width;

    // Create first hour tick and place it on timeline
    var hour_tick = createHourTick(this.hour_start);
    hour_tick.style.left = this.initial_offset + "px";
    hour_tick_list.appendChild(hour_tick);

    for (var i = 1; i < this.num_hours+10 ; i++) {
        var hour_tick = createHourTick(i + hour_start);
        hour_tick.style.left = this.initial_offset + "px";
        hour_tick_list.appendChild(hour_tick);
    }

    updateItemTime();
}

function createHourTick (value) {
    var hour_tick = document.createElement("LI");
    var text = document.createTextNode(formatHours(value));
    hour_tick.appendChild(text);
    hour_tick.className = "hour-tick";
    hour_tick.style.width = this.hour_width + "px";
    return hour_tick
}

function addDay(hour_node) {
    // If the hour is the beginning of a day
    if (hour_node % 24 === 0) {
        // Add a date node inside of it, beneath the hour tick
        var date = document.createTextNode(hourToDate(hour_node).format("ddd, mmm dS"));
    } else return hour_node;
}

function hourToDate(hour) {
    var now = new Date();
    now.setHours(hour);
    now.setMinutes(0);
    now.setSeconds(0);
    return now;
}

function updateItemTime() {
    var items = document.querySelectorAll('.item');
    console.log(items)
    for (var i=0; i < items.length; i++) {
        items[i].style.left = xPosForDate(items[i].getAttribute('data-start-date')) + 'px';
    }
}

function formatHours(hour) {
    return hourToDate(hour).format("hT");
}

function startUpdates(ms_interval) {
    updateTicks();
    setInterval(function () {updateTicks()}, ms_interval);
}

function dateAtXPos(xpos) {
    // Calculate the time in hours relative to now
    var rel_time = (xpos - this.now_offset) / this.hour_width;
    var d = new Date();
    d.setMilliseconds(MS_PER_HOUR * rel_time);
    return d;
}

function xPosForDate(date) {
    var date = new Date(date);
    return this.now_offset + this.hour_width * ((date - new Date()) / MS_PER_HOUR);
}
