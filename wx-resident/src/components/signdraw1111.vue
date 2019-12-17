<template>
    <div>
        <div>
            <div @mousedown="part1" @mousemove="part2" @mouseup="part3" id="zrenders" style="width: max-content;">
            </div>
        </div>

        <div>
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
            <!-- <input type="color" name="" id="" v-model="ce">
            {{ce}} -->
        </div>
        <div>
            <button @click="paintpic">完成</button>
        </div>
    </div>
</template>

<script>
import imgsrc from './img.json'
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
            imgsrc: imgsrc,
            //imgurl: 'http://dmimg.5054399.com/allimg/pkm/pk/22.jpg',
            downflag: false,
            shapemode: 'pen',
            fontsize: 3,
            color: '#000000',
            clickPx: 0,
            clickPy: 0,

        }
    },
    created() {

        this.width = 600
        this.height = 500
    },
    mounted() {
        //this.drawimg()
        this.$socket.emit('connect', 1)
        this.zr = zrender.init(document.getElementById('zrenders'), {
            renderer: 'canavs',
            width: this.width,
            height: this.height
        });
        let bgi = new zrender.Image({
            style: {
                image: this.imgsrc,
                x: 0,
                y: 0,
                width: this.width,
                height: this.height,

            },
            cursor: 'wait',
        })
        this.zr.add(bgi)
    },
    sockets: {
        sendtoother(data) {
            let ctx2 = this.$refs.top.getContext('2d');
            console.log(data)
            let path = JSON.parse(data.path)
            let color = data.color
            let fontsize = data.font
            let j = 1
            while (j < path.length) {
                this.paintfreeline(ctx2, path[j - 1], path[j], fontsize, color)
                j += 1
            }
            this.track_tempe.push(data)
        }
    },
    methods: {
        getmix: function () {

        },
        writeword: function () {

        },
        back: function () {
            if (this.track_tempe.length == 0) {
                return
            }
            this.track_tempe.pop()
            let ctx2 = this.$refs.top.getContext('2d');
            ctx2.clearRect(0, 0, this.width, this.height);
            for (let i = 0; i < this.track_tempe.length; i++) {
                let path = JSON.parse(this.track_tempe[i].path)
                let color = this.track_tempe[i].color
                let fontsize = this.track_tempe[i].font
                let j = 1
                while (j < path.length) {
                    this.paintfreeline(ctx2, path[j - 1], path[j], fontsize, color)
                    j += 1
                }
            }
        },
        reset: function () {
            this.track_tempe.splice(0, this.track_tempe.length)
            let ctx2 = this.$refs.top.getContext('2d');
            ctx2.clearRect(0, 0, this.width, this.height);
        },
        paintfreeline: function (cxt, arr1, arr2, borderWidth, borderColor, fillColor) {

            cxt.beginPath();
            cxt.moveTo(arr1.x, arr1.y);
            cxt.lineTo(arr2.x, arr2.y);
            cxt.closePath();

            cxt.lineWidth = borderWidth;
            cxt.strokeStyle = borderColor;
            cxt.fillStyle = fillColor;
            cxt.stroke();
        },
        paintRect: function (cxt, arr1, arr2, borderWidth, borderColor, fillColor) {
            //context.rect(x,y,width,height);
            cxt.beginPath();
            cxt.lineWidth = borderWidth;
            cxt.strokeStyle = borderColor;
            cxt.rect(arr1.x, arr1.y, arr2.w, arr2.h);
            cxt.fillStyle = fillColor;
            cxt.closePath();
            cxt.stroke();
        },
        paintpic: function () {
            let ctx1 = this.$refs.top.getContext('2d');
            let img = new Image();
            img.src = imgsrc;

            let w = img.width;
            let h = img.height;
            let _this = this
            img.onload = drawImageActualSize;
            function drawImageActualSize() {
                ctx1.globalCompositeOperation = "destination-over";
                if (_this.width / _this.height > w / h) {
                    ctx1.drawImage(this, (_this.width - w * _this.height / h) / 2, 0, (w * _this.height / h), _this.height)
                } else {
                    ctx1.drawImage(this, 0, (_this.height - h * _this.width / w) / 2, _this.width, (h * _this.width / w))
                }
            }
        },

        part1: function (e) {
            this.downflag = true
            this.tempguiji.length = 0
            //console.log(e)
            this.clickPx = e.x
            this.clickPy = e.y
        },
        part2: function (e) {
            if (this.downflag == true && this.shapemode == 'pen') {
                let ctx = this.$refs.top.getContext('2d');
                ctx.globalCompositeOperation = "source-over";
                this.tempguiji.push({
                    x: e.x,
                    y: e.y
                })
                if (this.tempguiji.length >= 2) {
                    this.paintfreeline(ctx, this.tempguiji[this.tempguiji.length - 2], this.tempguiji[this.tempguiji.length - 1], this.fontsize, this.color)
                }
            } else if (this.downflag == true && this.shapemode == 'rect') {

                let ctx = this.$refs.figure.getContext('2d');
                //ctx.save();
                ctx.clearRect(0, 0, this.width, this.height)
                this.paintRect(ctx, { x: this.clickPx, y: this.clickPy }, { w: e.x - this.clickPx, h: e.y - this.clickPy }, this.fontsize, this.color)
                //ctx.restore();
            }
        },
        part3: function (e) {
            if (this.shapemode == 'rect') {
                let ctx1 = this.$refs.figure.getContext('2d');
                //ctx.save();
                ctx1.clearRect(0, 0, this.width, this.height);
                let ctx2 = this.$refs.top.getContext('2d');
                this.paintRect(ctx2, { x: this.clickPx, y: this.clickPy }, { w: e.x - this.clickPx, h: e.y - this.clickPy }, this.fontsize, this.color)
                //ctx.restore();
            }

            if (this.tempguiji.length >= 2) {
                this.track_tempe.push({
                    path: JSON.stringify(this.tempguiji),
                    color: this.color,
                    font: this.fontsize
                })
                this.$socket.emit('path', {
                    path: JSON.stringify(this.tempguiji),
                    color: this.color,
                    font: this.fontsize
                })
            }

            this.downflag = false
        },
    },
}
</script>

<style lang='less'>
.canvas {
    z-index: 2;
}
.imgcontain {
    display: inline-block;
}
.img {
    width: 100%;
    height: 100%;
    object-fit: contain;
}
</style>
