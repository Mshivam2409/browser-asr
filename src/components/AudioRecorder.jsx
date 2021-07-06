import AudioAnalyser from "react-audio-analyser";
import React from "react";

import Button from "@material-ui/core/Button";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import PauseIcon from "@material-ui/icons/Pause";
import StopIcon from "@material-ui/icons/Stop";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { useRecoilState } from "recoil";
import { AUDIO_BLOB } from "../store";
import "../styles/AudioRecorder.css";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
  buttons: {
    display: "flex",
    justifyContent: "flex-start",
    marginBottom: theme.spacing(3),
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
  },
  wrapIcon: {
    verticalAlign: "middle",
    display: "inline-flex",
  },
}));

const Recorder = (props) => {
  const [status, setStatus] = React.useState("");
  const [audioSrc, setAudioSrc] = React.useState(null);
  const [duration, setDuration] = React.useState(0);
  const [placeholder, setPlaceholder] = React.useState("0");
  const [audio, setAudio] = useRecoilState(AUDIO_BLOB);
  const controlAudio = (status) => {
    setStatus(status);
  };

  React.useEffect(() => {
    if (duration > 180) {
      controlAudio("inactive");
    }
    if (Math.floor((duration % 60) / 10) > 0) {
      setPlaceholder("");
    } else {
      setPlaceholder("0");
    }
  }, [duration]);

  const classes = useStyles();
  const audioProps = {
    audioType: "audio/wav",
    // audioOptions: { sampleRate: 3000 },
    status,
    audioSrc,
    timeslice: 1000, // timeslice（https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder/start#Parameters）
    startCallback: (e) => {
      console.log("start", e);
    },
    pauseCallback: (e) => {
      console.log("pause", e);
    },
    stopCallback: (e) => {
      setAudioSrc(window.URL.createObjectURL(e));
      setAudio(e);
      console.log("Duration", duration);
      setDuration(0);
      console.log("stop", e);
    },
    onRecordCallback: (e) => {
      console.log("recording", e);
      setDuration(duration + 1);
    },
    errorCallback: (err) => {
      console.log("error", err);
    },
  };

  const submit = async () => {
    const formdata = new FormData();
    formdata.append("audio", audio);
    formdata.append("qid", props.qid);
    const config = {
      headers: { 'content-type': 'multipart/form-data' }
    }
    const response = await axios.post("https://api.quizzr.shivammalhotra.dev/upload", formdata, config)
      .then(response => {
          console.log(response);
      })
      .catch(error => {
          console.log(error);
      });
  };
  return (
    <div class="cntr">
      <div class="recording-transcript-box">
        {props.transcript}
      </div>


      <AudioAnalyser
        {...audioProps}
        width={
          window.innerWidth > 991
            ? window.innerWidth * 0.35
            : window.innerWidth * 0.75
        }
        backgroundColor="#FFFFFF"
        strokeColor="#000000"
        class="audio-analyzer"
      ></AudioAnalyser>


      <div className={classes.buttons} class="btn-wrapper">

        {status !== "recording" && (
          <Button
            onClick={() => controlAudio("recording")}
            startIcon={<PlayArrowIcon />}
            variant="contained"
            color="primary"
            className={classes.button}
          >
            {duration === 0
              ? "START "
              : "RESUME " +
                Math.floor(duration / 60) +
                ":" +
                placeholder +
                (duration % 60)}
          </Button>
        )}

        {status === "recording" && (
          <Button
            onClick={() => controlAudio("paused")}
            startIcon={<PauseIcon />}
            variant="contained"
            color="secondary"
            className={classes.button}
          >
            {"REC " +
              Math.floor(duration / 60) +
              ":" +
              placeholder +
              (duration % 60)}
          </Button>
        )}

        <Button
          onClick={() => controlAudio("inactive")}
          startIcon={<StopIcon />}
          variant="contained"
          color="primary"
          className={classes.button}
        >
          STOP
        </Button>

        {status === "inactive" && (
          <Button
            onClick={submit}
            startIcon={<StopIcon />}
            variant="contained"
            color="primary"
            className={classes.button}
          >
            SUBMIT
          </Button>
        )}
      </div>
      <div>
        <Typography color="textSecondary" className={classes.wrapIcon}>
          <InfoOutlinedIcon
            color="textSecondary"
            style={{ marginRight: "2px" }}
          />
          Maximum duration: 3 minutes.
        </Typography>
      </div>
    </div>
  );
};

export default Recorder;
