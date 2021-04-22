<template>
  <div class="copyTool">
    <el-tooltip content="复制" placement="top">
      <i class="el-icon-document-copy btn-copy" @click="copyHandle"></i>
    </el-tooltip>
  </div>
</template>

<script>
import {clipboard} from '../utils/util'
export default {
  props: {
    textStr: {
      type: String,
      require: true
    }
  },
  methods: {
    copyHandle () {
      clipboard(this.textStr)
    }
  }
}
</script>

<style lang="less" scoped>
  .copyTool{
    display: inline;
    .btn-copy{
      // float: right;
      color: #409eff;
      cursor: pointer;
    }
  }
</style>