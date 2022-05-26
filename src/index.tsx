import React from 'react';
import axios from 'axios';
import {DownloadWindow} from './Download';
import ReactDOM from 'react-dom/client';
import './index.css'


const blueBackground = {

	backgroundColor:"var(--uofiblue)"
}

const orangeBackground = {

	backgroundColor:"var(--uofichampaignorange)"
}

type AppState = {toggledMediaSpace:boolean,
		selectedFile:any,
		nameString:string,
		videoLinkString:string,	
		playlistLinkString:string,
		downloading:boolean,
		downloadComplete:boolean, 
		downloadObject:string,
		downloadError:boolean
};

type AppProps = {} ; 

class App extends React.Component<AppProps,AppState> {

	constructor(props:any) {
		super(props)
		
		this.state = {toggledMediaSpace:true,
			selectedFile:"",
			videoLinkString:"",
			playlistLinkString:"",
			downloading:false,
			downloadComplete:false,
			downloadObject:"",
			downloadError:false,
			nameString:""
		};
		
		this.handleMediaSpaceButton = this.handleMediaSpaceButton.bind(this);
		this.handleEchoButton = this.handleEchoButton.bind(this);
		this.onFileChange = this.onFileChange.bind(this);
		this.onFileUpload = this.onFileUpload.bind(this);
		this.onVideoLinkProvided = this.onVideoLinkProvided.bind(this);
		this.onPlaylistLinkProvided = this.onPlaylistLinkProvided.bind(this);
		this.onDownloadReset = this.onDownloadReset.bind(this);
		this.onNameStringProvided = this.onNameStringProvided.bind(this);
	}

	onFileChange(e:any) {
		this.setState({selectedFile: e.target.files[0]});
	}

	onFileUpload() {
		if (this.state.videoLinkString !== "" && this.state.playlistLinkString === "") {
			console.log("File succesfully uploaded with filename: " + this.state.selectedFile.name);
			
			let formData = new FormData() ; 
			formData.append("cookieFile",this.state.selectedFile);
			formData.append("videoLinkString",this.state.videoLinkString);
			formData.append("nameString",this.state.nameString);
			
			this.setState({downloading:true, downloadObject:"video"});
			axios.post('http://localhost:5000/video', formData, { 
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			}).then(
				res => {
				console.log(res);
				this.setState({downloadComplete:true,downloading:false});
			}).catch( 
				error => {
				console.log(error); 
				this.setState({downloadError:true,downloading:false,downloadComplete:false,downloadObject:""});
			});
		}

		else if  (this.state.playlistLinkString !== "" && this.state.videoLinkString === "") {
			console.log("File succesfully uploaded with filename: " + this.state.selectedFile.name);
			let formData = new FormData() ; 
			formData.append("cookieFile",this.state.selectedFile);
			formData.append("playlistLinkString",this.state.playlistLinkString);
			formData.append("nameString",this.state.nameString);
			
			this.setState({downloading:true,downloadObject:"playlist"});
			axios.post('http://localhost:5000/playlist', formData, { 
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			}).then(
				res => {
				console.log(res);
				this.setState({downloadComplete:true,downloading:false});
			}).catch( 
				error => {
				console.log(error); 
				this.setState({downloadError:true,downloading:false,downloadComplete:false,downloadObject:""});
			});
		}

		else {
			alert("Please fill only one of the video/playlist link fields");
		}
	}
	onVideoLinkProvided(e:any) {
		this.setState({videoLinkString:e.target.value});
	}

	onPlaylistLinkProvided(e:any) {
		this.setState({playlistLinkString:e.target.value});
	}
	onNameStringProvided(e:any){
		this.setState({nameString:e.target.value});
	}
	onDownloadReset() {
		this.setState({downloading:false,downloadComplete:false,downloadObject:"",downloadError:false});
	}
	handleMediaSpaceButton() {
		this.setState({
			toggledMediaSpace:true
		});
	}
	handleEchoButton() {
		this.setState({
			toggledMediaSpace:false
		});
	}

	render() {
		return ( 
			<div id="css-root">
				<div id="button-div">
					<button onClick={this.handleMediaSpaceButton} style = { this.state.toggledMediaSpace ? orangeBackground : blueBackground}>
						Mediaspace 
					</button>
					<button onClick={this.handleEchoButton}  style= {this.state.toggledMediaSpace ? blueBackground: orangeBackground} >
						Echo360 
					</button>
				</div>
				<DownloadWindow className="downloadWindow" {...this.state} onFileChange={this.onFileChange} onFileUpload={this.onFileUpload} onPlaylistLinkProvided={this.onPlaylistLinkProvided} playlistLinkString={this.state.playlistLinkString} onVideoLinkProvided={this.onVideoLinkProvided} videoLinkString={this.state.videoLinkString} onDownloadReset={this.onDownloadReset} nameString = {this.state.nameString} onNameStringProvided={this.onNameStringProvided} /> 
			</div>
		);
	}
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(<App />);
