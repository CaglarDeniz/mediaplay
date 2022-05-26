const uploadButtonStyle = {
	backgroundColor: "var(--uofiaccentblue)",
	color: "white",
	borderRadius: "5px",
	borderColor: "var(--uofiaccentblue)"
}

function EchoTab(props:any) {
	return (
	<div className={props.className}>
		<h1> Hi, you want to spin around in echo360?</h1>
		<ul>
			<input type="file" onChange={props.onFileChange} hidden id="echoInput"/>
		<li>	
			<label htmlFor="echoInput" style={{ textDecorationLine: "underline"}}>
				{props.selectedFile !== "" ? props.selectedFile.name : "Select a cookie file by clicking here"}
			</label>
		</li>
		<li>
			<label htmlFor="echoVideoLink">Input an Echo360 video link here</label>
			<input type="text" onChange={props.onVideoLinkProvided} value={props.videoLinkString} id="echoVideoLink"/>
		</li>
		<li>
			<label htmlFor="echoVideoLink">Input an Echo360 playlist link here</label>
			<input type="text" onChange={props.onPlaylistLinkProvided} value={props.playlistLinkString} id="echoPlaylistLink"/>
		</li>
		<li>
			<button style={uploadButtonStyle}
			onClick={props.onFileUpload}>
				Download!
			</button>
		</li>
		</ul>
	</div>
	);
}

export default EchoTab;
