// Generated by CoffeeScript 1.8.0

/*
    This class sets up the HTML for the video player.

    Additional constructor parameters:
    - hasCaptions
    - hasPreview & previewRanges
    - initialVideoWidth (hard set video width for better rendering in AEL)
    - hasLoadingOverlay
    - videoFormat (default is mp4)
 */
window.Html5Player || (window.Html5Player = {});

window.Html5Player.HtmlBuilder = (function() {
  function HtmlBuilder($baseElement, videoStreams, hasChapters, hasSlides, isSingle, hasCaptions, hasPreview, previewRanges, initialVideoWidth, hasLoadingOverlay, format) {
    var audioFormat, bestAudio, bestVideo, duration, heightA, heightB, new_html, posterA, posterB, previewDuration, video, videoA, videoB, videoFormat, widthA, widthB, _i, _len, _ref, _ref1, _ref2;
    if (isSingle == null) {
      isSingle = false;
    }
    if (!isSingle) {
      if (videoStreams.left.url_hd) {
        videoA = videoStreams.left.url_hd;
      } else {
        videoA = videoStreams.left.url;
      }
      if (videoStreams.right.url_hd) {
        videoB = videoStreams.right.url_hd;
      } else {
        videoB = videoStreams.right.url;
      }
      posterA = videoStreams.left.poster;
      posterB = videoStreams.right.poster;
      widthA = videoStreams.left.width;
      widthB = videoStreams.right.width;
      heightA = videoStreams.left.height;
      heightB = videoStreams.right.height;
    } else {
      if (videoStreams.right.url_hd) {
        videoA = videoStreams.right.url_hd;
      } else if (videoStreams.right.url) {
        videoA = videoStreams.right.url;
      } else if (videoStreams.right.video && videoStreams.right.audio) {
        _ref = videoStreams.right.video, bestVideo = _ref[_ref.length - 1];
        _ref1 = videoStreams.right.audio, bestAudio = _ref1[_ref1.length - 1];
      }
      posterA = videoStreams.right.poster;
      widthA = videoStreams.right.width;
      heightA = videoStreams.right.height;
    }
    if (videoStreams && videoStreams.right && videoStreams.right.duration) {
      duration = this.durationToTime(videoStreams.right.duration);
    } else {
      duration = '';
    }
    if (hasPreview) {
      previewDuration = this.durationToTime(this.calcPreviewDuration(previewRanges));
    }
    if (format) {
      videoFormat = "video/" + format;
    } else {
      videoFormat = "video/mp4";
    }
    if (format) {
      audioFormat = "audio/" + format;
    } else {
      audioFormat = "audio/mp4";
    }
    if (initialVideoWidth != null) {
      new_html = "<div class=\"videoPlayer\" style=\"width: " + initialVideoWidth + "px;\">";
    } else {
      new_html = "<div class=\"videoPlayer\">";
    }
    if (videoStreams.right.video && videoStreams.right.audio) {
      new_html += "<div class=\"video a\">\n  <video poster=\"" + posterA + "\" data-format=\"" + bestVideo.format + "\" data-width=\"" + widthA + "\" data-height=\"" + heightA + "\" style=\"background: black;\">\n      <source src=\"" + bestVideo.url + "\" type=\"" + videoFormat + "\">\n  </video>\n  <audio data-format=\"" + bestAudio.format + "\" >\n      <source src=\"" + bestAudio.url + "\" type=\"" + audioFormat + "\">\n  </audio>\n</div>";
    } else {
      new_html += "<div class=\"video a\">\n    <video poster=\"" + posterA + "\" data-width=\"" + widthA + "\" data-height=\"" + heightA + "\" style=\"background: black;\">\n        <source src=\"" + videoA + "\" type=\"" + videoFormat + "\">\n    </video>\n</div>";
    }
    if (!isSingle) {
      new_html += "<div class=\"resizer\">\n    <i class=\"xikolo-icon icon-slide\"></i>\n</div>\n<div class=\"video b\">\n    <video poster=\"" + posterB + "\" data-width=\"" + widthB + "\" data-height=\"" + heightB + "\" style=\"background: black;\">\n        <source src=\"" + videoB + "\" type=\"" + videoFormat + "\">\n        <p>Fallback</p>\n    </video>\n</div>";
    }
    if (hasChapters) {
      new_html += "<div class=\"chapterContent\">\n    <div class=\"chapters\">\n        <ul>\n        </ul>\n    </div>\n</div>";
    }
    new_html += "<div class=\"clear\"></div>\n<div class=\"slidePreview\"><img src=\"\" />\n  <div class=\"arrow\"></div>\n</div>\n<div class=\"controlsContainer\">\n    <table class=\"controls\"><tr>\n        <td class=\"play button\">\n            <i class=\"xikolo-icon icon-play\"></i>\n        </td>\n        <td class=\"progressbar\">";
    if (hasSlides) {
      new_html += "<span class=\"slideContainer\"></span>";
    }
    new_html += "    <span class=\"progress\">\n        <span class=\"slider\"></span><span class=\"buffer\"></span>\n    </span>\n</td>\n<td class=\"control\">\n    <span class=\"currentTime\">0:00</span> / <span class=\"totalTime\">" + duration + "</span>\n</td>\n<td class=\"speed button\">\n    <span>1.0x</span>\n</td>";
    if (isSingle && videoStreams.right.url_hd || !isSingle) {
      new_html += "<td class=\"hd button\">\n    <i class=\"xikolo-icon icon-HD primary-color\"></i>\n</td>";
    }
    if (isSingle && (videoStreams.right.video != null) && videoStreams.right.video.length > 1) {
      new_html += "<td class=\"streamselection button\">\n  <i class=\"xikolo-icon icon-stream-selection\"></i>\n  <ul class=\"dropdown-menu\">";
      _ref2 = videoStreams.right.video.slice(0, -1);
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        video = _ref2[_i];
        new_html += "<li class=\"streamselectionentry\" data-videourl=\"" + video.url + "\"><span>" + video.label + "</span></li>";
      }
      new_html += "  <li class=\"streamselectionentry selected\" data-videourl=\"" + bestVideo.url + "\"><span>" + bestVideo.label + "</span></li>\n  </ul>\n</td>";
    }
    if (isSingle && hasCaptions) {
      new_html += "<td class=\"cc button\">\n    <i class=\"xikolo-icon icon-cc\"></i>\n</td>";
    }
    if (isSingle && hasPreview) {
      new_html += "<td class=\"preview button\">\n    <i class=\"xikolo-icon icon-preview\"></i><span>" + previewDuration + "</span>\n</td>";
    }
    if (hasChapters) {
      new_html += "<td class=\"toc button\">\n    <i class=\"xikolo-icon icon-list\"></i>\n</td>";
    }
    new_html += "            <td class=\"mute button\">\n                <i class=\"xikolo-icon icon-volume-on\"></i>\n            </td>\n            <td class=\"volumebar\">\n                <span class=\"volume\">\n                  <span class=\"slider\"></span>\n                </span>\n            </td>\n            <td class=\"fullscreen button\">\n                <i class=\"xikolo-icon icon-fullscreen-on\"></i>\n            </td>\n        </tr></table>\n    </div>\n</div>";
    if (hasLoadingOverlay) {
      new_html += "<div class=\"loadingOverlay\">\n  <i class=\"xikolo-icon icon-loading\"></i>\n  <div class=\"loadingText\">Loading</div>\n</div>";
    }
    $baseElement.html(new_html);
  }

  HtmlBuilder.prototype.durationToTime = function(duration) {
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

  HtmlBuilder.prototype.zeroPadInt = function(value) {
    if (value < 10) {
      value = "0" + value;
    }
    return value;
  };

  HtmlBuilder.prototype.calcPreviewDuration = function(previewRanges) {
    var previewDuration, range, _i, _len;
    previewDuration = 0;
    for (_i = 0, _len = previewRanges.length; _i < _len; _i++) {
      range = previewRanges[_i];
      previewDuration += range.end - range.start;
    }
    return previewDuration;
  };

  return HtmlBuilder;

})();

//# sourceMappingURL=html_builder.js.js.map
