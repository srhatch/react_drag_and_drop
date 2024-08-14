# react_drag_and_drop
## A drag and drop image upload component

This component is used to submit images with a form and shows a display of the loaded images. There is a larger drop-zone where images can be dropped, and there is also the option to select files with the built in file picker. An empty &lt;div&gt; placeholder is used as a visual queue for where the images will be shown. Images are inserted in left to right order, but if an image is deleted any remaining images will stay in their placeholder. I chose to structure it this way to prevent the jarring UX of having the images shift into open placeholders.
<br><br>
Certain validation functions are called on loaded images to check for file size and for file type. Error messages are configured by the &lt;ErrorMessage&gt; component and will show the most recent message. So, for example, if a user tries to load more than the maximum number of images allowed and then tries to load a file that is too big, the message describing the file size error will show. Error messages will otherwise be removed if another file is loaded or if a file is deleted.
<br><br>
I named the component &lt;ImageForm&gt; for this demo, but more realistically the form would be using other input components and then submitting those values in the onSubmit handler.
<br><br>
To try the demo:<br>
Install Node.js<br>
Clone repository<br>
Change to next_app directory<br>
Run command: <code>npm install</code><br>
Run command: <code>npm run dev</code><br>
Navigate to http://localhost:3000 in a browser
