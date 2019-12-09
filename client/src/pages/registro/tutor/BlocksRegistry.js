import React, { Component, useState } from 'react';
import './blockregistry.css';
import clsx from 'clsx';
import axios from 'axios';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import AddBox from './components/AddBox'
import BlockList from './components/BlockList';
import { Button } from '@material-ui/core';
import Schedule from './components/Schedule';
import Cookies from 'universal-cookie';
import utilities from '../../../utilities';

export default class BlocksRegistry extends Component {

  state = {
    blocks: [],
    blockCount: 2,
    editingBlock: {
      idBlock: 0,
      idCareer: 1,
      start: '09:00',
      end: '10:00'
    },
    openDialog: true,
    hasEditedBlocks: false,
    tutorship: 0,
    registeredBlocks: []
  };

  cookies = new Cookies();
  token = utilities.splitCookie(this.cookies.get('token')).token;
  role = utilities.splitCookie(this.cookies.get('token')).session;
  username = utilities.splitCookie(this.cookies.get('token')).id;
  
  getPersonnelNumTutor(){
    return axios.post(process.env.REACT_APP_API_SERVER + 'api/db/getpersonnelNumTutor',{
      username: this.username
    },{
      headers: { Authorization: this.token + ";" + this.role }
    });
  }

  getLastTutorship(personnelNum) {
    return axios.post(process.env.REACT_APP_API_SERVER + 'api/db/lastTutorship', {
      idTutor: personnelNum
    }, {
      headers: {Authorization: this.token + ";" + this.role}
    });
  }

  getBlocks(idTutorship, idCareer) {
    return axios.post(process.env.REACT_APP_API_SERVER + 'api/db/getBlock', {
      idCareer: idCareer,
      idTutorship: idTutorship
    });
  }

  saveBlock = (block) => {
    const idTutorship = this.state.tutorship;
    return axios.post(process.env.REACT_APP_API_SERVER + 'api/db/addBlock', {
      idCareer: block.idCareer,
      start: block.start,
      end: block.end,
      idTutorship: idTutorship
    }, {
      headers: {Authorization: this.token + ";" + this.role}
    });
  }

  editBlock = (block) => {
    return axios.post(process.env.REACT_APP_API_SERVER + 'api/db/updateBlock', {
      idBlock: block.idBlock,
      idCareer: block.idCareer,
      start: block.start,
      end: block.end
    }, {
      headers: {Authorization: this.token + ";" + this.role}
    });
  }

  saveBlocks = () => {
    const blocks = this.state.blocks;
    const registeredBlocks = this.state.registeredBlocks;
    blocks.forEach(block => {
      var isRegistered = false;
      registeredBlocks.forEach(registeredBlock => {
        if (block.idBlock === registeredBlock.idBlock) {
          isRegistered = true
        }
      })

      if (isRegistered) {
        this.editBlock(block)
      } else {
        this.saveBlock(block)
      }
    });
    this.notifyPublishedDay();
  }
  notifyPublishedDay = () => {
    axios.post(process.env.REACT_APP_API_SERVER + 'api/notify/student/publishedday', {
        user: this.username
      },{
        headers: { Authorization: this.token + ";" + this.role }
    });
  }

  render() {

    const globalClasses = this.props.classes
    const classes = this.props.registryBlockClasses;

    return (
      <div>
        <Schedule open={this.state.openDialog} closeAction={this.closeSchedule} />
        <AppBar position="static" className={clsx(globalClasses.appBar, globalClasses.appBarShift)}>
          <Toolbar className={globalClasses.toolbar}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              className={globalClasses.menuButton}
            >
              <ArrowBackIosIcon />
            </IconButton>
            <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
              Registro de bloques
                      </Typography>
            <Button color="inherit" component="a" onClick={this.saveBlocks}>Continuar</Button>
          </Toolbar>
        </AppBar>
        <div>
          <AddBox blocks={this.state.blocks}
            editingBlock={this.state.editingBlock}
            classes={classes}
            addBlock={this.addBlock}
            onChange={this.changeEditingBlock}>
          </AddBox>
        </div>
        <div className={classes.blockList}>
          <BlockList classes={classes}
            blocks={this.state.blocks}
            editBlock={this.editBlock}
            deleteBlock={this.deleteBlock} />
        </div>
      </div>
    );
  }

  closeSchedule = (e) => {
    this.getPersonnelNumTutor().then(result => {
      var personnelNum = result.data[0]['personnelNum'];
      this.getLastTutorship(personnelNum).then(tutorship => {
        console.log(tutorship)
        var idTutorship = tutorship.data[0].idTutorship;
        this.getBlocks(idTutorship, 5).then(result2 => {
          console.log(result2)
          const blocks = result2.data;
          console.log(blocks);
          this.setState({ blocks: blocks, loadBlocks: false, tutorship: idTutorship, registeredBlocks: blocks });
        });
      });
    });
    this.setState({ openDialog: false });
  }

  addBlock = (career, startTime, endTime) => {
    const actualBlocks = this.state.blocks;
    var count = this.state.blockCount;

    const block = {
      idBlock: count,
      idCareer: career,
      start: startTime,
      end: endTime
    }

    actualBlocks.push(block)
    this.setState({ blocks: actualBlocks, blockCount: count });
  }

  editBlock = (blockId) => {
    const blocks = this.state.blocks;
    var actualBlocks = [];
    blocks.forEach(block => {
      if (block.idBlock == blockId) {
        this.setState({ editingBlock: block });
      } else {
        actualBlocks.push(block);
      }
    });
    this.setState({ blocks: actualBlocks });
  }

  deleteBlock = (blockId) => {
    const blocks = this.state.blocks;
    var newBlocks = [];
    blocks.forEach(block => {
      if (block.idBlock != blockId) {
        newBlocks.push(block);
      }
    });
    this.setState({ blocks: newBlocks });
  }

  changeEditingBlock = (block) => {
    this.setState({ editingBlock: block })
  }
}