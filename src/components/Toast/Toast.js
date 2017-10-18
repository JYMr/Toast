/*
	Author:JY.Mr
	Version:0.0.3(2017/10/12)
*/
import Vue from 'vue';
let ToastContent = Vue.extend(require('./Toast.vue'));

let content;

let Toast = {
	show:function(option){ 
		option = option || {};

		if (typeof option === 'string') {
			option = {
				Toast: option
			};
		}

		if(content) DestroyNow(content);

		content = new ToastContent({
			data : option
		})

		content.vm = content.$mount();
		document.body.appendChild(content.vm.$el);
		content.vm.visible = true;
	}
}

Toast.close = function(){
	if(!content){
		console.warn('Toast not Init');
		return;
	}
	content.vm.visible = false;
}

const DestroyNow = (content) => {
	content.vm.$el.remove();
	content.$destroy(true);
	content = null;
}

export default Toast