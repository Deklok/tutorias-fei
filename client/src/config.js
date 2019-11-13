import {dynamicWrapper} from 'react-router-guard';
import{checkTutor, checkPupil} from './auth';

const config = [
	{
		path: '/',
		redirect: '/login'
	},
	{
		path: '/tutor',
		component: dynamicWrapper(()=>import('./seguimiento/tutor/Dashboard')),
		canActivate: [checkTutor]
	},
	{
		path: '/pupil',
		component: dynamicWrapper(()=>import('./seguimiento/tutorado/DashboardTutorado')),
		canActivate: [checkPupil]
	}
]

export default config;