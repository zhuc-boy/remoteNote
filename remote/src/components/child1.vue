<template>
    <div>
        <div class="childstyle">{{$t("mainpage.name")}}</div>
        <slot></slot>
    </div>
</template>
<script>
export default {
    name: "child",
    data() {
        return {
            ji: 1
        }
    }
}
</script>
<style lang="less" scoped>
.childstyle {
    background-color: var(--label-color);
}
</style>
