	var ws = new WebSocket("ws://47.106.142.49:8183/chat/websocket");
	console.log(ws)
	
	ws.onopen = function(){
		console.log("连接服务成功")
	}
	
	ws.onmessage = function(data){
		//这里后面就是把消息拼接到聊天框ul里面
		var ul = document.getElementById("cu");
		console.log("服务端给我数据了")
		console.log(data.data)
		//一开始，我要先判断，这个服务端传给我的数据，是普通字符串？json字符串？
		if(isJsonStr(data.data)){
			//为 true 说明是json字符串
			var obj = JSON.parse(data.data);
			console.log("服务端给我的是特殊消息 --> json字符串，数据已转换为对象：")
			console.log(obj.type)
			if(obj.type == '163music'){
				//服务端告诉客户端，这个消息是网易云音乐的消息模板
				ul.innerHTML += "<li role='bot' class='music'><p>"+obj.songName+"</p><img src='"+obj.songPic+"'><a target='_blank' href='"+obj.url+"'>点击我播放</a></li>";
			}
			
			
		}else{
			//为 false 说不是json字符串，是普通文本
			ul.innerHTML += "  <li role='bot'> " + data.data + " </li>   ";
		}
		
		//让页面自动滚到最底部
		sTo();
		
	}
	
	ws.onerror = function(data){
		console.log("出现异常")
		console.log(data)
	}
	
	ws.onclose = function(){
		console.log("服务器已关闭")
	}



	//鼠标点击发送按钮触发的
	var btn = document.getElementById("sendBtn");
	btn.onclick = function(){
		sendContent()
	
	}
	
	//监听按下回车键触发的
	var input = document.getElementById("sendInput");
	input.onkeydown = function(e){
		console.log("按下了键盘，键盘码是：" + e.keyCode)
		if(e.keyCode == 13){
			sendContent()
		}
	}
		
	
	//自定义一个方法函数
	function sTo(){
		var h = document.body.scrollHeight;
		window.scrollTo(0,h)
	}
	
	
	//发送内容的方法
	function sendContent(){
		//第一步,获取输入框的内容
		var input = document.getElementById("sendInput");
		//console.log(input.value)
		//第二步,把内容拼接到ul聊天框里面,生成li标签模板代码 <li role='me'> 你好 </li>
		var ul = document.getElementById("cu");
		// a = a + 1 -->  a += 1;
		ul.innerHTML += "  <li role='me'> " + input.value + " </li>   ";
		
		//第三步,把信息发给服务端
		ws.send(input.value);
		
		//发完内容顺便把输入框的值清空
		input.value = "";
		
		//第四步,让页面自动滚到最底部
		sTo();
	}
	
	
	function isJsonStr(str){
		if(typeof str == 'string'){
			//先确保这个参数是字符串类型
			try{
				var obj = JSON.parse(str);
				if(typeof obj == 'object'){
					return true;
				}
			}catch{
				return false;
			}
		}
		
		return false;
	}