/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import { Text, PermissionsAndroid } from 'react-native';

import { NetworkInfo } from "react-native-network-info";
import ViewShot  from "react-native-view-shot";
import httpServer from 'react-native-http-bridge';

export default class App extends React.Component {
	constructor(props){
		super(props);

		this.state = {
			ip_address:"",
			uri:""
		}

		this.shot = React.createRef();
	}

	componentDidMount(){
		this.init();
	}

	async init(){
		try {
			await this.getIpAddress();
			await this.getPermission();
			this.startServer();
		} catch (ex) {
			console.log(ex);
		}
	}

	componentWillUnmount(){
		httpServer.stop();
	}

	async getPermission(){
		try{

			const { PERMISSIONS } = PermissionsAndroid;

			let granted = await PermissionsAndroid.requestMultiple([ 
				PERMISSIONS.READ_EXTERNAL_STORAGE, PERMISSIONS.WRITE_EXTERNAL_STORAGE ]);
			
			return granted;
		} catch(ex){
			console.warn(ex);
		}
	}

	async getIpAddress(){
		try{
			let ip_address = await NetworkInfo.getIPV4Address();
			this.setState({ip_address});
		}catch(ex){
			console.warn(ex);
		}
	}

	async capture(uri){
		try {
			this.state.uri = uri;
		} catch (err) {
		  	console.warn(err);
		}
	}

	async startServer(){
		try{
			httpServer.stop();
			httpServer.start(8080,'stream server',this.handleRequest.bind(this));
		}catch(err){
			console.warn(err);
		}
	}

	async handleRequest(request){
		let {uri} = this.state;

		// interpret the url
		let url = request.url;
		
		//Build our response object (you can specify status, mime_type (type), data, and response headers)
		let res = {
			status:"OK",
			type:"text/html",
			data:`<body style="margin:0;">
				<iframe id="iframe" src="/image" style="width:100%;height:100%;"></iframe>
				<script>
					window.setInterval(function() {
						reloadIFrame()
					}, 3000);
			
					function reloadIFrame() {
						console.log('reloading..');
						document.getElementById('iframe').contentWindow.location.reload();
					}
				</script>
			</body>`,
		};

		if(url == '/image')
			res = {
				status:"OK",
				type:"text/html",
				data:`<div style="width:100%;height:100%;display:flex;justifyContent:center;">
					<img style="margin:auto;width:100%;" src="${uri}"></img>
				</div>`,
			};
		
		httpServer.respond(request.requestId, 200, res.type, res.data);
	}

	render(){
		let { ip_address } = this.state;
		let { children, hideAddress } = this.props;

		return (<ViewShot onCapture={this.capture.bind(this)} options={{result:"data-uri"}} captureMode="update" {...this.props}>
				{!hideAddress && <Text style={{position:"absolute", top:0, right:0 }}>{ip_address}:8080</Text>}
				{children}
			</ViewShot>);
	}
} 