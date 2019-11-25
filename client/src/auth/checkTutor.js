import axios from 'axios';

const checkTutor = () => {
	return new Promise((resolve, reject)=>{
		var token = sessionStorage.getItem('token');
		if(token != undefined){
			if(token == 'true'){
				resolve(true);
			}else{
				reject(false);
			}
		}else{
			reject('undefined');
		}
	});
}

export default checkTutor;