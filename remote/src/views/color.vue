<template >
    <div>
        <div class="labelpart">{{$t('msg.login')}}</div>
        <div>
            <input type="color" v-model="labelColor" @change="getcolor">
            <!--  v-model="$store.state.globalColor['--label-color']" -->
        </div>
        <child @keyup.enter.native="jianpan">
            <child>
                abcadwa
            </child>
        </child>
        <div>
            <input type="text" :placeholder="$t('mainpage.name')">
        </div>
        <div>
            <input type="number" v-model.number="ces">
        </div>
        <label>
            {{$t("control.changeLanguage")}}
            <select v-model="$i18n.locale">
                <option value="en">english</option>
                <option value="zh">简体中文</option>
                <option value="jp">日本語</option>
            </select>
        </label>
        <div>{{locale}}</div>
        <span @click="gohuitu">点击跳转</span>
        <img :src="`@/img/bg`" alt="">
        <input />
        <!-- <span @click="changeLaguages()">{{$t("control.changeLanguage")}}</span> -->
        <!-- <img v-lazy="" alt=""> -->
    </div>
</template>
<script>
import img from '@/components/img.json'
import child from "../components/child1"
export default {
    components: {
        "child": child,
        imgsrc: null
    },
    data() {
        return {
            labelColor: "#222222",
            ces: null
        }
    },
    computed: {
        locale() {
            window.localStorage.setItem("lan", this.$i18n.locale)
            console.log(this.$i18n.locale)
            return this.$i18n.locale
        }
    },
    created() {
        this.imgsrc = img
        // console.log(img)
        // document.getElementById("app").style.display = "none"
        // function aDisplay() {
        //     // document.getElementById("app").style.display = "block"
        //     document.getElementById("guodu").style.display = "none"
        //     clearTimeout(aDisplay)
        // }
        // setTimeout(aDisplay, 10000);
    },
    mounted() {
        console.log(this.$children)
    },
    methods: {
        getcolor() {
            this.$store.dispatch("changeColor", this.labelColor)
            // console.log(this.$store.state.globalColor)
            // this.$store.state.globalColor["--label-color"] = this.labelColor
        },
        changeLaguages() {
            console.log(this.$i18n.locale)
            let lang = this.$i18n.locale === 'zh' ? 'en' : 'zh'
            this.$i18n.locale = lang
        },
        gohuitu() {
            Object.assign(this.$data, this.$options.data())
            // console.log(this.$data, this.$options.data())
            // this.$router.push("./b")
        },
        jianpan(e) {
            console.log(1111)
            console.log(e)
        }
    }

}
</script>
<style lang="less" scoped>
.labelpart {
    background-color: var(--label-color);
}
</style>
