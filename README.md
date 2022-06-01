# Mediaplay: An Automated Downloader for UIUC's Mediaspace platform

## What is Mediaplay: 

- Mediaplay is an automated video/playlist downloader for the University of Illinois Mediaspace platform. 
	
- The frontend is written in React, the backend in Flask, and the browser automation in Selenium.

- The app will exclusively run locally and your login information ie. cookies won't leave your system.

## Requirements
### Docker
- To verify that docker is installed it suffices to run 

	`
	$ sudo systemctl start docker && docker --version
	`

- The expected output for this command is something along the lines of 

	`
	Docker version 20.10.2, build 2291f61
	`

- If docker is not already installed, you can install docker by following the instructions found [here](https://docs.docker.com/get-docker/)

### The cookie export extension of your choice

- To be able to use your mediaspace credentials to download stuff, the app will use the cookies you provide it in a cookie.txt file found in the root directory of the app

- To create the cookie.txt file in the Netscape format we make use of these extensions: 
	- [Extension for Firefox](https://addons.mozilla.org/tr/firefox/addon/cookies-txt/?utm_source=addons.mozilla.org&utm_medium=referral&utm_content=search)
	- [Extension for Chrome](https://chrome.google.com/webstore/detail/get-cookiestxt/bgaddhkoddajcdgocldbbfleckgcbcid?hl=tr)

- The steps that you would need to take to generate this file are as follows: 

	1. Navigate to https://mediaspace.illinois.edu
	2. Log in using your NetID and active directory password
	3. Click on the cookie exporting extension
	4. Click on export, or for this site only
	5. Save the file under the name "cookies.txt" in the root folder of the app repo

## Installation

- To install mediaplay, please run the following commands in the given order.

	`
	$ git clone https://github.com/CaglarDeniz/mediaplay.git . && cd ./mediaplay 
	`

	`
	$ sudo systemctl start docker
	`

	`
	$ sudo ./build.sh
	`

## Running

- To run the app in the foreground execute 

	`
	$ sudo ./run.sh
	`

- which will allow the user to see detailed information about the video being downloaded and the backend process

- To run the app in the background execute

	`
	$ sudo ./run-background.sh
	`

- which will hide info and warnings about the download process and the backend

## Usage 

- After running the app following the instructions above, you can open your favorite browser and visit http://localhost:3000 to interact with the applications.

### Before downloading your first video/playlist

##### Make sure that you've succesfully exported your cookies to a file as described in the [requirements](#requirements) section!!!

### Downloading a video

- After completing all the requirements,build,installation steps above, follow these next steps to succesfully download a video: 
	1. Add your cookie file to the form by clicking on the respective bullet point.
	2. Copy and paste a video link from mediaspace in to the respective bullet point.
	3. Choose a name for your video, and write it down to the respective bullet point.
	4. Hit "Download!" to start downloading your video

### Downloading a playlist

- After completing all the requirements,build,installation steps above, follow these next steps to succesfully download a playlist: 
	1. Add your cookie file to the form by clicking on the respective bullet point.
	2. Copy and paste a playlist link from mediaspace in to the respective bullet point. 
	3. NOTE: Please make sure that the playlist contains the string "channel", for a successful download 
	4. Choose a name for the playlist folder, and write it down to the respective bullet point.
	5. Hit "Download!" to start downloading your playlist



