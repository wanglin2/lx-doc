<template>
    <el-dialog
        append-to-body
        :width="400"
        v-model="dialogVisible"
        :title="`将「${data ? data.name : ''}」移动至`"
        @close="onClose"
    >
        <div>
            <div
                class="folderItem text-[#1d2129] text-[13px] h-[40px] px-[40px] flex items-center cursor-pointer"
                :class="{ active: activeFolderId === 'default' }"
                @click="onFolderChange('default')"
            >默认文件夹</div>
            <div
                v-for="item in folderList"
                :key="item.id"
                class="folderItem text-[#1d2129] text-[13px] h-[40px] px-[40px] flex items-center cursor-pointer"
                :class="{ active: activeFolderId === item.id }"
                @click="onFolderChange(item.id)"
            >{{ item.name }}</div>
        </div>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="onCancelClick">取消</el-button>
                <el-button type="primary" @click="onConfirmClick">确定</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive, watch } from 'vue';
import { ElMessage } from 'element-plus'
import api from '../../../api';

const props = defineProps<{
    show: boolean,
    data: {
        name: string,
        id: string,
        belongId: string
    },
}>()

const emits = defineEmits(['cancel', 'confirm', 'close'])

const dialogVisible = ref(false)

const folderList = ref([])
const activeFolderId = ref('')
const getFolderList = async () => {
    try {
        let { data } = await api.getFolderList()
        if (data.code === 0) {
            folderList.value = data.data
        }
    } catch (e) {
        console.log(e);
    }
}

const onFolderChange = (id) => {
    activeFolderId.value = id
}

watch(() => {
    return props.show;
}, (val, oldVal) => {
    dialogVisible.value = props.show
    if (val && !oldVal) {
        activeFolderId.value = props.data.belongId
        getFolderList()
    }
})

const onClose = () => {
    emits('close')
}

const onCancelClick = () => {
    emits('cancel')
}

const onConfirmClick = async () => {
    emits('confirm', activeFolderId.value)
}
</script>

<style lang="less" scoped>
.folderItem {
    &:hover {
        background-color: #fafafa;
    }

    &.active {
        background-color: #fafafa;
    }
}
</style>