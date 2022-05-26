const uploadButtonStyle = {
	backgroundColor: "var(--uofiaccentblue)",
	color: "white",
	borderRadius: "5px",
	borderColor: "var(--uofiaccentblue)"
}
function MediaPlayTab(props:any) {
		return ( 
		<div className={props.className}>
			<h1>Hi, you want to download some mediaspace content?</h1>
			<ul>
			<input type="file" onChange={props.onFileChange} hidden id="mediaInput"/>
			<li>
				<label htmlFor="mediaInput" style={{textDecorationLine:"underline"}}> 
					{props.selectedFile !== "" ? props.selectedFile.name : "Select a cookie file by clicking here"}
				</label>
			</li>
			<li>
				<label htmlFor="mediaVideoName"> Input a name for your video or playlist folder here </label> 
				<input type="text" onChange={props.onNameStringProvided} value={props.nameString} id="mediaVideoName"/>
			</li>
			<li>
				<label htmlFor="mediaVideoLink"> Input a Mediaspace video link here </label> 
				<input type="text" onChange={props.onVideoLinkProvided} value={props.videoLinkString} id="mediaVideoLink"/>
			</li>
			<li>
				<label htmlFor="mediaPlaylistLink"> Input a Mediaspace playlist link here </label> 
				<input type="text" onChange={props.onPlaylistLinkProvided} value={props.playlistLinkString} id="mediaPlaylistLink"/>
			</li>
			<li>
				<button style={uploadButtonStyle} onClick={props.onFileUpload}>
					Download!
				</button>
			</li>
			</ul>
		</div>
		);
}


export default MediaPlayTab;
