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
import utilities from '../../../utilities'

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

  cookies = Cookies();
  token = utilities.splitCookie(this.cookies.get('token')).token;
  role = utilities.splitCookie(this.cookies.get('token')).session;

  getLastTutorship() {

    const id = utilities.splitCookie(this.cookies.get('token')).id;
    return axios.post('http://localhost:5000/api/db/lastTutorship', {
      idTutor: id
    }, {
      headers: {Authorization: this.token + ";" + this.role}
    });

  }

  getBlocks(idTutorship) {
    return axios.post('http://localhost:5000/api/db/blocks', {
      idTutorship: idTutorship
    });
  }

  saveBlock = (block) => {
    const idTutorship = this.state.tutorship;
    return axios.post('http://localhost:5000/api/db/addBlock', {
      idCareer: block.idCareer,
      start: block.start,
      end: block.end,
      idTutorship: idTutorship
    }, {
      headers: {Authorization: this.token + ";" + this.role}
    });
  }

  editBlock = (block) => {
    return axios.post('http://localhost:5000/api/db/editBlock', {
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

      } else {
        this.saveBlock(block)
      }
    });
  }

  render() {

    const classes = this.props.classes;
    const registryBlockClasses = this.props.registryBlockClasses;

    return (
      <div>
        <Schedule open={this.state.openDialog} closeAction={this.closeSchedule} />
        <AppBar position="static" className={clsx(classes.appBar, classes.appBarShift)}>
          <Toolbar className={classes.toolbar}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              className={classes.menuButton}
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
    this.getLastTutorship().then(result => {
      console.log(result)
      var idTutorship = result.data[0].idTutorship;
      this.getBlocks(idTutorship).then(result2 => {
        console.log(result2)
        const blocks = result2.data;
        console.log(blocks);
        this.setState({ blocks: blocks, loadBlocks: false, tutorship: idTutorship, registeredBlocks: blocks });
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