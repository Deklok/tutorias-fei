import React, { memo, Component, useState } from 'react';
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

const cookies = new Cookies();

const BlocksRegistry = memo(props => {
  const defaultBlock = {
    idBlock: 1,
    idCareer: 1,
    start: '09:00',
    end: '10:00'
  }
  const [blocks, setBlocks] = React.useState([]);
  const [blockCount, setBlockCount] = React.useState(1);
  const [editingBlock, setEditingBlock] = React.useState(defaultBlock);
  const [tutorship, setTutorship] = React.useState(0);
  const [registeredBlocks, setRegisteredBlocks] = React.useState([]);

  var token = utilities.splitCookie(cookies.get('token')).token;
  var role = utilities.splitCookie(cookies.get('token')).session;
  var username = utilities.splitCookie(cookies.get('token')).id;
  var route = process.env.REACT_APP_API_SERVER;

  async function getPersonnelNumTutor() {
    return axios.post(process.env.REACT_APP_API_SERVER + 'api/db/getpersonnelNumTutor', {
      username: username
    }, {
        headers: { Authorization: token + ";" + role }
      });
  }

  async function getLastTutorship(personnelNum) {
    return axios.post(process.env.REACT_APP_API_SERVER + 'api/db/lastTutorship', {
      idTutor: personnelNum
    }, {
        headers: { Authorization: token + ";" + role }
      });
  }

  async function getBlocks(idTutorship, idCareer) {
    return axios.post(process.env.REACT_APP_API_SERVER + 'api/db/getBlock', {
      idCareer: idCareer,
      idTutorship: idTutorship
    });
  }

  async function saveBlock(block) {
    const idTutorship = tutorship;
    return axios.post(process.env.REACT_APP_API_SERVER + 'api/db/addBlock', {
      idCareer: block.idCareer,
      start: block.start,
      end: block.end,
      idTutorship: idTutorship
    }, {
        headers: { Authorization: token + ";" + role }
      });
  }

  async function editBlock(block) {
    return axios.post(process.env.REACT_APP_API_SERVER + 'api/db/updateBlock', {
      idBlock: block.idBlock,
      idCareer: block.idCareer,
      start: block.start,
      end: block.end
    }, {
        headers: { Authorization: token + ";" + role }
      });
  }

  async function saveBlocks() {
    const actualBlocks = blocks;
    const registerBlocks = registeredBlocks;
    actualBlocks.forEach(block => {
      var isRegistered = false;
      registerBlocks.forEach(registeredBlock => {
        if (block.idBlock === registeredBlock.idBlock) {
          isRegistered = true
        }
      })

      if (isRegistered) {
        editBlock(block)
      } else {
        saveBlock(block)
      }
    });
    notifyPublishedDay();
  }

  async function notifyPublishedDay() {
    axios.post(route + 'api/notify/student/publishedday', {
      user: username
    }, {
        headers: { Authorization: token + ";" + role }
      });
  }

  const closeSchedule = (e) => {
    setEditingBlock(defaultBlock);
    getPersonnelNumTutor().then(result => {
      var personnelNum = result.data[0]['personnelNum'];
      getLastTutorship(personnelNum).then(tutorship => {
        console.log(tutorship)
        var idTutorship = tutorship.data[0].idTutorship;
        getBlocks(idTutorship, 5).then(result2 => {
          console.log(result2)
          const blocks = result2.data;
          console.log(blocks);
          setBlocks(blocks);
          setTutorship(idTutorship);
          setRegisteredBlocks(blocks);
        });
      });
    });
    setOpenDialog(false);
  }

  const addBlock = (career, startTime, endTime) => {
    const actualBlocks = blocks;
    var count = blockCount;

    const block = {
      idBlock: count++,
      idCareer: career,
      start: startTime,
      end: endTime
    }

    actualBlocks.push(block)
    setBlocks(actualBlocks);
    setBlockCount(count);
  }

  const loadToEditBlock = (blockId) => {
    const blocksAux = blocks;
    var actualBlocks = [];
    blocksAux.forEach(block => {
      if (block.idBlock == blockId) {
        setEditingBlock(block);
      } else {
        actualBlocks.push(block);
      }
    });
    setBlocks(actualBlocks);
  }

  const deleteBlock = (blockId) => {
    const actualBlocks = blocks;
    var newBlocks = [];
    actualBlocks.forEach(block => {
      if (block.idBlock != blockId) {
        newBlocks.push(block);
      }
    });
    setBlocks(newBlocks);
  }

  const changeEditingBlock = (block) => {
    setEditingBlock(block);
    console.log(editingBlock);
    console.log(block);
  }

  const globalClasses = props.classes
  const classes = props.registryBlockClasses;

  return (
    <div>
      <Schedule closeAction={closeSchedule} />
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
          <Button color="inherit" component="a" onClick={saveBlocks}>Continuar</Button>
        </Toolbar>
      </AppBar>
      <div>
        <AddBox blocks={blocks}
          editingBlock={editingBlock}
          classes={classes}
          addBlock={addBlock}
          onChange={changeEditingBlock}>
        </AddBox>
      </div>
      <div className={classes.blockList}>
        <BlockList classes={classes}
          blocks={blocks}
          editBlock={loadToEditBlock}
          deleteBlock={deleteBlock} />
      </div>
    </div>
  );
});

export default BlocksRegistry;