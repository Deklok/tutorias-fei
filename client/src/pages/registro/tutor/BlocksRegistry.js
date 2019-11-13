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
import Schedule from './components/Schedule';
import Container from '@material-ui/core/Container';

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
    const registryBlockClasses = this.props.registryBlockClasses;

    return (
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
        <Schedule />
        <div>
          <AddBox blocks={this.state.blocks}
                  editingBlock={this.state.editingBlock}
                  classes={registryBlockClasses}
                  addBlock={this.addBlock}
                  onChange={this.changeEditingBlock}>
          </AddBox>
        </div>
        <div className={registryBlockClasses.blockList}>
          <BlockList classes={registryBlockClasses}
                      blocks={this.state.blocks}
                      editBlock={this.editBlock}
                      deleteBlock={this.deleteBlock}/>
        </div>
      </Container>
      </main>
    );
  }

  closeSchedule = (e) => {

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
      if(block.blockId == blockId){
        this.setState({editingBlock: block});
      }
    });
  }

  deleteBlock = (blockId) => {
    const blocks = this.state.blocks;
    var newBlocks = [];
    blocks.forEach(block => {
      if(block.blockId != blockId){
        newBlocks.push(block);
      }
    });
    this.setState({blocks: newBlocks});
  }

  changeEditingBlock = (block) => {
    this.setState({editingBlock: block})
  }
}