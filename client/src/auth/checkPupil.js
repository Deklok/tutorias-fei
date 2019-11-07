import axios from 'axios';

const checkPupil = () => {
	return new Promise((resolve, reject)=>{
		axios.post('http://localhost:5000/api/auth',{
			withCredentials: true;
		})
		.then((result)=>{
			if(!result){
				resolve(true);
			}else{
				reject(false);
			}
		})
		.catch((err)=>{
			if(err.status == 404){
				reject(false);
			}else{
				reject(err);
			}
		});
	});
}

export default checkPupil;