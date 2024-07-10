<template>
    <div class="container">
        <div class="form-warp">
            <form class="sign-in-form">
                <h2 class="form-title">登录</h2>
                <input placeholder="用户名" v-model="username" />
                <input type="password" placeholder="密码" v-model="password" />
                <div class="submit-btn" @click="login">立即登录</div>
            </form>
        </div>
        <div class="desc-warp">
            <div class="desc-warp-item sign-up-desc">
                <img src="../assets/LoginImg/log.svg" alt="">
            </div>
        </div>
    </div>
</template>

<script>
// import axios from "axios";
import instance from "@/utils/axios";
export default {
    name: "LoginView",
    data() {
        return {
            username: "",
            password: "",
        };
    },
    computed: {
        isDisabled() {
            return !this.username || !this.password || this.usernameExceedsMaxLength || this.passwordExceedsMaxLength
        },
        usernameExceedsMaxLength() {
            return this.username.length > 20
        },
        passwordExceedsMaxLength() {
            return this.password.length > 20
        }
    },
    methods: {
        login() {
            if (this.isDisabled) {
                this.$message.error('用户名或密码为空或长度超过20！');
                return;
            }
            instance.post('/login', {
                username: this.username,
                password: this.password
            })
                .then(response => {
                    console.log(response)
                    // 登录成功后的操作
                    this.$message({
                        message: '登录成功！',
                        type: 'success'
                    });
                    this.$bus.$emit('login')
                    // 跳转到首页
                    this.$router.push({ path: '/home' })
                })
                .catch(error => {
                    // 登录失败后的操作
                    console.log(error)
                    
                })
        },
    },

};
</script>

<style scoped>
* {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
    color: #333;
}

.container {
    width: 100vw;
    height: 100vh;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #f9f9f9;
    overflow: hidden;

}

.container::before {
    content: " ";
    position: absolute;
    width: 2000px;
    height: 2000px;
    border-radius: 50%;
    background-image: linear-gradient(-45deg, #6266f5 0%, #04befe 100%);
    z-index: 6;
    top: -10%;
    right: 48%;
    transform: translateY(-50%);
}


.form-warp {
    width: 50%;
    position: absolute;
    z-index: 5;
    left: 75%;
    top: 50%;
    z-index: 5;
    transform: translate(-50%, -50%);
    display: grid;
    grid-template-columns: 1fr;
    transition: 1s 0.7s ease-in-out;
}

.form-warp form {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 20px;
    /* 将两个 form 布局在 grid 同一位置 */
    grid-row: 1 / 2;
    grid-column: 1 / 2;
    transition: all 0.2s 0.7s;
    opacity: 1;
    z-index: 4;
}

.form-title {
    color: #6266f5;
}

input,
.submit-btn {
    min-width: 300px;
    outline: none;
    padding: 12px 30px;
    line-height: 1;
    font-size: 16px;
    border-radius: 60px;
    color: #333;
    background-color: #6267f513;
    border: none;
}

input::placeholder {
    color: #cccc;
}

.submit-btn {
    background-color: #6266f5;
    color: #FFF;
    text-align: center;
    min-width: 150px;
    font-size: initial;
    font-weight: bold;
    letter-spacing: 1.5px;
    cursor: pointer;
}

.desc-warp {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
}

.desc-warp-item {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: space-around;
    text-align: center;
    text-align: center;
    padding: 3rem 17% 2rem 12%;
    z-index: 6;
}


button {
    outline: none;
    padding: 6px 8px;
    min-width: 100px;
    text-align: center;
    border-radius: 30px;
    border: 2px solid #FFF;
    background: none;
    color: #FFF;
    cursor: pointer;
    transition: all .3s ease;
}

button:active {
    background: rgba(255, 255, 255, .1);
}

img {
    width: 100%;
    display: block;
    transition: transform 0.9s ease-in-out;
    transition-delay: .5s;
}
</style>