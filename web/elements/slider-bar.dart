library sliderBar;
import 'package:polymer/polymer.dart';
import 'dart:html';
import 'package:paper_elements/paper_progress.dart';

@CustomTag('slider-bar')

class SliderBar extends PolymerElement{
  
  //published attributes
  @published int max = 1;
  @published int value = 0;
  @published int secondValue = 0;
  
  //referenced elements
  PaperProgress paperProgress;
  
  @observable
  SliderBar.created() : super.created() { }
  
  @override
  void attached() {
    super.attached();
    paperProgress = this.shadowRoot.querySelector('paper-progress');
  }
  
  void clicked(Event e, var details, Node target){
    MouseEvent m = (e as MouseEvent);
    value = (paperProgress.max * m.offset.x / getPaperProgressWidth()).floor();
  }
  
  double getPaperProgressWidth(){
    return double.parse(paperProgress.getComputedStyle().width.replaceFirst('px', ''));
  }
}