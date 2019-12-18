<template>
    <div class="fengbu">
        <div class="screen" ref="screen">
            <div ref="zrenders" id="zrenders" style="width: max-content;"></div>
            <div class="ins" v-show="showinput" :style="{top:i_top+'px',left:i_left+'px',width:i_width}">
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
export default {
    name: 's_d',
    //props: ['percent', 'canvaswidth'],
    data() {
        return {
            width: 0,
            height: 0,
            track_tempe: [],
            tempguiji: [],
            imgsrc: '',
            //imgbase: '',
            //imgurl: 'http://dmimg.5054399.com/allimg/pkm/pk/22.jpg',
            downflag: false,
            shapemode: 'rect',
            fontsize: 3,
            color: '#000000',
            txtmodel: 'false',
            showinput: false,
            i_top: 0,
            i_left: 0,
            i_width: 20,
            inputvalue: '',//输入框信息
            inputflag: false,//防止点击过多

            clickSx: 0,//开始点击x位置 用来画裁剪框
            clickSy: 0,
            clickEx: 0,//结束点击x位置
            clickEy: 0,
            shapeid: [],//存放形状实例
            changfangxing: new zrender.Rect({
                //draggable: true
            }),//默认正方形框
            tuoyuan: new zrender.Ellipse({
                //draggable: true
            }),//默认椭圆
            zhexian: new zrender.Polyline({
                //draggable: true,
            }),//默认曲线
            cfxg: new zrender.Group(),//长方形容器
            boundingRect: new zrender.Rect(),
            g: new zrender.Group(),//存放所有图形的容器
            bgi: new zrender.Image(),//存放所有图形的容器
        }
    },
    created() {
        //console.log(document.body.clientWidth, document.body.clientHeight)
        this.width = document.body.clientWidth
        this.height = document.body.clientHeight
    },
    mounted() {
        this.$socket.emit('connect', 1)
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
            console.log(data.points)
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
        }
    },
    methods: {
        inputblur: function () {
            if (this.inputvalue != '') {
                let wenben = new zrender.Text({
                    draggable: true,
                    cursor: 'move',
                    position: [this.i_left, this.i_top],
                    style: {
                        text: this.inputvalue,
                        fontSize: '14',
                        fontWeight: '1000',
                        fill: '#00ff00',
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
                this.$socket.emit('word', {
                    position: JSON.stringify([this.i_left, this.i_top]),
                    text: this.inputvalue,
                })
                this.showinput = false
                this.inputflag = !this.inputflag
                this.inputvalue = ''

            }
        },
        back: function () {
            console.log(this.shapeid)
            /* let id = this.shapeid.pop();
            this.g.remove(id)
            this.zr.refresh() */
        },
        reset: function () {
            this.g.removeAll()
            this.zr.refresh()
        },
        paintpic: function () {
            let ctx = document.getElementsByTagName('canvas')
            let dataURL = ctx[0].toDataURL("image/png", 1)
            console.log(dataURL)
        },
        part1: function (e) {
            if (this.txtmodel == 'true') {
                if (this.inputflag == false) {
                    this.showinput = true
                    this.inputflag = !this.inputflag
                    this.i_top = e.zrY
                    this.i_left = e.zrX
                } else {
                    if (this.inputvalue == '') {
                        this.showinput = false
                        this.inputflag = !this.inputflag
                    }
                }
            } else {
                this.downflag = true
                this.clickSx = e.zrX
                this.clickSy = e.zrY
                this.tempguiji.length = 0
                this.tempguiji.push([this.clickSx, this.clickSy])
            }

        },
        part2: function (e) {
            if (this.downflag == true) {
                this.clickEx = e.zrX
                this.clickEy = e.zrY
                if (this.shapemode == 'pen') {
                    this.tempguiji.push([this.clickEx, this.clickEy])
                    this.zhexian.show()
                    this.zhexian.dirty()
                    this.zhexian.attr({
                        shape: {
                            points: this.tempguiji,
                        },
                        style: {
                            lineWidth: this.fontsize,
                            stroke: this.color,
                        },
                    })
                } else if (this.shapemode == 'rect') {
                    this.changfangxing.show()
                    this.changfangxing.dirty()
                    this.changfangxing.attr({
                        shape: {
                            x: this.clickSx,
                            y: this.clickSy,
                            width: this.clickEx - this.clickSx,
                            height: this.clickEy - this.clickSy
                        },
                        style: {
                            lineWidth: this.fontsize,
                            fill: null,
                            stroke: this.color,
                            //opacity: 0.5
                        },
                    })
                    //this.cfxhui({ x: this.clickSx, y: this.clickSy }, { x: this.clickEx, y: this.clickEy })


                } else if (this.shapemode == 'ellipse') {
                    this.tuoyuan.show()
                    this.tuoyuan.dirty()
                    this.tuoyuan.attr({
                        shape: {
                            cx: (this.clickEx + this.clickSx) / 2,
                            cy: (this.clickEy + this.clickSy) / 2,
                            rx: (this.clickEx - this.clickSx) / 2,
                            ry: (this.clickEy - this.clickSy) / 2
                        },
                        style: {
                            lineWidth: this.fontsize,
                            fill: null,
                            stroke: this.color,
                            //opacity: 0.5
                        },
                    })
                }
            }

        },
        part3: function () {
            if (this.downflag == true) {
                if (this.shapemode == 'rect') {
                    //this.cfxhui({ x: this.clickSx, y: this.clickSy }, { x: this.clickEx, y: this.clickEy })
                    let temprect = new zrender.Rect({
                        draggable: true,
                        shape: {
                            x: this.clickSx,
                            y: this.clickSy,
                            width: this.clickEx - this.clickSx,
                            height: this.clickEy - this.clickSy
                        },
                        style: {
                            lineWidth: this.fontsize,
                            fill: null,
                            stroke: this.color,
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
                    this.changfangxing.hide()
                    this.$socket.emit('changfangxing', {
                        x: this.clickSx,
                        y: this.clickSy,
                        width: this.clickEx - this.clickSx,
                        height: this.clickEy - this.clickSy,
                        color: this.color,
                        font: this.fontsize
                    })
                } else if (this.shapemode == 'ellipse') {
                    let tempellipse = new zrender.Ellipse({
                        draggable: true,
                        shape: {
                            cx: (this.clickEx + this.clickSx) / 2,
                            cy: (this.clickEy + this.clickSy) / 2,
                            rx: (this.clickEx - this.clickSx) / 2,
                            ry: (this.clickEy - this.clickSy) / 2
                        },
                        style: {
                            lineWidth: this.fontsize,
                            fill: null,
                            stroke: this.color,
                            //opacity: 0.5
                        },
                        cursor: 'move'
                    })
                    //console.log('tempellipse:' + tempellipse.id)
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
                    this.tuoyuan.hide()
                    this.$socket.emit('tuoyuan', {
                        cx: this.clickSx,
                        y: this.clickSy,
                        width: this.clickEx - this.clickSx,
                        height: this.clickEy - this.clickSy,
                        color: this.color,
                        font: this.fontsize
                    })
                } else if (this.shapemode == 'pen' && this.tempguiji.length >= 2) {
                    let guiji = zrender.util.clone(this.tempguiji)//深拷贝路径
                    let templine = new zrender.Polyline({
                        draggable: true,
                        shape: {
                            points: guiji,
                        },
                        style: {
                            lineWidth: this.fontsize,
                            stroke: this.color,
                        },
                        cursor: 'move'
                    })
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
                    this.zhexian.hide()
                    this.$socket.emit('path', {
                        points: JSON.stringify(this.tempguiji),
                        stroke: this.color,
                        lineWidth: this.fontsize
                    })
                }
            }
            this.downflag = false
        },
        getpic: function (e) {
            //console.log(e)
            var file = e.srcElement.files[0];
            if (window.FileReader) {
                let fr = new FileReader();
                fr.onloadend = (e) => {
                    this.imgsrc = e.target.result;
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


                };
                fr.readAsDataURL(file);  //也是利用将图片作为url读出
            }
        },
        cfxhui: function (arr1, arr2) {
            this.cfxg.removeAll()
            let elementStyle = {
                stroke: '#ccc',
                fill: null
            };
            let radius = 7
            let circle1 = new zrender.Circle({
                draggable: true,
                cursor: 'move',
                shape: {
                    cx: arr1.x,
                    cy: arr1.y,
                    r: radius
                },
                style: elementStyle,
            })
                .on('mousemove', function () {
                    var rect = this.cfxg.getBoundingRect();
                    this.boundingRect.setShape({
                        x: rect.x,
                        y: rect.y,
                        width: rect.width,
                        height: rect.height
                    });

                });
            let circle2 = new zrender.Circle({
                draggable: true,
                shape: {
                    cx: (arr1.x + arr2.x) / 2,
                    cy: arr1.y,
                    r: radius
                },
                style: elementStyle,
            })
                .on('mousemove', function () {
                    var rect = this.cfxg.getBoundingRect();
                    this.boundingRect.setShape({
                        x: rect.x,
                        y: rect.y,
                        width: rect.width,
                        height: rect.height
                    });

                });
            let circle3 = new zrender.Circle({
                draggable: true,
                shape: {
                    cx: arr2.x,
                    cy: arr1.y,
                    r: radius
                },
                style: elementStyle,
            })
                .on('mousemove', function () {
                    var rect = this.cfxg.getBoundingRect();
                    this.boundingRect.setShape({
                        x: rect.x,
                        y: rect.y,
                        width: rect.width,
                        height: rect.height
                    });

                });
            let circle4 = new zrender.Circle({
                draggable: true,
                shape: {
                    cx: arr1.x,
                    cy: (arr1.y + arr2.y) / 2,
                    r: radius
                },
                style: elementStyle,
            })
                .on('mousemove', function () {
                    var rect = this.cfxg.getBoundingRect();
                    this.boundingRect.setShape({
                        x: rect.x,
                        y: rect.y,
                        width: rect.width,
                        height: rect.height
                    });

                });
            let circle5 = new zrender.Circle({
                draggable: true,
                shape: {
                    cx: arr2.x,
                    cy: (arr1.y + arr2.y) / 2,
                    r: radius
                },
                style: elementStyle,
            })
                .on('mousemove', function () {
                    var rect = this.cfxg.getBoundingRect();
                    this.boundingRect.setShape({
                        x: rect.x,
                        y: rect.y,
                        width: rect.width,
                        height: rect.height
                    });

                });
            let circle6 = new zrender.Circle({
                draggable: true,
                shape: {
                    cx: arr1.x,
                    cy: arr2.y,
                    r: radius
                },
                style: elementStyle,
            })
                .on('mousemove', function () {
                    var rect = this.cfxg.getBoundingRect();
                    this.boundingRect.setShape({
                        x: rect.x,
                        y: rect.y,
                        width: rect.width,
                        height: rect.height
                    });

                });
            let circle7 = new zrender.Circle({
                draggable: true,
                shape: {
                    cx: (arr1.x + arr2.x) / 2,
                    cy: arr2.y,
                    r: radius
                },
                style: elementStyle,
            })
                .on('mousemove', function () {
                    var rect = this.cfxg.getBoundingRect();
                    this.boundingRect.setShape({
                        x: rect.x,
                        y: rect.y,
                        width: rect.width,
                        height: rect.height
                    });

                });
            let circle8 = new zrender.Circle({
                draggable: true,
                shape: {
                    cx: arr2.x,
                    cy: arr2.y,
                    r: radius
                },
                style: elementStyle,
            })
                .on('mousemove', function () {
                    var rect = this.cfxg.getBoundingRect();
                    this.boundingRect.setShape({
                        x: rect.x,
                        y: rect.y,
                        width: rect.width,
                        height: rect.height
                    });

                });
            this.cfxg.add(circle1)
            this.cfxg.add(circle2)
            this.cfxg.add(circle3)
            this.cfxg.add(circle4)
            this.cfxg.add(circle5)
            this.cfxg.add(circle6)
            this.cfxg.add(circle7)
            this.cfxg.add(circle8)
            var rect = this.cfxg.getBoundingRect();
            this.boundingRect.attr({
                shape: {
                    cx: 0,
                    cy: 0,
                    x: rect.x + radius,
                    y: rect.y + radius,
                    width: rect.width - 2 * radius,
                    height: rect.height - 2 * radius
                },
                style: {
                    fill: 'none',
                    stroke: '#14f1ff'
                }
            });
            this.cfxg.add(this.boundingRect);
        }
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
        color: red;
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
