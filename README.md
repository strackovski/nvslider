## nvslider
A simple DOM element slider. Visit the [nvslider](http://www.envee.eu/projects/nvslider/) page for a detailed documentation and to see the slider in action.

### Dependencies
 - jQuery
 - [FontAwesome](http://www.fontawesome.io/) (included in libs folder)


### How to use the plugin
##### 1. Make an unordered list, populate it with list items that contain span elements
<pre>&#60ul class="myList"&#62
	&#60li&#62&#60span&#62Item 1&#60/span&#62&#60/li&#62
	&#60li&#62&#60span&#62Item 2&#60/span&#62&#60/li&#62
	&#60li&#62&#60span&#62Item 3&#60/span&#62&#60/li&#62
	&#60li&#62&#60span&#62Item 4&#60/span&#62&#60/li&#62
&#60/ul&#62</pre>

*Note: The ul element will take the whole width of the parent.
If you want to adjust the width, set it on the parent, not the ul element itself.*

##### 2. Call the plugin on an unordered list inside your document.ready() event.
<pre>$(&#39;.myList&#39;).nvslider();
</pre>

### License

Released under the MIT license. Please see the LICENSE file provided with this project.