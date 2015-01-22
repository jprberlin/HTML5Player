library videoPlayer;
import 'package:polymer/polymer.dart';
import 'video-stream.dart';
import 'video-controlbar.dart';
import 'dart:html';
import 'dart:async';

@CustomTag('video-player')
class VideoPlayer extends PolymerElement {
  
  //published attributes
  @published int time = 0;
  @published int duration = 0;
  @published double speed = 1.0;
  @published String quality;
  @published int volume = 80;
  @published bool autoplay = false;
  
  //states
  String playPauseState = "pause";
  
  //referenced elements
  ElementList<VideoStream> videoStreamList;
  VideoControlBar videoControlBar;

  @observable
  VideoPlayer.created() : super.created() { }
  
  @override
  void attached() {
    videoStreamList = this.querySelectorAll("video-stream");
    videoControlBar = this.shadowRoot.querySelector("video-controlbar");
    
    this.querySelector("video-stream:last-child").setAttribute("flex", "");
    
    videoStreamList.forEach(
        (stream) => stream..resize()
    );
    
    new Timer.periodic(const Duration(milliseconds: 500), (timer) {
        videoControlBar.progress = videoStreamList[0].getCurrentTime();
    });
  }
  
  void play([Event e]){
    videoStreamList.forEach(
        (stream) => stream.play()
    );
    playPauseState = "play";
  }
  
  void pause([Event e]){
    videoStreamList.forEach(
        (stream) => stream.pause()
    );
    playPauseState = "pause";
  }
  
  void togglePlayPause([Event e]){
    if(playPauseState=="pause"){
      play();
      videoControlBar.updatePlayPauseButton("av:pause");
    }
    else if(playPauseState=="play"){
      pause();
      videoControlBar.updatePlayPauseButton("av:play-arrow");
    }
  }
  
  void setCurrentTime([Event e]){
    videoStreamList.forEach(
      (stream) => stream.setCurrentTime((e as CustomEvent).detail)
    );
  }
  
  void volumeChanged(){
    videoStreamList.forEach(
      (stream) => stream.setVolume(volume)
    );
  }
  
  void speedChanged() {
    videoControlBar.speed = speed;
    videoStreamList.forEach(
      (stream) => stream.setSpeed(speed)
    );
  }
  
  void toggleSpeed([Event e]){
    if(speed == 1.0){
      speed = 1.3;
    }
    else if(speed == 1.3){
      speed = 1.7;
    }
    else if(speed == 1.7){
      speed = 0.7;
    }
    else {
      speed = 1.0;
    }
  }
  
}

