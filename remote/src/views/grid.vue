<template>
    <div class="middle">
        <div class="Num">{{showNum}}</div>
        <div class="calcBox">
            <div class="gridbox" ref="gridbox">
                <div data-item="clear">C</div>
                <div data-item="colc">+/-</div>
                <div data-item="colc">%</div>
                <div data-item="">/</div>
                <div data-item="bt">7</div>
                <div data-item="bt">8</div>
                <div data-item="bt">9</div>
                <div data-item="">*</div>
                <div data-item="bt">4</div>
                <div data-item="bt">5</div>
                <div data-item="bt">6</div>
                <div data-item="">-</div>
                <div data-item="bt">1</div>
                <div data-item="bt">2</div>
                <div data-item="bt">3</div>
                <div data-item="">+</div>
                <div class="zero" data-item="bt">0</div>
                <div data-item="">.</div>
                <div data-item="">=</div>

            </div>
        </div>

    </div>
</template>
<script>
export default {
    data() {
        return {
            touchI: null,
            touchO: null,
            showNum: 0,
        }
    },
    mounted() {
        let gridbox = this.$refs.gridbox
        this.touchI = gridbox.addEventListener("touchstart", e => {
            e.target.classList.remove('deactived')
            e.target.classList.add('actived')
            if (e.target.dataset.item === "bt") {
                this.growNum(e.target.innerHTML)
            } else if (e.target.dataset.item === "clear") {
                this.showNum = 0
            }
        }, true)
        this.touchO = gridbox.addEventListener("touchend", e => {
            e.target.classList.remove('actived')
            e.target.classList.add('deactived')
        }, true)
    },
    beforeDestroy() {
        let gridbox = this.$refs.gridbox
        gridbox.removeEventListener("touchstart", this.touchI)
        gridbox.removeEventListener("touchend", this.touchO)
    },
    methods: {
        growNum(e) {
            e = Number(e)
            if (e === 0) {
                if (this.showNum === 0) return
                this.showNum = this.showNum * 10
            } else {
                if (this.showNum === 0) {
                    this.showNum = e
                } else {
                    this.showNum = this.showNum * 10 + e
                }
            }
        }
    }
}
</script>
<style lang="less" scoped>
.middle {
    display: flex;
    // align-items: center;
    // vertical-align: middle;
    flex-direction: column;
    .Num {
        line-height: 50px;
        font-size: calc((100vw - 20px) / 6);
        text-align: right;
        padding: 15px;
    }
    .calcBox {
        position: fixed;
        bottom: 0;
    }
}
.gridbox {
    -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Chrome/Safari/Opera */
    -khtml-user-select: none; /* Konqueror */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
    user-select: none; /* Non-prefixed version, currently not supported by any browser */
    // margin: 0px auto;
    display: grid;
    grid-template-columns: repeat(4, calc((100vw - 30px) / 4));
    grid-template-rows: repeat(5, calc((100vw - 30px) / 4));
    grid-gap: 10px;
    grid-template-areas:
        "a b c j"
        "d e f k"
        "m n o p"
        "q r s t"
        "g g i l";
    .zero {
        grid-area: g;
        border-radius: calc((100vw - 30px) / 8);
        // transform: scaleX(0.9);
    }

    & > div {
        // border: 1px solid black;
        transform: scale(0.8);
        border-radius: 50%;
        line-height: calc((100vw - 30px) / 4);
        font-size: calc((100vw - 30px) / 12);
        text-align: center;
        vertical-align: middle;
        background-color: #fff;
        box-shadow: 5px 5px 5px #222;
        place-items: center;
        cursor: pointer;
    }
    & > div:hover {
        box-shadow: -2px 0px 1px #222;
    }
    & > div.actived {
        box-shadow: -2px 0px 1px #222;
    }
    & > div.deactived {
        box-shadow: 5px 5px 5px #222;
    }
}
</style>
