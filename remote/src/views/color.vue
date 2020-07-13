<template>
    <div>
        <div class="labelpart">{{$t('msg.login')}}</div>
        <div>
            <input type="color" v-model="labelColor" @change="getcolor">
            <!--  v-model="$store.state.globalColor['--label-color']" -->
        </div>
        <child />
        <div>
            <input type="text" :placeholder="$t('mainpage.name')">
        </div>
        <label>
            {{$t("control.changeLanguage")}}
            <select v-model="$i18n.locale">
                <option value="en">english</option>
                <option value="zh">简体中文</option>
                <option value="jp">日本語</option>
            </select>
        </label>

        <!-- <span @click="changeLaguages()">{{$t("control.changeLanguage")}}</span> -->
        <!-- <img v-lazy="" alt=""> -->
    </div>
</template>
<script>
import child from "../components/child1"
export default {
    components: {
        "child": child
    },
    data() {
        return {
            labelColor: "#222"
        }
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
        }
    }

}
</script>
<style lang="less" scoped>
.labelpart {
    background-color: var(--label-color);
}
</style>
