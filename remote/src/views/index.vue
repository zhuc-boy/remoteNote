<template>
    <div class="back">
        <div class="lefttopimg">
            <img src="../img/logo@2x.png" alt="">
        </div>
        <div class="middleimg">
            <div class="word">
                <span>中国移动</span>
                <span style="color:#4cc7ff">告警牌</span>
            </div>
        </div>
        <div class="mainbody">
            <div v-for="item in result" :key="item.word">
                <template v-if="item.level=='common'">
                    <div class="clcyle green"></div>
                    <div class="word">{{item.word}}</div>
                </template>
                <template v-else-if="item.level=='warn'">
                    <div class="clcyle yellow"></div>
                    <div class="word">{{item.word}}</div>
                </template>
                <template v-else-if="item.level=='danger'">
                    <div class="clcyle red">
                    </div>
                    <div class="word">{{item.word}}</div>
                </template>
                <template v-else>
                    <div class="clcyle"></div>
                    <div class="word">{{item.word}}</div>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 's_d',
    data() {
        return {
            result: [
                { level: "common", word: '警告' },
                { level: "warn", word: '警告' },
                { level: "danger", word: '警告' },

                { level: "common", word: '警告' },
                { level: "", word: '' },
                { level: "", word: '' },

                { level: "", word: '' },
                { level: "", word: '' },
                { level: "", word: '' },

                { level: "", word: '' },
                { level: "", word: '' },
                { level: "", word: '' },

                { level: "", word: '' },
                { level: "", word: '' },
                { level: "", word: '' },
            ]
        }
    },
    created() {

    },
    mounted() {

    },
    methods: {

    },
}
</script>

<style lang='less'>
.back {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url("../img/bg@2x.png");
    background-size: contain;
    background-attachment: initial;
    background-position: center;
    .lefttopimg {
        position: absolute;
        width: 150px;
        height: 49px;
        top: 20px;
        left: 20px;
        img {
            width: 100%;
            height: 100%;
        }
    }
    .middleimg {
        width: 886px;
        height: 232px;
        margin: auto;
        background-image: url("../img/标题bg@2x.png");
        background-size: contain;
        background-attachment: initial;
        background-position: center;
        .word {
            padding-top: 83px;
            margin-bottom: 80px;
            margin: auto;
            width: 420px;
            height: 69px;
            font-size: 60px;
            font-family: FZZYJW--GB1-0, FZZYJW--GB1;
            font-weight: normal;
            color: rgba(231, 244, 255, 1);
            line-height: 69px;
        }
    }
    .mainbody {
        width: 79.2%;
        display: flex;
        flex-wrap: wrap;
        margin: auto;
        justify-content: space-around;
        & > div {
            margin-top: 15px;
            width: 33.33%;
            display: flex;
            flex-direction: column;
            & div {
                margin: auto;
            }
            & .word {
                margin-top: 15px;
                margin-bottom: 74px;
            }
        }
        .green {
            background-image: linear-gradient(#10224a, #39e675);
        }
        .red {
            background-image: linear-gradient(#10224a, #e7464c);
        }
        .yellow {
            background-image: linear-gradient(#10224a, #edba32);
        }
        .word {
            text-align: center;
            /*  width: 152px; */
            height: 61px;
            font-size: 44px;
            font-family: FZLTZHK--GBK1-0, FZLTZHK--GBK1;
            font-weight: normal;
            color: rgba(231, 244, 255, 1);
            line-height: 61px;
        }
    }
}
@media screen {
    .clcyle {
        border-width: 2px;
        border-color: #fff;
        border-radius: 50%;
        border-style: dotted;
        width: 160px;
        height: 160px;
        box-sizing: border-box;
    }
}
</style>
