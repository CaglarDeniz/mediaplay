import MediaPlayTab from './MediaPlayTab'
import EchoTab from './EchoTab'
import React from 'react'


const uploadButtonStyle = {
	backgroundColor: "var(--uofiaccentblue)",
	color: "white",
	borderRadius: "5px",
	borderColor: "var(--uofiaccentblue)"
}

const animationArray = [".","..","..."];

type downloadWaitProps = {
	className:string
	downloadObject:string
}
type downloadWaitState = {
	downloadAnimationString:string,
	downloadAnimationTimer:number,
	downloadAnimationHandlerID:any
}

export class DownloadWait extends React.Component<downloadWaitProps,downloadWaitState>{
	constructor(props:any){
		super(props);
		this.state = {downloadAnimationString:".",downloadAnimationTimer:0,downloadAnimationHandlerID:undefined};

		this.advanceDownloadAnimation = this.advanceDownloadAnimation.bind(this);
	}
	advanceDownloadAnimation(){
		this.setState((state:downloadWaitState,props:downloadWaitProps) => {
			return {
			downloadAnimationString:animationArray[(state.downloadAnimationTimer + 1) % animationArray.length], 
			downloadAnimationTimer: (state.downloadAnimationTimer + 1) % 3}
		});
	}
	componentDidMount(){
		const handlerID = setInterval(this.advanceDownloadAnimation,1000);
		this.setState({downloadAnimationHandlerID:handlerID});
	}
	componentWillUnmount(){
		clearInterval(this.state.downloadAnimationHandlerID);
		this.setState({downloadAnimationHandlerID:undefined});
	}
	render() { 
		return <h2> Downloading your {this.props.downloadObject} {this.state.downloadAnimationString}</h2>
	};
}

export function DownloadReset(props:any){
	return (
		<div>
			<h2>Your download has been completed. Hit the button below to download another video/playlist</h2>
			<button style={uploadButtonStyle} onClick={props.onDownloadReset}> Reset the downloader by clicking here! </button>
		</div>
	);
}
export function DownloadError(props:any){

	return (
	<div>
		<h2> Your download has encountered an error. Please make sure that you've submitted the correct cookies file and a valid mediaspace link </h2>
		<button style={uploadButtonStyle} onClick={props.onDownloadReset}> Reset the downloader by clicking here! </button>
	</div>
	);
}
export function DownloadSelection(props:any) {

	if(props.toggledMediaSpace === true) {
		return <MediaPlayTab {...props}/> ; 
	}
	else {
		return <EchoTab {...props}/> ; 
	}
}

export function DownloadWindow(props:any){
	
	if (props.downloadError === true) {
		return <DownloadError className={props.className} onDownloadReset={props.onDownloadReset} />;
	}
	else if (props.downloading === true) {
		return <DownloadWait className={props.className} downloadObject={props.downloadObject}/> ; 
	}

	else if (props.downloading === false && props.downloadComplete === true) {
		return <DownloadReset className={props.className} onDownloadReset={props.onDownloadReset} /> ; 
	}

	else {
		return <DownloadSelection {...props} /> ; 
	}

}
