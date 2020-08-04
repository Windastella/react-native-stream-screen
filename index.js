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
import httpServer from 'react-native-http-server';

export default class App extends React.Component {
	constructor(props){
		super(props);

		this.state = {
			ip_address:"",
			uri:""
		}

		this.shot = React.createRef();
	}

	async componentDidMount(){
		await this.getIpAddress();
		await this.getPermission();
		this.startServer();
		this.interval = setInterval(this.capture.bind(this), 1000);
	}

	componentWillUnmount(){
		httpServer.stop();
		clearInterval(this.interval);
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

	async capture(){
		try {
			let uri = await this.shot.current.capture();
			this.state.uri = uri;
		} catch (err) {
		  	console.warn(err);
		}
	}

	async startServer(){
		try{
			await httpServer.stop();
			httpServer.init({host:"0.0.0.0", port:8080},this.handleRequest.bind(this));
			let args = await httpServer.start();
		}catch(ex){
			console.warn(err);
		}
	}

	async handleRequest(request, send){
		let {uri} = this.state;

		// interpret the url
		let url = request.url;
		
		//Build our response object (you can specify status, mime_type (type), data, and response headers)
		let res = {
			status:"OK",
			type:"text/html",
			data:`<iframe id="iframe" src="/image" style="width:100%;height:100%;"></iframe>
			<script>
				window.setInterval(function() {
					reloadIFrame()
				}, 3000);
		
				function reloadIFrame() {
					console.log('reloading..');
					document.getElementById('iframe').contentWindow.location.reload();
				}
			</script>`,
		};

		if(url == '/image')
			res = {
				status:"OK",
				type:"text/html",
				data:`<div style="width:100%;height:100%;display:flex;justifyContent:center;">
					<img style="margin:auto;height:100%;" src="${uri}"></img>
				</div>`,
			};
		
		send(res);
	}

	render(){
		let { ip_address } = this.state;
		let { children, hideAddress } = this.props;

		return (<ViewShot ref={this.shot} options={{result:"data-uri"}} {...this.props}>
				{!hideAddress && <Text style={{position:"absolute", top:0, right:0 }}>{ip_address}:8080</Text>}
				{children}
			</ViewShot>);
	}
} 