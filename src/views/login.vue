<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import type { RuleForm } from '@/types'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { login } from '@/api'

const router = useRouter()
const ruleFormRef = ref<FormInstance>()

const ruleForm = reactive<RuleForm>({
    username: '',
    password: '',
})

const rules = reactive<FormRules<RuleForm>>({
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' }
    ],
})

const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate(async (valid) => {
        if (valid) {
            const res = await login({
                username: ruleForm.username,
                password: ruleForm.password,
            })
            console.log(res)
            // 登录成功，跳转到首页
            router.push({ path: '/' })
            ElMessage.success('登录成功!')
            resetForm(formEl)
        }
    })
}

const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
}
</script>

<template>
    <el-card style="max-width: 480px" shadow="always">
        <el-form ref="ruleFormRef" style="max-width: 600px" :model="ruleForm" :rules="rules" label-width="auto">
            <el-form-item label="用户名" prop="username">
                <el-input v-model="ruleForm.username" />
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input v-model="ruleForm.password" />
            </el-form-item>
            <el-button type="primary" @click="submitForm(ruleFormRef)">登录</el-button>
        </el-form>
    </el-card>
</template>

<style scoped>
</style>