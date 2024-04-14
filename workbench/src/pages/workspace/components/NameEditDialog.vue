<template>
    <el-dialog append-to-body :width="350" v-model="dialogVisible" :title="title" @close="onClose">
        <el-form
            ref="ruleFormRef"
            :model="editForm"
            :rules="editFormRule"
            label-width="120px"
            label-position="top"
        >
            <el-form-item :label="label" prop="name">
                <el-input v-model="editForm.name" />
            </el-form-item>
        </el-form>
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

const props = defineProps<{
    show: boolean,
    title: string,
    text: string,
    label: string
}>()

const emits = defineEmits(['cancel', 'confirm', 'close'])

const ruleFormRef = ref(null);
const dialogVisible = ref(false)
const editForm = reactive({
    name: ''
})
const editFormRule = reactive({
    name: [
        { required: true, message: '请输入' + props.label, trigger: 'blur' },
        { min: 1, max: 100, message: '长度需在 1 到 100', trigger: 'blur' },
    ],
})

watch(() => {
    return props.show;
}, () => {
    editForm.name = props.text
    dialogVisible.value = props.show
})

const onClose = () => {
    emits('close')
}

const onCancelClick = () => {
    emits('cancel')
}

const onConfirmClick = () => {
    ruleFormRef.value.validate(async (valid) => {
        if (valid) {
            emits('confirm', editForm)
        }
    })

}
</script>