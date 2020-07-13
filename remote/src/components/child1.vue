<template>
    <div>
        <div class="childstyle">{{$t("mainpage.name")}}</div>
    </div>
</template>
<script>
export default {
    name: "child"
}
</script>
<style lang="less" scoped>
.childstyle {
    background-color: var(--label-color);
}
</style>
