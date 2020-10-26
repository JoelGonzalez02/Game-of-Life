import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    allignItems: 'center',
    justifyItems: 'center',
    width: '430px',
    position: 'absolute',
    backgroundColor: 'lightgrey',
    border: '2px solid #000',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    borderRadius: '10px'
  },
}));

// theme.palette.background.paper

function AboutModal() {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <h2 className='modalH2'id="simple-modal-title">Rules for the Game of Life</h2>
      <p id="simple-modal-description">
        &#9632; In the Game of Life, these rules examine each cell of the grid. For each cell, it counts that cell's eight neighbors (up, down, left, right, and diagonals), and then act on that result.
<p>
    &#9632; If the cell is alive and has 2 or 3 neighbors, then it remains alive. Else it dies.
  <br/>
  <br/>
    &#9632; If the cell is dead and has exactly 3 neighbors, then it comes to life. Else if remains dead.</p>


    &#9632; From those two rules, many types of "creatures" can be created that move around the "landscape".
      </p>
    </div>
  );

  return (
    <div>
      <button type="button" onClick={handleOpen}>
        About
      </button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
    </div>
  );
}

export default AboutModal;