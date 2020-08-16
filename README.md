# Zoom Downloader
Zoom Downloader is a Chrome extension + Node MITM server that allows you to download Zoom recordings that don't have "Viewers can download" enabled. I'm of the belief that it's silly to try prevent people downloading the recordings when their browser already has all the tools necessary to do so.

## Extension
The first part of Zoom Downloader is a Chrome extension that gathers up the user's Zoom cookies and the URL of the recording as these are necessary to access the video file. It presents the user with a popup containing a button that can be clicked to send the cookies and URL to the Node server and download the video.

## Node MITM Server
The second part is a Node MITM (man-in-the-middle) server that is used to get around Chrome's limitation that prevents extensions from making download requests that include a Cookie or Referer header, as both are necessary to access the video file. It accesses the video file using the URL and cookies included in the request, and pipes the file directly back into the request, acting as a simple bridge. The cookies are not logged or stored, simply forwarded to Zoom. It's unfortunate this is necessary to get around arbitary browser security, as a self contained extension that did not need to forward cookies to a third party server would obviously be more ideal.

## Running Locally
1. Run `yarn` to install dependencies.
2. Run `yarn build <MITM_URL>` where MITM_URL is the URL where you are hosting the Node server. This will build the extension with that URL hardcoded in. Follow the outputted instructions to install the extension.
3. Run `yarn start` to start the Node server. The server port defaults to 8080 but can be changed by setting the `PORT` environment variable.
