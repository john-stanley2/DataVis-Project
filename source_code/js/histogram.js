class Histogram {
    constructor(main_data, genre_data, histogram_div, globalApplicationState){

        //**********************************************************************************************
        //                                  CONSTANTS FOR CHART SIZE
        //**********************************************************************************************
  
        this.TOTAL_WIDTH = 900
        this.TOTAL_HEIGHT = 500
        this.MARGIN_BOTTOM = 50
        this.MARGIN_TOP = 10
        this.MARGIN_LEFT = 10
        this.MARGIN_RIGHT = 50

        this.PUSH_AXIS_RIGHT = 50
        this.PUSH_X_DOWN = 40 

        this.GENRE_LINE_OPACITY = .9
        this.GENRE_LINE_STROKE_WIDTH = 2

        this.MAIN_LINE_OPACITY = .25
        this.MAIN_LINE_STROKE_WIDTH = 1.5
       
        this.ANIMATION_DURATION = 8
    }

}
