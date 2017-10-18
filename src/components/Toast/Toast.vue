<template>
	<div class="Toast">

	
		<transition :name="MaskAnimate">
			<div class="mask" v-if="isMask" @click="MaskClick"></div>
		</transition>
			
		<transition :name="ToastAnimate" v-on:after-leave="afterLeave">

			<div class="content" v-show="visible">

				<div class="toast" v-if="type == 1">
					<div class="model-title" v-if="title">{{title}}</div>
				</div>

				<div class="alert model" v-if="type == 2">
					<div class="model-title">{{title}}</div>
					<div class="model-btn">
						<div class="Tapbtn submit" @click="CloseToast">{{BindBtn}}</div>
					</div>
				</div>

				<div class="confirm model" v-if="type == 3">
					<div class="model-title">{{title}}</div>
					<div class="model-btn">
						<div class="Tapbtn" :class="item.class" v-for="(item,index) in BindBtn" @click="CloseToast(index)">{{item.title}}</div>
					</div>
				</div>

				<div class="select model-select" v-if="type == 4">
					<div class="model-title">{{title}}</div>
					<div class="model-btn">
						<div class="Tapbtn" :class="item.class" v-for="(item,index) in BindBtn" @click="CloseToast(index)">{{item.title}}</div>
					</div>
				</div>

				<div class="loading" v-if="type == 5">
					<div class="model-img" v-if="img">
						<img :src="img">
					</div>
					<div class="model-img model-html" v-html="imgHtml" v-if="imgHtml"></div>
					<div class="model-title" v-if="title">{{title}}</div>
				</div>

			</div>

		</transition>

	</div>
</template>

<script type="text/javascript">

/*

option.ButtonArray -> ButtonArray(String,Array)

option.Type -> 1 : Toast -> Title,ToastType,[Time]
			   2 : Alert -> Title,[ButtonArray(String,Array)]
			   3 : Confirm -> Title,[BUttonArray(Array)]
			   4 : Select -> Title,ButtonArray(Array)
			   5 : Loading -> Title,toasttype

option.ToastAnimate,
option.MaskAnimate -> Fade,FadeIn,Bounce,Zoom
					  Toast Default: Fade
					  Mask Default: null

option.Callback -> Funtion(res) res: ButtonArray对应数组下标

*/
import ImgConfig from './Toast_img_config.js'
	
export default{
	data(){
		return {
			isMask:false,
			visible:false,
			BindBtn: [],
			img:'',
			imgHtml:'',
			type:  1,
			toasttype: 'loading',
			title: '',
			ButtonArray:[],
			time: -1,
			ToastAnimate:'Fade',
			MaskAnimate: '',
			callback: null,
		}
	},
	mounted(){
		if(this.type != 1 && this.type != 5) this.isMask = true;

		this.HandleType();
		this.ToastTimeOut();
	},
	methods:{
		ToastTimeOut(){
			let time = this.time;
			let type = this.type;
			if(typeof time != 'number') time = parseInt(time);

			if(time == 0 || (type == 1 && time == 0) || ( type == 5 && time == 0 )) return;
			//Default time
			time = 1500;
			setTimeout(()=>{
				this.CloseToast();
			},time)
		},
		HandleType(){
			let type = parseInt(this.type);

			if(type == 1) return;
			if(type == 5) {
				this.HandleImg();
				return;
			}

			//Confirm Button Default
			let DefaultBtn = [{title:'取消',class:'cancel'},{title:'确定',class: 'submit'}]
			let handlearray = this.ButtonArray; 

			//处理数组
			if(handlearray instanceof Array){

				if(handlearray.length == 0){
					if(type == 2){
						this.BindBtn = '确定';
						return;
					}else if(type == 3){
						this.BindBtn = DefaultBtn;
					}else{
						console.warn('"ButtonArray":Can not be empty');
						return;
					}
				}

				for(let item of handlearray){
					let Temp = new Object();
					if(typeof item == 'object'){
						Temp.title = item.title || '';
						Temp.class = item.class || '';
					}else{
						Temp.title = item || '';
						Temp.class = '';
					}
					this.BindBtn.push(Temp);
				}
			}else if(handlearray instanceof String){
				//处理空格连接的字符串
				handlearray = handlearray.split(' ');
				if(handlearray.length == 1){
					this.BindBtn = handlearray[0]
				}
			}
		},
		HandleImg(){
			let img_path = ImgConfig[this.toasttype]

			let PhotoType = ['jpg','jpeg','png','gif'];
			let isPhoto = PhotoType.indexOf(img_path.split('.').pop().toLowerCase());
			if(isPhoto != -1){
				this.img = '<img src="'+require('./asset/'+ img_path)+'">' ;
			}else{
				this.imgHtml = img_path
			}
			
		},
		MaskClick(){
			this.visible = false;
		},
		destroyEl(){
			// Destroy El
        	this.$el.remove();
			this.$destroy(true);
		},
		CloseToast(key){
			let callback = this.callback;
			key = typeof key == 'object' ? 0 : key;
			if(callback && typeof callback == 'function'){
				callback(key);
			}
          	this.visible = false;
		},
		afterLeave(el){
          	this.isMask = false;
			this.destroyEl();
		}
	}
}

</script>

<style type="text/css" src="./Toast.css"></style>