<template>
  <div class="login-container">
    <!-- 左侧：插画 / 品牌区。背景统一由主题变量 --login-bg-color 提供，不硬编码色值 -->
    <div class="login-brand login-brand--yellow">
      <div class="login-brand__inner">
        <h1 class="login-brand__title">Yudao Admin</h1>
        <p class="login-brand__slogan">企业级快速开发平台，让开发更简单</p>
        <ul class="login-brand__features">
          <li v-for="feature in brandFeatures" :key="feature" class="login-brand__feature">
            {{ feature }}
          </li>
        </ul>
      </div>
    </div>

    <!-- 右侧：账号密码登录 -->
    <div class="login-form">
      <h2 class="login-form__title">登录</h2>
      <el-form
        ref="loginFormRef"
        :model="loginFormData"
        :rules="loginFormRules"
        size="large"
        @keyup.enter="handleLogin"
      >
        <el-form-item prop="username">
          <el-input v-model="loginFormData.username" placeholder="请输入登录账号" clearable>
            <template #prefix>
              <Icon icon="ep:user" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginFormData.password"
            type="password"
            placeholder="请输入密码"
            show-password
          >
            <template #prefix>
              <Icon icon="ep:lock" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            class="login-form__submit"
            :loading="loginLoading"
            @click="handleLogin"
          >
            登 录
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import request from '@/config/axios'
import { setAccessToken, setRefreshToken } from '@/utils/auth'

defineOptions({ name: 'RuoyiVueProLogin' })

const message = useMessage()

/** 后端 AuthLoginRespVO 的登录返回 */
interface AuthLoginRespVO {
  userId: number
  accessToken: string
  refreshToken: string
  expiresTime: string
}

/** 品牌区文案 */
const brandFeatures = [
  '开箱即用的中后台前端方案',
  '多租户 / 工作流 / 代码生成全内置',
  '前后端分离，支持微服务架构'
]

/** 登录表单 */
const loginFormRef = ref()
const loginLoading = ref(false)
const loginFormData = reactive({
  username: '',
  password: ''
})

// 校验规则与后端 AuthLoginReqVO 保持一致：账号 4-30 位数字或字母，密码 4-16 位
const loginFormRules = reactive({
  username: [
    { required: true, message: '登录账号不能为空', trigger: 'blur' },
    { min: 4, max: 30, message: '账号长度为 4-30 位', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9]{4,30}$/, message: '账号格式为数字以及字母', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '密码不能为空', trigger: 'blur' },
    { min: 4, max: 16, message: '密码长度为 4-16 位', trigger: 'blur' }
  ]
})

/** 登录 */
const handleLogin = async () => {
  if (!loginFormRef.value || loginLoading.value) {
    return
  }
  // 表单校验未通过时 validate() 会 reject，此处直接中断提交
  try {
    await loginFormRef.value.validate()
  } catch {
    return
  }
  loginLoading.value = true
  try {
    const data = (await request.post({
      url: '/system/auth/login',
      data: loginFormData
    })) as AuthLoginRespVO
    setAccessToken(data.accessToken)
    setRefreshToken(data.refreshToken)
    message.success('登录成功')
  } catch {
    // 请求异常已由 axios 拦截器统一提示，此处捕获避免抛出未处理的 rejection
  } finally {
    loginLoading.value = false
  }
}
</script>

<style lang="scss" scoped>
// 主题变量统一来自 variables.scss，本组件不重复定义任何色值
@use '../../styles/variables.scss' as theme;

.login-container {
  display: flex;
  width: 100%;
  min-height: 100vh;
}

// ---------- 左侧：插画 / 品牌区 ----------
// 黄色主题：背景色一律取 --login-bg-color，禁止在此硬编码色值。
// 正文与次级文字分别取 --login-text-color / --login-text-sub-color，
// 与背景的对比度约为 11.3:1 与 5.9:1，均满足 WCAG AA（≥ 4.5:1）。
.login-brand {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 48px;

  &--yellow {
    color: var(--login-text-color);
    background-color: var(--login-bg-color);
  }

  &__inner {
    max-width: 420px;
  }

  &__title {
    margin: 0 0 16px;
    font-size: 32px;
    font-weight: 600;
    color: var(--login-text-color);
  }

  &__slogan {
    margin: 0 0 32px;
    font-size: 16px;
    line-height: 1.6;
    color: var(--login-text-sub-color);
  }

  &__features {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  &__feature {
    position: relative;
    margin-bottom: 12px;
    padding-left: 20px;
    font-size: 14px;
    line-height: 1.6;
    color: var(--login-text-sub-color);

    // 列表圆点同样取主题变量，避免散落硬编码
    &::before {
      position: absolute;
      top: 8px;
      left: 0;
      width: 6px;
      height: 6px;
      background-color: var(--login-text-color);
      border-radius: 50%;
      content: '';
    }
  }
}

// ---------- 右侧：登录表单 ----------
.login-form {
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  max-width: 480px;
  padding: 48px;
  background-color: var(--el-bg-color);

  &__title {
    margin: 0 0 32px;
    font-size: 24px;
    font-weight: 600;
  }

  // 主按钮填充品牌色，文字用黄底正文色，保证按钮内文字对比度同样达标
  &__submit {
    width: 100%;
    --el-button-text-color: var(--login-text-color);
    --el-button-bg-color: var(--login-brand-color);
    --el-button-border-color: var(--login-brand-color);
    --el-button-hover-text-color: var(--login-text-color);
    --el-button-hover-bg-color: var(--login-brand-color);
    --el-button-hover-border-color: var(--login-brand-color);
    --el-button-active-text-color: var(--login-text-color);
    --el-button-active-bg-color: var(--login-brand-color);
    --el-button-active-border-color: var(--login-brand-color);
  }
}

// 窄屏下改为纵向堆叠，品牌区仍然保留黄色背景
@media (max-width: 768px) {
  .login-container {
    flex-direction: column;
  }

  .login-brand {
    padding: 32px 24px;
  }

  .login-form {
    max-width: none;
  }
}
</style>
