package  {
	
	import flash.display.MovieClip;
	import fl.controls.Button;
	import fl.controls.Label;
	import flash.events.Event;
	import fl.events.ComponentEvent;
	
	import flash.events.MouseEvent;
	import fl.controls.TextInput;
	import fl.controls.TextArea;
	import flash.net.*;
	import flash.events.HTTPStatusEvent;
	import flash.events.SecurityErrorEvent;
	import flash.events.IOErrorEvent;
	import flash.system.Security;
	import fl.controls.ComboBox;
	import fl.data.DataProvider;
	

	public class MainView extends MovieClip {
		
		public var Button_send:Button;
		public var Label_version:TextInput;
		public var Text_errorlog:TextArea;
		public var Text_output:TextArea;
		public var Text_outputLog:TextArea;
		
		public var ComboBox_Input:ComboBox;
		
		private var jsonObj:Object = null;
		
		public function MainView() {
			// constructor code
			var jsonLoader:URLLoader = new URLLoader();
			jsonLoader.addEventListener(Event.COMPLETE, jsonLoaderComplete);
			jsonLoader.load(new URLRequest("cc.json"));
			
			this.addEventListener(Event.ADDED_TO_STAGE,enterFrameHandler);
		}


		protected function jsonLoaderComplete(event:Event):void
		{
			jsonObj = JSON.parse(event.target.data);
			getVersionList();
			//new Security
			//Security.loadPolicyFile("http://192.168.20.5:8080/crossdomain.xml");
		}
		public function enterFrameHandler(event:Event):void
		{
			Button_send.addEventListener(MouseEvent.CLICK,clickHandler);
		}
		public function clickHandler(event:MouseEvent):void
		{
			var obj = ComboBox_Input.selectedItem.label
			sendText(obj,Text_errorlog.text);
		}
		
		protected function getVersionList( ):void
		{	
			var request:URLRequest = new URLRequest();
				request.url = jsonObj.server + "/versionList";
				request.method = URLRequestMethod.GET; 

			var loader:URLLoader = new URLLoader();
				loader.dataFormat = URLLoaderDataFormat.TEXT;
				loader.addEventListener(Event.COMPLETE, loaderCompleteHandler);
				loader.addEventListener(HTTPStatusEvent.HTTP_STATUS, httpStatusHandler);
				loader.addEventListener(SecurityErrorEvent.SECURITY_ERROR, securityErrorHandler);
				loader.addEventListener(IOErrorEvent.IO_ERROR, ioErrorHandler);				
			try
			{
				loader.load(request);
			}
			catch (error:Error)
			{
				callLog("Unable to load URL");
			}
			 
			function loaderCompleteHandler(e:Event):void
			{
				var list:Array = JSON.parse(e.target.data) as Array;
				list.reverse();
				var dp:DataProvider = new DataProvider();
				for (var i:int = 0; i < list.length;i++)
				{
					dp.addItem({label:list[i]});
				}
				ComboBox_Input.dataProvider = dp;
				//ComboBox_Input.sortItemsOn("label", Array.NUMERIC);

			}
			function httpStatusHandler (e:Event):void
			{
				callLog("httpStatusHandler:" + e);
			}
			function securityErrorHandler (e:Event):void
			{
				callLog("securityErrorHandler:" + e);
			}
			function ioErrorHandler(e:Event):void
			{
				callLog("ioErrorHandler: " + e);
			}
		}
		
		protected function sendText(version:String,errorlog:String):void
		{
			Button_send.enabled = false;
			var requestVars:URLVariables = new URLVariables();
				requestVars.version = version;
				requestVars.errorlog = errorlog;
			 
			var request:URLRequest = new URLRequest();
				request.url = jsonObj.server;
				request.method = URLRequestMethod.GET; 
				request.data = requestVars;
			 
				for (var prop:String in requestVars) {
					trace("Sent " + prop + " as: " + requestVars[prop]);
				}
			var loader:URLLoader = new URLLoader();
				loader.dataFormat = URLLoaderDataFormat.TEXT;
				loader.addEventListener(Event.COMPLETE, loaderCompleteHandler);
				loader.addEventListener(HTTPStatusEvent.HTTP_STATUS, httpStatusHandler);
				loader.addEventListener(SecurityErrorEvent.SECURITY_ERROR, securityErrorHandler);
				loader.addEventListener(IOErrorEvent.IO_ERROR, ioErrorHandler);
			 
				
			try
			{
				loader.load(request);
			}
			catch (error:Error)
			{
				Button_send.enabled = true;
				callLog("Unable to load URL");
			}
			 
			function loaderCompleteHandler(e:Event):void
			{
				Text_output.htmlText = e.target.data;
				Button_send.enabled = true;
			}
			function httpStatusHandler (e:Event):void
			{
				callLog("httpStatusHandler:" + e);
			}
			function securityErrorHandler (e:Event):void
			{
				callLog("securityErrorHandler:" + e);
								Button_send.enabled = true;
			}
			function ioErrorHandler(e:Event):void
			{
				callLog("ioErrorHandler: " + e);
								Button_send.enabled = true;
			}
		}
		protected function callLog(str:String):void
		{
			Text_outputLog.text += str + "\n";
		}
		
	}
	
}
