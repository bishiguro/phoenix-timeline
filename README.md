# Phoenix-Timeline
Olin.js Final Project, Spring 2015

Phoenix-Timeline is a project managment app. We designed it with the Olin student in mind: juggling four teams with their own subteams, deliverables, and meetings to coordinate. While not all of the desired features are implemented (see Roadmap, below), Phoenix-Timeline currently operates as a calendar for independent users.

## Core Concepts
- Timeline: The graphical calendar on which all your data exists. Left is the past, and right is the future.
- Clock Bar: The display of minutes, hours, and days at the top of the timeline.
- Time-Bar: A vertical indicator of a certain time, with an associated clock at its base.
- Project: You can have several projects running at once, which keeps their tasks and events independent.
- Stream: A project has several streams, which represent subteams or otherwise independent groups of deliverables within a project.
- Personal Stream: When navigating multiple projects, it helps to bring everything together in one place. The personal stream is persistant across all projects.
- Event: A block of time that is reserved on a stream. The classic example of an event is a meeting.
- Node: A to-do item, due at a certain point in time. The classic example is a deliverable.
 

## The Exhaustive Usage Guide
####Navigating Timeline:
- Left is the past, right is the future.
- The vertical red 'time-bar' shows the current time. The vertical blue 'time-bar' shows the selected time; the time at which you are currently centered.
- The scale slider in the toolbar allows you to zoom in or out around the selected time. Right zooms out, left zooms in.
- To pan left or right on the timeline using the left and right arrows superimposed on the clockbar. They can be either clicked once, or held down. Zooming out with the scale slider will cause these arrows to pan the timeline more quickly.
- To snap to a particular hour, click that hour in the clock bar.
- To snap to a particular day, use the "Date Shown" tool in the toolbar. You can either enter the date, or click the calendar icon to bring up an interactive calendar widget.

####Projects:
- To start off, you will have no projects.
- To create a new project, click the button labelled "New" on the left side of the toolbar.
- To switch projects, use the dropdown menu labelled "Project Control": the leftmost icon on the toolbar.
- To change the name of a project, switch to that project and then click the "Edit" button on the left side of the toolbar.
- To delete a project, click the red "Delete" button on the left side of the toolbar.

####Streams:
- In each project you create, you will have access to your personal stream. Nodes and events created here will be persistant across all projects. The personal stream cannot be deleted, and its name cannot be edited.
- To create a new stream, tied to the current project, look for the plus icon labelled "New Stream", located to the left of the blue selected time-bar and below all current streams.
- To update a stream's name, simply click the name of the stream and edit the name. Clicking off or pressing "enter" will save the name.
- To delete a stream, simply click the 'X' icon to the left of the name.

####Nodes & Events:
- To create a node click and release on the stream on which you wish to create it. It will be created at the time marked on the clock bar above your mouse click.
- To create an event, click and drag horizontally from the start-time to the end-time on the stream on which you wish to create it.
- To edit or delete either a node or an event, simply click the node or event. This will bring up a menu from which either option is available.

####Google Sync:
- If you logged in with Google, you may sync events from your Google calendar to Phoenix Timeline. To do this click the "Sync" button on the left side of the toolbar. This is an experimental feature, and may not work if you have many Google events on your Google calendar.

####Logout
- Click the "Logout" button on the far right of the toolbar.


## Roadmap
So, so many things to be done. See the issues board for a (very) small sample of currently planned features and bugfixes.

## Compatability
Sadly, we currently only support use of timeline in Google Chrome. It may well work in other browsers, but has not been throughly tested, and probably looks like crap.
