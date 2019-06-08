<template>
  <v-container>
    <canvas ref="my-canvas" width="1500" height="400"></canvas>
  </v-container>
</template>

<script>
const axios = require ('axios')
const obelisk = require("obelisk.js");
const Moment = require("moment");
const MomentRange = require("moment-range");
const moment = MomentRange.extendMoment(Moment);
export default {
  data: () => ({
    size: 10,   
  }),
  props: ['charData'],
  watch: { 
      	charData: function(newVal, oldVal) { // watch it
          this.render()
        }
  },

  mounted() {
    //this.render()
  },
  methods: {
  

    render() {
     
      var canvas = this.$refs["my-canvas"];
      var point = new obelisk.Point(70, 70);
      var pixelView = new obelisk.PixelView(canvas, point);
      let firstDay = moment(this.charData[0].dateTime, "YYYY-MM-DD").day();
     

      for (let [i, data] of this.charData.entries()) {
        let color = new obelisk.CubeColor().getByHorizontalColor(0xebedf0);
        let dimension = new obelisk.CubeDimension(this.size, this.size, 3);

        let x = Math.floor((i + firstDay) / 7);
        let y = (i + firstDay) % 7;
        if (data.projects.length>0 ) {
          let dayZ = 0
          for (let project of data.projects){
           let colorString = project.color.replace('#','')
           colorString = "0x" + colorString;
           colorString =parseInt(colorString , 16)

          dimension = new obelisk.CubeDimension(
            this.size,
            this.size,
            project.count * 5
          );
          color = new obelisk.CubeColor().getByHorizontalColor(
            colorString
          );
          let cube = new obelisk.Cube(dimension, color, false);
          let p3d = new obelisk.Point3D(this.size * x, this.size * y, dayZ);
          pixelView.renderObject(cube, p3d);
          dayZ += project.count * 5
          }
        } else {
          let cube = new obelisk.Cube(dimension, color, false);
          let p3d = new obelisk.Point3D(this.size * x, this.size * y, 0);
          pixelView.renderObject(cube, p3d);
          
        }
        //console.log(i)
      }
    },

    
  }
};
</script>

<style>
</style>
