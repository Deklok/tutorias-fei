import axios from 'axios';

const checkPupil = () => {
	return new Promise((resolve, reject)=>{
		var token = sessionStorage.getItem('token');
		if(token != undefined){
			if(token == 'false'){
				resolve(true);
			}else{
				reject(false);
			}
		}else{
			reject('undefined');
		}
	});
}

export default checkPupil;