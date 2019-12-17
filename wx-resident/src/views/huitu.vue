<template>
    <div>
        <sd></sd>
    </div>
</template>
<script>
import s_d from '../components/signdraw'
export default {
    name: 'chatroom',
    data() {
        return {

        }
    },
    components: {
        'sd': s_d
    },
    methods: {

    }
}
</script>

<style lang='less' scoped>
.chatbox {
    height: auto;
    min-height: 100vh;
}
.infobar {
    padding-top: 0.11rem;
    font-size: 12px;
    color: #1cc4a4;
    background: #f6f6f6;
    text-align: center;
}
.time {
    text-align: center;
    color: #666666;
    font-size: 13px;
    margin-top: 0.38rem;
    margin-bottom: 0.24rem;
}

.time ~ .time {
    margin-top: 0.64rem;
    margin-bottom: 0.24rem;
}

.toolbox {
    position: fixed;
    display: flex;
    bottom: 0;
    width: 100%;
    align-items: center;
    background-color: #f6f6f6;
    padding: 7px 0 7px 0;
    .btn_one {
        margin: 0 0.28rem;
    }
    .van-field {
        border-radius: 20px;
        padding: 4px 13px 4px 14px;
    }
}
.van-cell {
    display: block;
}
.popuptitle {
    text-align: center;
}
.bigpicclass {
    width: 100%;
    left: 50%;
    top: 50%;
    position: fixed;
    transform: translate(-50%, -50%);
}
</style>
