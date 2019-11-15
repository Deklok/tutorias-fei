import React, { Component, useState } from 'react';
import './blockregistry.css';
import clsx from 'clsx';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import AddBox from './components/AddBox'
import BlockList from './components/BlockList';
import { Button } from '@material-ui/core';

export default class BlocksRegistry extends Component {

  state = {
    blocks: [
      {
        blockId: 1,
        careerId: "Ingeniería de Software",
        start: "07:30",
        end: "08:30"
      }
    ],
    blockCount: 2,
    editingBlock: {
      blockId: 2,
      careerId: "Ingeniería de Software",
      start: "07:30",
      end: "07:30"
    }
  };

  render() {

    const classes = this.props.classes;

    return (
      <div>
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
            <Button color="inherit" component="a" href="/tutor">Continuar</Button>
          </Toolbar>
        </AppBar>
        <div>
          <AddBox blocks={this.state.blocks}
                  editingBlock={this.state.editingBlock}
                  classes={classes}
                  addBlock={this.addBlock}>
          </AddBox>
        </div>
        <div className={classes.blockList}>
          <BlockList classes={classes}
                      blocks={this.state.blocks}
                      editBlock={this.editBlock}
                      deleteBlock={this.editBlock}/>
        </div>
      </div>
    );
  }

  addBlock = (career, startTime, endTime) => {
    const actualBlocks = this.state.blocks;
    var count = this.state.blockCount;

    const block = {
      blockId: count,
      careerId: career,
      start: startTime,
      end: endTime
    }

    actualBlocks.push(block)
    this.setState({blocks: actualBlocks, blockCount: count});
  }

  editBlock = (blockId) => {
    const blocks = this.state.blocks;
    blocks.forEach(block => {
      if(blocks.blockId == blockId){
        this.setState({editingBlock: block});
      }
    });
  }

  deleteBlock = (blockId) => {
    const blocks = this.state.blocks;
    var newBlocks = [];
    blocks.forEach(block => {
      if(blocks.blockId != blockId){
        newBlocks.push(block);
      }
    });
    this.setState({blocks: newBlocks});
  }
}