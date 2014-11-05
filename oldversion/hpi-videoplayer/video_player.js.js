// Generated by CoffeeScript 1.8.0

/*
    This is the main class for the video player.
    It is in charge of:
    - public interface to control video player
    - syncing between the 2 videos
    - bootstrapping the whole player
 */
window.Html5Player || (window.Html5Player = {});

window.Html5Player.VideoPlayer = (function() {
  function VideoPlayer($baseElement, videoData) {
    var builder, chaptersContainer;
    this.$baseElement = $baseElement;
    this.videoData = videoData;
    this.hasChapters = this.videoData.chapters != null;
    this.hasSlides = this.videoData.thumbnails != null;
    this.isSingle = this.checkSingle();
    this.hasCaptions = this.videoData.captions != null;
    this.hasLoadingOverlay = this.videoData.hasLoadingOverlay;
    this.hasPreview = this.videoData.previewRanges != null;
    this.hasTaggingActive = this.videoData.taggingActive;
    this.hasCustomPreview = this.videoData.hasCustomPreview;
    if (this.videoData.handleKeyboardEvents != null) {
      this.handleKeyboardEvents = this.videoData.handleKeyboardEvents;
    } else {
      this.handleKeyboardEvents = true;
    }
    builder = new Html5Player.HtmlBuilder(this.$baseElement, this.videoData.streams, this.hasChapters, this.hasSlides, this.isSingle, this.hasCaptions, this.hasPreview, this.videoData.previewRanges, this.videoData.initialVideoWidth, this.hasLoadingOverlay, this.videoData.format);
    this.videoA = this.$baseElement.find('.a video')[0];
    this.audioA = this.$baseElement.find('.a audio')[0];
    if (this.videoA && this.audioA) {
      this.mediaController = new MediaController();
      this.videoA.controller = this.mediaController;
      this.audioA.controller = this.mediaController;
    }
    if (!this.isSingle) {
      this.videoB = this.$baseElement.find('.b video')[0];
    }
    this.ui = new Html5Player.UserInterface(this, this.$baseElement);
    this.controls = new Html5Player.Controls(this, this.$baseElement);
    this.cuePoints = new Html5Player.CuePoints(this, this.$baseElement);
    this.captions = new Html5Player.Captions(this, this.$baseElement);
    this.mostWatched = new Html5Player.MostWatched(this, this.$baseElement);
    this.history = new Html5Player.History(this);
    if (this.hasSlides) {
      this.slideViewer = new Html5Player.SlideViewer(this, this.$baseElement, this.videoData.thumbnails);
    }
    if (this.hasChapters) {
      chaptersContainer = this.$baseElement.find('.chapters ul');
      this.chapters = new Html5Player.Chapters(this, this.videoData.chapters, chaptersContainer);
    }
    if (this.hasLoadingOverlay) {
      this.loadingOverlay = new Html5Player.LoadingOverlay(this, this.$baseElement);
    }
    if (this.hasPreview) {
      this.preview = new Html5Player.Preview(this, this.$baseElement, this.videoData.previewRanges);
    }
    if (this.hasTaggingActive) {
      this.tagging = new Html5Player.Tagging(this, this.$baseElement);
    }
    if (this.hasCustomPreview) {
      this.customPreview = new Html5Player.CustomPreview(this, this.$baseElement);
    }
    this.playbackRate = 1.0;
    this.volume = 1.0;
    this.muted = false;
    this.hd = true;
    this.sourceChanged = false;
    this.playingState = false;
    this.playerInitiated = false;
    this.loadCount = 0;
    this.dostuff_after_videos_load = true;
    this.cc = false;
    this.mostWatchedShown = false;
    this.previewShown = false;
    this.customPreviewIsShown = false;
    if (this.hasCaptions) {
      this.captions.updateCaptions(this.videoData.captions);
    }
    $(window).on("videosReady", (function(_this) {
      return function() {
        var preseek;
        if (_this.playerInitiated === false) {
          _this.playerInitiated = true;
          return _this.initPlayer();
        } else {
          if (_this.dostuff_after_videos_load) {
            _this.dostuff_after_videos_load = false;
            preseek = parseInt(window.location.hash.substring(1));
            if (!isNaN(preseek)) {
              return _this.gototime(preseek);
            }
          } else {
            return _this.play;
          }
        }
      };
    })(this));
    $(window).on("ready", (function(_this) {
      return function() {
        return _this.ui.resizePlayer(true);
      };
    })(this));
    $(this.videoA).on("canplay", (function(_this) {
      return function() {
        _this.loadCount++;
        _this.attachEventHandlers();
      };
    })(this));
    if (!this.isSingle) {
      $(this.videoB).on("canplay", (function(_this) {
        return function() {
          _this.loadCount++;
          _this.attachEventHandlers();
        };
      })(this));
    }
    if (this.videoA.readyState >= this.videoA.HAVE_FUTURE_DATA) {
      $(this.videoA).trigger("canplay");
    }
    if (!this.isSingle && this.videoB.readyState >= this.videoB.HAVE_FUTURE_DATA) {
      $(this.videoB).trigger("canplay");
    }
  }

  VideoPlayer.prototype.initPlayer = function() {
    var preseek;
    this.$baseElement.find(".totalTime").text(this.durationToTime(this.videoA.duration));
    this.ui.aRatio = $(this.videoA).height() / $(this.videoA).width();
    if (!this.isSingle) {
      this.ui.bRatio = $(this.videoB).height() / $(this.videoB).width();
    }
    this.ui.resizePlayer(true);
    preseek = parseInt(window.location.hash.substring(1));
    if (!isNaN(preseek)) {
      this.gototime(preseek);
    }
    if (this.hasSlides && !this.sourceChanged) {
      this.slideViewer.buildSlidePreview();
    }
    if (this.hasChapters && !this.sourceChanged) {
      this.chapters.generateChapterList();
    }
    if (!this.isSingle) {
      this.syncVideo();
    }
    if (this.playingState) {
      return this.play();
    }
  };

  VideoPlayer.prototype.play = function() {
    if (this.mediaController) {
      return this.mediaController.play();
    } else {
      return this.videoA.play();
    }
  };

  VideoPlayer.prototype.pause = function() {
    if (this.mediaController) {
      return this.mediaController.pause();
    } else {
      return this.videoA.pause();
    }
  };

  VideoPlayer.prototype.togglePlay = function() {
    if (this.mediaController) {
      if (this.mediaController.paused) {
        return this.play();
      } else {
        return this.pause();
      }
    } else {
      if (this.videoA.paused) {
        return this.play();
      } else {
        return this.pause();
      }
    }
  };

  VideoPlayer.prototype.gototime = function(time) {
    var error;
    if (this.previewShown && !this.preview.seekTimeInPreviewRange(time)) {
      this.controls.$previewButton.click();
    }
    if (this.customPreviewIsShown && !this.customPreview.seekTimeInPreviewRange(time)) {
      this.customPreview.stop();
    }
    if (this.mediaController) {
      try {
        if (this.mediaController.playbackState === "playing") {
          this.history.handlePause(this.videoA.currentTime);
          this.mediaController.currentTime = time;
          this.history.handlePlay(this.videoA.currentTime);
        } else {
          this.mediaController.currentTime = time;
          if (this.mediaController.playbackState === "waiting" && !this.mediaController.paused) {
            this.history.handlePlay(videoA.currentTime);
          }
        }
      } catch (_error) {
        error = _error;
      }
      try {
        this.play();
      } catch (_error) {
        error = _error;
      }
    } else {
      try {
        if (!this.videoA.paused) {
          this.history.handlePause(this.videoA.currentTime);
          this.videoA.currentTime = time;
          this.history.handlePlay(this.videoA.currentTime);
        } else {
          this.videoA.currentTime = time;
          history.handlePlay(this.videoA.currentTime);
        }
      } catch (_error) {
        error = _error;
      }
      try {
        this.play();
      } catch (_error) {
        error = _error;
      }
    }
    return false;
  };

  VideoPlayer.prototype.seekForward = function(seconds) {
    if (this.mediaController) {
      return this.mediaController.currentTime += seconds;
    } else {
      return this.videoA.currentTime += seconds;
    }
  };

  VideoPlayer.prototype.seekBack = function(seconds) {
    if (this.mediaController) {
      return this.mediaController.currentTime -= seconds;
    } else {
      return this.videoA.currentTime -= seconds;
    }
  };

  VideoPlayer.prototype.changeSpeed = function(speed) {
    this.playbackRate = speed;
    if (this.mediaController) {
      return this.mediaController.playbackRate = speed;
    } else {
      this.videoA.playbackRate = speed;
      if (!this.isSingle) {
        return this.videoB.playbackRate = speed;
      }
    }
  };

  VideoPlayer.prototype.mute = function(bool) {
    this.muted = bool;
    if (this.mediaController) {
      return this.mediaController.muted = bool;
    } else {
      return this.videoA.muted = bool;
    }
  };

  VideoPlayer.prototype.currentTime = function() {
    return this.videoA.currentTime;
  };

  VideoPlayer.prototype.videoState = function() {
    if (this.mediaController) {
      if (this.mediaController.paused) {
        return "paused";
      } else {
        return "playing";
      }
    } else {
      if (this.videoA.paused) {
        return "paused";
      } else {
        return "playing";
      }
    }
  };

  VideoPlayer.prototype.changeSource = function(streamUrl) {
    var currenttime;
    if (!isNaN(this.videoA.currentTime)) {
      currenttime = parseInt(this.videoA.currentTime);
    }
    if (!isNaN(this.videoA.currentTime)) {
      window.location.hash = "#" + parseInt(this.videoA.currentTime);
    }
    this.loadCount = 0;
    this.sourceChanged = true;
    this.playingState = !this.videoA.paused;
    this.dostuff_after_videos_load = true;
    if ((streamUrl != null) && this.isSingle) {
      this.videoA.src = streamUrl;
    } else {
      if (this.hd) {
        if (!this.isSingle) {
          if (this.videoData.streams.left.url_hd) {
            this.videoA.src = this.videoData.streams.left.url_hd;
          }
          if (this.videoData.streams.right.url_hd) {
            this.videoB.src = this.videoData.streams.right.url_hd;
          }
        } else {
          if (this.videoData.streams.right.url_hd) {
            this.videoA.src = this.videoData.streams.right.url_hd;
          }
        }
      } else {
        if (!this.isSingle) {
          this.videoA.src = this.videoData.streams.left.url;
          this.videoB.src = this.videoData.streams.right.url;
        } else {
          this.videoA.src = this.videoData.streams.right.url;
        }
      }
    }
    if (this.videoA.readyState >= this.videoA.HAVE_FUTURE_DATA) {
      $(this.videoA).trigger("canplay");
    }
    if (!this.isSingle && this.videoB.readyState >= this.videoB.HAVE_FUTURE_DATA) {
      return $(this.videoB).trigger("canplay");
    }
  };

  VideoPlayer.prototype.updateCuePoints = function(cuePoints) {
    if (this.hasLoadingOverlay) {
      this.loadingOverlay.$overlay.hide();
    }
    return this.cuePoints.updateCuePoints(cuePoints);
  };

  VideoPlayer.prototype.setCaptionsVisibility = function(visibility) {
    return this.captions.setCaptionsVisibility(visibility);
  };

  VideoPlayer.prototype.updateMostWatched = function(mostWatchedSections) {
    this.controls.addMostWatchedButton();
    return this.mostWatched.updateMostWatched(mostWatchedSections);
  };

  VideoPlayer.prototype.startCustomPreview = function(start, end) {
    if (this.hasLoadingOverlay) {
      this.loadingOverlay.$overlay.hide();
    }
    return this.customPreview.show(start, end);
  };

  VideoPlayer.prototype.durationToTime = function(duration) {
    var hours, minutes, seconds, time;
    seconds = Math.floor(duration);
    minutes = Math.floor(seconds / 60);
    hours = Math.floor(seconds / 3600);
    seconds = seconds % 60;
    minutes = minutes % 60;
    if (hours > 0) {
      time = hours + ":" + this.zeroPadInt(minutes);
    } else {
      time = minutes;
    }
    return time += ":" + this.zeroPadInt(seconds);
  };

  VideoPlayer.prototype.zeroPadInt = function(value) {
    if (value < 10) {
      value = "0" + value;
    }
    return value;
  };

  VideoPlayer.prototype.attachEventHandlers = function() {
    var events;
    if (!this.isSingle && this.loadCount === 2) {
      events = ["play", "pause", "timeupdate", "seeking"];
      events.forEach((function(_this) {
        return function(evt) {
          return $(_this.videoA).on(evt, function() {
            if (evt === "seeking" && Math.abs(_this.videoB.currentTime - _this.videoA.currentTime) > 1) {
              if (_this.videoA.currentTime) {
                _this.videoB.currentTime = _this.videoA.currentTime;
              }
            }
            if (evt === "play") {
              if (_this.videoA.currentTime) {
                _this.videoB.play(_this.videoA.currentTime);
              }
            }
            if (evt === "pause") {
              _this.videoB.pause();
            }
            if (evt === "ratechange") {
              return _this.videoB.playbackRate = _this.playbackRate;
            }
          });
        };
      })(this));
      $(window).trigger("videosReady");
    }
    if (this.isSingle && this.loadCount > 0) {
      $(window).trigger("videosReady");
    }
  };

  VideoPlayer.prototype.syncVideo = function() {
    var error;
    if (Math.abs(this.videoB.currentTime - this.videoA.currentTime) > 1) {
      try {
        if (this.videoA.currentTime) {
          this.videoB.currentTime = this.videoA.currentTime;
        }
      } catch (_error) {
        error = _error;
      }
    }
    if (this.hasChapters) {
      if (this.videoB.currentTime) {
        this.chapters.setActiveChapter(this.videoB.currentTime);
      }
    }
    return setTimeout(((function(_this) {
      return function() {
        return _this.syncVideo();
      };
    })(this)), 1000);
  };

  VideoPlayer.prototype.checkSingle = function() {
    if (this.videoData.streams.left && this.videoData.streams.left.url && this.videoData.streams.right && this.videoData.streams.right.url) {
      return false;
    }
    return true;
  };

  return VideoPlayer;

})();

//# sourceMappingURL=video_player.js.js.map
