import React, { memo } from 'react';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import clsx from 'clsx';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import { mainListItems, secondaryListItems } from '../DashboardOptions';

const SideBar = memo(props=>{
	const open = props.open;
	const classes = props.classes;

	return (
		<Drawer
	        variant="permanent"
	        classes={{
	          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
	        }}
	        open={open}
	      >
	        <div className={classes.toolbarIcon}>
	          <IconButton onClick={props.handleDrawerClose}>
	            <ChevronLeftIcon />
	          </IconButton>
	        </div>
	        <Divider />
	        <List>{mainListItems}</List>
	        <Divider />
	        <List>{secondaryListItems}</List>
	    </Drawer>
	);
});

export default SideBar;