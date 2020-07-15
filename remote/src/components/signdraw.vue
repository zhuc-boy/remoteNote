<template>
    <div class="fengbu">
        <div class="screen" ref="screen">
            <div ref="zrenders" id="zrenders" style="width: max-content;"></div>
            <div class="ins" v-show="showinput" :style="{top:i_top+'px',left:i_left+'px',width:i_width,color:color,fontsize:fontsize*6+'px'}">
                <textarea v-model="inputvalue" type="text" @blur="inputblur" />
                </div>
        </div>
        <div class="tool">
            <input  class="imgupload" type="file" accept="image/*" multiple="" @change="getpic">
            <button @click="reset">重置</button>
            <button @click="back">撤回</button>
            线条粗细：
            <select v-model="fontsize">
                <option value="1">细</option>
                <option value="3">中</option>
                <option value="5">粗</option>
            </select>
            线条颜色：
            <select v-model="color">
                <option value="#ff0000">红</option>
                <option value="#00ffff">蓝</option>
                <option value="#00ff00">绿</option>
                <option value="#ffff00">黄</option>
                <option value="#000000">黑</option>
                <option value="#ffffff">白</option>
                <!-- <option value="">透明</option> -->
            </select>
            形状：
            <select v-model="shapemode">
                <option value="pen">笔</option>
                <option value="rect">矩形框</option>
                <option value="ellipse">椭圆框</option>
                <option value="arrow">箭头</option>
            </select>
            文本输入：
            <select v-model="txtmodel">
                <option value="false">否</option>
                <option value="true">是</option>
            </select>
            <button @click="paintpic">导出图片</button>
        </div>
    </div>
</template>

<script>
//import imgsrc from './img.json'
import zrender from 'zrender'
import { myMixin } from './mixFunc'
export default {
    mixins: [myMixin],
    name: 's_d',
    //props: ['percent', 'canvaswidth'],
    data() {
        return {

        }
    },
    created() {
        //console.log(document.body.clientWidth, document.body.clientHeight)
        this.width = document.body.clientWidth
        this.height = document.body.clientHeight
    },
    mounted() {
        // this.$socket.emit('connect', 1)
        this.zr = zrender.init(document.getElementById('zrenders'), {
            renderer: 'canvas',
            width: this.width,
            height: this.height
        });

        this.zr.add(this.changfangxing)
        this.zr.add(this.tuoyuan)
        this.zr.add(this.zhexian)
        //this.zr.add(this.wenben)
        this.zr.add(this.cfxg)
        this.cfxg.dirty()
        this.zr.add(this.g)
        this.zr.add(this.bgi)
        this.zr.add(this.arrow)
        this.$refs.zrenders.addEventListener('mousedown', this.part1)
        this.$refs.zrenders.addEventListener('mousemove', this.part2)
        this.$refs.zrenders.addEventListener('mouseup', this.part3)
    },
    sockets: {
        sendchangfangxing: function (data) {
            let temprect = new zrender.Rect({
                draggable: true,
                shape: {
                    x: data.x,
                    y: data.y,
                    width: data.width,
                    height: data.height
                },
                style: {
                    lineWidth: data.font,
                    fill: null,
                    stroke: data.color,
                    //opacity: 0.5
                },
                cursor: 'move'
            })
            //console.log('temprect:' + temprect.id)
            temprect.on("mousedown", () => {
                this.$refs.zrenders.removeEventListener('mousedown', this.part1)
                this.$refs.zrenders.removeEventListener('mousemove', this.part2)
                this.$refs.zrenders.removeEventListener('mouseup', this.part3)
                this.downflag = false
            })
            temprect.on("mouseup", () => {
                this.$refs.zrenders.addEventListener('mousedown', this.part1)
                this.$refs.zrenders.addEventListener('mousemove', this.part2)
                this.$refs.zrenders.addEventListener('mouseup', this.part3)
            })
            this.shapeid.push(temprect)
            this.g.add(temprect)
        },
        sendtuoyuan: function (data) {
            let tempellipse = new zrender.Ellipse({
                draggable: true,
                shape: {
                    x: data.cx,
                    y: data.y,
                    width: data.width,
                    height: data.height
                },
                style: {
                    lineWidth: data.font,
                    fill: null,
                    stroke: data.color,
                    //opacity: 0.5
                },
                cursor: 'move'
            })
            //console.log('temprect:' + temprect.id)
            tempellipse.on("mousedown", () => {
                this.$refs.zrenders.removeEventListener('mousedown', this.part1)
                this.$refs.zrenders.removeEventListener('mousemove', this.part2)
                this.$refs.zrenders.removeEventListener('mouseup', this.part3)
                this.downflag = false
            })
            tempellipse.on("mouseup", () => {
                this.$refs.zrenders.addEventListener('mousedown', this.part1)
                this.$refs.zrenders.addEventListener('mousemove', this.part2)
                this.$refs.zrenders.addEventListener('mouseup', this.part3)
            })
            this.shapeid.push(tempellipse)
            this.g.add(tempellipse)
        },
        sendpath: function (data) {
            let templine = new zrender.Polyline({
                draggable: true,
                shape: {
                    points: JSON.parse(data.points)
                },
                style: {
                    lineWidth: data.lineWidth,
                    stroke: data.stroke,
                    //opacity: 0.5
                },
                cursor: 'move'
            })
            //console.log('temprect:' + temprect.id)
            templine.on("mousedown", () => {
                this.$refs.zrenders.removeEventListener('mousedown', this.part1)
                this.$refs.zrenders.removeEventListener('mousemove', this.part2)
                this.$refs.zrenders.removeEventListener('mouseup', this.part3)
                this.downflag = false
            })
            templine.on("mouseup", () => {
                this.$refs.zrenders.addEventListener('mousedown', this.part1)
                this.$refs.zrenders.addEventListener('mousemove', this.part2)
                this.$refs.zrenders.addEventListener('mouseup', this.part3)
            })
            this.shapeid.push(templine)
            this.g.add(templine)
        },
        sendword: function (data) {
            let wenben = new zrender.Text({
                draggable: true,
                cursor: 'move',
                position: JSON.parse(data.position),
                style: {
                    text: data.text,
                    fontSize: '14',
                    fontWeight: '1000',
                    fill: '#00ff00',
                    textFill: data.textFill
                }
            })
            wenben.on("mousedown", () => {
                this.$refs.zrenders.removeEventListener('mousedown', this.part1)
                this.$refs.zrenders.removeEventListener('mousemove', this.part2)
                this.$refs.zrenders.removeEventListener('mouseup', this.part3)
                this.downflag = false
            })
            wenben.on("mouseup", () => {
                this.$refs.zrenders.addEventListener('mousedown', this.part1)
                this.$refs.zrenders.addEventListener('mousemove', this.part2)
                this.$refs.zrenders.addEventListener('mouseup', this.part3)
            })
            this.shapeid.push(wenben)
            this.g.add(wenben)
        },
        sendimg: function (data) {
            this.imgsrc = data.imgsrc;
            let img = new Image();
            img.src = this.imgsrc;
            img.onload = () => {
                let w = img.width;
                let h = img.height;
                if (this.width / this.height > w / h) {
                    this.bgi.attr({
                        zlevel: -1,
                        style: {
                            image: this.imgsrc,
                            x: (this.width - w * this.height / h) / 2,
                            y: 0,
                            width: w * this.height / h,
                            height: this.height,

                        },
                        //cursor: 'wait',
                    })
                } else {
                    this.bgi.attr({
                        zlevel: -1,
                        style: {
                            image: this.imgsrc,
                            x: 0,
                            y: (this.height - h * this.width / w) / 2,
                            width: this.width,
                            height: h * this.width / w,

                        },
                        //cursor: 'wait',
                    })
                }
            }
        },
        sendarrow: function (data) {
            let arrow = new zrender.Polyline({
                draggable: true,
                shape: {
                    points: data.points,
                    smooth: 0.1
                },
                style: {
                    lineWidth: data.lineWidth,
                    stroke: data.stroke,
                },
                cursor: 'move'
            })
            arrow.on("mousedown", () => {
                this.$refs.zrenders.removeEventListener('mousedown', this.part1)
                this.$refs.zrenders.removeEventListener('mousemove', this.part2)
                this.$refs.zrenders.removeEventListener('mouseup', this.part3)
                this.downflag = false
            })
            arrow.on("mouseup", () => {
                this.$refs.zrenders.addEventListener('mousedown', this.part1)
                this.$refs.zrenders.addEventListener('mousemove', this.part2)
                this.$refs.zrenders.addEventListener('mouseup', this.part3)
            })
            this.shapeid.push(arrow)
            this.g.add(arrow)
        }
    },
    methods: {

    },
}
</script>

<style lang='less'>
.ins {
    display: inline-block;
    position: fixed;
    textarea {
        border: none;
        outline: none;
        -webkit-appearance: none;
        padding: 5px;
        background-color: rgba(100, 100, 100, 0.3);
        color: inherit;
        font-size: inherit;
    }
}
.fengbu {
    display: flex;
    .screen {
        width: calc(100% - 90px);
        //flex-basis: auto;
    }
    .tool {
        z-index: 10000;
        width: 90px;
        //flex-basis: 90px;
        display: flex;
        flex-direction: column;
        .imgupload_1 {
            position: absolute;
            z-index: 1;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: 0;
            -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
            &::before {
                height: 32px;
                content: "添加图片";
                position: absolute;
                top: 50%;
                left: 50%;
                -webkit-transform: translate(-50%, -50%);
                transform: translate(-50%, -50%);
                background-color: #a3a3a3;
            }
        }
    }
}
</style>
