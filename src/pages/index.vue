<template>
  <div>
     <div class="preview-page" v-if="entryChanel==1">
    <preview
      v-if="!loginVisible"
      ref="preview"
      :changeMode="false"
      :data="questions"
      :cover="style.questionnaireCover"
      :title="title"
      :sub-title="subtitle"
      :foot="footTitle"
      :background="style.questionnaireBackground"
      :logo="style.questionnaireLogo"
      @submit="submitQuestions"
    ></preview>
    <!--弹框登录-->
    <el-dialog
      v-loading="logLoading"
      title="登录"
      :visible.sync="loginVisible"
      :show-close="false"
      :close-on-press-escape="false"
      fullscreen
      width="30%"
    >
      <div class="login-content">
        <el-form :model="ruleForm" status-icon :rules="rules" ref="loginForm" label-width="100px">
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="ruleForm.phone" placeholder="请输入手机号" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="验证码" prop="sms">
            <el-input v-model="ruleForm.sms" placeholder="请填入验证码" autocomplete="off">
              <el-button
                slot="append"
                type="primary"
                @click="getSMS"
                :disabled="isYZM"
              >{{seconds === 60 ? '获取验证码' : `${seconds}s`}}</el-button>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button class="submit-btn" type="primary" @click="submitForm" :loading="confirmLoading">验证</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
    <!--手机号授权弹框-->
    <el-dialog
      class="phone-auth"
      title=""
      :visible.sync="showPhoneAuth"
      fullscreen
    >
      <img style="width: 20%" src="../../../../assets/img/logo.jpg" alt="">
      <div class="title">中国移动认证</div>
      <div class="phone-num">{{noPassByMobile(phoneNum)}}</div>
      <div class="phone-desc">温馨提示：双卡双待的手机客户，请留意上方号码是否为当前使用的号码</div>
      <div><el-button type="primary" round @click="handleAutoLogin">一键登录</el-button></div>
      <div><el-button round @click="handleOtherLogin">其他号码登录</el-button></div>
    </el-dialog>
    <!-- 登录后答题权限判定 -->
     <el-dialog
      class="competence-box"
      title=""
      :show-close="false"
      :visible.sync="competenceVisible"
      fullscreen

    >
      <img style="width: 50%;margin-top:15vh" :src="competenceImg[questionInfoCode].img" alt="">
       <div class="competence-msg">{{competenceImg[questionInfoCode].msg}}</div>

      <!-- <el-button type="primary" >知道了</el-button> -->
    </el-dialog>
  </div> 
  <!-- 微厅 -->
  <div v-if="entryChanel==2||entryChanel==3"> 
    <preview
      ref="preview"
      :changeMode="false"
      :data="questions"
      :cover="style.questionnaireCover"
      :title="title"
      :sub-title="subtitle"
      :foot="footTitle"
      :background="style.questionnaireBackground"
      :logo="style.questionnaireLogo"
      @submit="submitQuestions"
    ></preview>
  </div>
  <!-- <div v-if="entryChanel==3">
    这里是掌厅登陆过来的
  </div> -->
 
  </div>
</template>

<script>
import Preview from '@/components/questions/Preview';
import {
  commitQuestions,
  getQuestions,
  getSignEncrypt,
  getTokenValidate,
  getSMSLoginVerificationCode,
  verifySMSLoginVerificationCode,
  androidIOSLoginVerify, // 验证scode 和 ver
  // getMobileNo, // 获取手机号
  getRandomValidate, // 验证手机号和随机串
  getLinkChannelType // 获取进入页面的渠道
} from '@/api/preview';

export default {
  name: 'Index',
  components: {Preview},
  data() {
    const checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('手机号不能为空'));
      }
      const reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
      if (reg.test(value)) {
        callback();
      } else {
        return callback(new Error('请输入正确的手机号'));
      }
    };
    const checkSMS = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请填入验证码'));
      }
      const reg = /\d{6}$/;
      if (reg.test(value)) {
        callback();
      } else {
        return callback(new Error('请输入正确的验证码'));
      }
    };
    return {
      competenceImg:[{img:require('@/assets/img/competence1.png'),msg:'抱歉，您当前无法参与'},{img:require('@/assets/img/competence2.png'),msg:'您已参与该问卷'}],
      questionInfoCode:0,
      competenceVisible:false,
      id: null,
      loginVisible: true,
      logLoading: true,
      confirmLoading: false,
      showPhoneAuth: false, // 显示免密获取手机号授权确认弹窗
      title: '',
      subtitle: '',
      footTitle: '',
      questions: [],
      phoneNum: '',
      style: {
        questionnaireBackground: '',
        questionnaireCover: '',
        questionnaireLogo: ''
      },
      ruleForm: {
        phone: '',
        sms: ''
      },
      rules: {
        phone: [{validator: checkPhone, trigger: 'blur'}],
        sms: [{validator: checkSMS, trigger: 'blur'}]
      },
      interval: null,
      isYZM: false,
      seconds: 60,
      appid: '300011963358',
      version: '1.2',
      // appkey: 'E3953C5E59573B147347724127B81E91'
      // 渠道掌厅3 微厅2 短信1
      entryChanel:1
    };
  },
  mounted() {
    document.title = '客户体验评测';
    this.id = this.$route.params.id;
    // 短信
    // this.getSignEncrypt();
    // 假装免密授权成功
    // this.logLoading = false;
    // this.phoneNum = '18022222345';
    // this.showPhoneAuth = true;
    try {
      this.init();
    } catch (error) {
      this.getSignEncrypt();
    }
    
  },
  methods: {
    // ///判断手机系统
    checkSystem() {
      const u = navigator.userAgent;
      // app = navigator.appVersion;
      let phoneSystem = '';
      const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; // android终端或者uc浏览器
      const isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); // ios终端
      if (isiOS) {
        phoneSystem = '5';
      }
      if (isAndroid) {
        phoneSystem = '4';
      }
      console.log('手机系统是---', phoneSystem);
      return phoneSystem;
    },
    // ///免密登录
    getSignEncrypt() {
      // //取号jssdk
      const that = this;
      const sign = YDRZ.getSign(that.appid, that.version);
      getSignEncrypt({
        sign
      }).then((res) => {
        const params = {
          // 请求的参数
          version: that.version, // 接口版本号 （必填）
          appId: that.appid, // 应用Id （必填）
          sign: res.data.sign, // RSA加密后的sign（必填）
          openType: '1', // 移动取号接口填写1,三网取号接口填写0 （必填，联调时必须填写为1）
          // expandParams: 'phoneNum=18200316068', // 扩展参数  格式：参数名=值  多个时使用 | 分割（选填，联调环境只能模拟取号，联调时需填写phoneNum=188185*****  手机号可以随便填写，生产可不填）
          // isTest: '0' // 是否启用测试线地址（传0时为启用不为0或者不传时为不启用）
        };
        YDRZ.getTokenInfo({
          data: params,
          success(res) {
            // 成功回调
            if (res.code === '000000') {
              console.log('获取token成功', res);
              that.tokenValidate(res);
            } else {
              that.logLoading = false;
              console.log('获取token失败 success', res);
            }
            // res.token, res.userInformation;
          }, // 如果没有编码的话。可更具实际情况进行二次编码。
          error(res) {
            that.logLoading = false;
            console.log('获取号码失败', res);
            // 错误回调
          }
        });
      });
    },
    // ////校验token
    tokenValidate(data) {
      getTokenValidate({
        apptype: '5',
        id: this.appid,
        idtype: '1',
        // key: this.appkey,
        msgid: data.msgId,
        systemtime: this.$moment(new Date()).format('YYYYMMDDhhmmssSSS'),
        token: data.token,
        userInformation: data.userInformation,
        version: this.version
      })
        .then((res) => {
          console.log('校验token成功', res);
          this.phoneNum = res.data;
          this.showPhoneAuth = true;
          if(this.entryChanel === 2 || this.entryChanel === 3) {
            this.getQuestionInfo(true);
          }
        })
        .catch((err) => {
          console.log('校验token失败', err);
        })
        .finally(() => {
          this.logLoading = false;
        });
    },
    // //////验证校验码
    verifySMSLoginVerificationCode() {
      this.confirmLoading = true;
      verifySMSLoginVerificationCode({
        apptype: this.checkSystem(),
        msisdn: this.ruleForm.phone,
        password: this.ruleForm.sms,
        systemtime: this.$moment(new Date()).format('YYYYMMDDhhmmssSSS')
      })
        .then((res) => {
          if (res.code === '0') {
            console.log('验证码验证成功', res);
            this.phoneNum = this.ruleForm.phone;
            if (this.id) {
              this.getQuestionInfo(true);
            }
          }
        })
        .catch((err) => {
          console.log('验证码验证失败', err);
        }).finally(() => {
          this.confirmLoading = false;
        });
    },

    // 查询问卷信息
    getQuestionInfo(needCloseLoading) {
      const fullLoading = this.$loading({fullscreen: true});
      getQuestions({
        key: this.id,
        phone: this.phoneNum
      })
        .then((res) => {
          if(res.code === '0') {
            if (res.data) {
              // const temp = this.deepClone(JSON.parse(res.data.questionJson));
              // temp.forEach((it,index) => {
              //   it.index = index;
              // });
              this.questions = JSON.parse(res.data.questionJson);
              this.footTitle = res.data.questionnaireEndOfReel;
              this.title = res.data.questionnaireName;
              this.subtitle = res.data.questionnairePrelude;
              this.style.questionnaireBackground =
                res.data.questionnaireBackground;
              this.style.questionnaireCover = res.data.questionnaireCover;
              this.style.questionnaireLogo = res.data.questionnaireLogo;
              this.$nextTick(() => {
                if(needCloseLoading) {
                  this.loginVisible = false;
                }
              });
            }
          }else if(res.code === '100007') {
            this.questionInfoCode = 0;
            this.competenceVisible = true;

          }else if(res.code === '100008') {
            this.questionInfoCode = 1 ;
            this.competenceVisible = true;
          }

        })
        .finally(() => {
          fullLoading.close();
        });
    },
    submitForm() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.verifySMSLoginVerificationCode();
          // this.$message.success("验证成功");
          // setTimeout(() => {
          //   this.loginVisible = false;
          // }, 2000);
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    getSMS() {
      this.isYZM = true;
      if (!this.interval) {
        // 获取验证码
        getSMSLoginVerificationCode({
          apptype: this.checkSystem(),
          msisdn: this.ruleForm.phone,
          systemtime: this.$moment(new Date()).format('YYYYMMDDhhmmssSSS')
        })
          .then((res) => {
            if (res.code === '0') {
              console.log('验证码发送成功', res);
              this.interval = setInterval(() => {
                this.seconds -= 1;
                if (this.seconds === -1) {
                  clearInterval(this.interval);
                  this.interval = null;
                  this.seconds = 60;
                }
                if (this.seconds === 0) {
                  this.isYZM = false;
                }
              }, 1000);
            }
          })
          .catch((err) => {
            clearInterval(this.interval);
            this.isYZM = false;
            console.log('验证码发送失败', err);
          });
      }
    },
    // 免密登录一键登录按钮
    handleAutoLogin() {
      if (this.id) {
        this.getQuestionInfo(true);
        this.showPhoneAuth = false;
      }
    },
    // 其他手机号登录
    handleOtherLogin() {
      this.phoneNum = '';
      this.showPhoneAuth = false;
    },
    // 回收问卷
    submitQuestions(data) {
      // TODO 对接免密登录，获取真实请求参数
      const fullLoading = this.$loading({fullscreen: true});
      commitQuestions({
        jsonParam: JSON.stringify(data.data),
        scenceId: this.id,
        telephone: this.phoneNum
      })
        .then((res) => {
          setTimeout(() => {
            this.$refs.preview.setFinished();
          }, 1000);
          console.log(res);
        })
        .finally(() => {
          fullLoading.close();
        });
    },
    // 电话号码转星号
    noPassByMobile(str) {
      if(null !== str && str !== undefined) {
        const pat = /(\d{3})\d*(\d{4})/;
        return str.replace(pat,'$1****$2');
      }
      return '';
    },
    init() {
      try{
        if(aspireweb) {// 如果这个aspireweb不为false，那说明是掌厅进来的
          this.iosAndroidNologin();
        }
      }catch(err) {
        console.log(err);
        console.log('可以走到这里吗');
        this.getEntryGate();
      }
    },
    // 掌厅 免登陆
    iosAndroidNologin() {
      const that = this;
      const {href} = window.location;
      window.__paramsSelected = function(data) {
        document.write('--__paramsSelected--接收的参数为：');
        document.write(data); // 参数显示到页面
        document.write('--------');
        const jsonObject = JSON.parse(data);
        const {scode,ver} = jsonObject;
        // const url = 'https://www.easy-mock.com/mock/59ba4681e0dc663341aa20a2/example/success'
        // const url = 'https://www.easy-mock.com/mock/59ba4681e0dc663341aa20a2/example/fail';
        console.log('scode:===',scode);
        console.log('ver====',ver);
        androidIOSLoginVerify({scode,ver})
          .then((res) => {
            document.write('验证scode和ver成功');
            console.log(res);
            if(res.code === '0') { // 验证scode成功
              that.entryChanel = 3;
            //  that.getSignEncrypt(); // 掌厅验证的scode 和 ver 验证成功后 还是要走短信 那一套逻辑 拿到token
            }else{// 验证scode失败
              setTimeout(() => {
                const jsonObject = {
                  refreshurl: href, // 网页的url
                  channelsign:'00001B'
                };
                aspireweb.ssologin(JSON.stringify(jsonObject));
	            }, 0);
            }
            
          })
          .catch((err) => {
            document.write('出现错误');
            console.log(err);

          });
      };
      window.onload = function() {
        setTimeout(() => {
          const jsonObject = {'jsmethodname':'__paramsSelected', 'channelsign':'00001B'};
          aspireweb.appparamsselect(JSON.stringify(jsonObject));
        }, 0.0);
      };
    },
    // 微厅 免登陆
    wxNologin() {
      let hashstr = window.location.hash;
      hashstr = hashstr.slice(hashstr.indexOf('?') + 1,hashstr.length);
      const paramsobj = {};
      if(hashstr) {
        const paramsArr = hashstr.split('&') || [];
        paramsArr.forEach((item) => {
          const childArr = item.split('=');
          paramsobj[childArr[0]] = paramsobj[childArr[1]];
        });
      }
      // 调接口验证手机号和随机号是否通过
      getRandomValidate(paramsobj)
        .then((res) => {
          console.log(res);
          if(res.code === '0') { // 微厅验证成功后
            this.entryChanel = 2;
            // this.getSignEncrypt(); 
          }else{
            // 微厅验证失败
            document.write('微厅验证失败');
          }
        }).catch((err) => {
          console.log(err);
        });
    },
    // 获取url中的相关信息
    getHrefCode() {
      let hashstr = window.location.hash;
      hashstr = hashstr.slice(0,hashstr.indexOf('?'));
      const arr = hashstr.split('/') || [];
      return arr.length ? arr[arr.length - 1] : '';

    },
    // 获取进入页面的渠道
    getEntryGate() {
      // 改变entryChanel的值根据不同渠道(短信 微信 掌厅)进来的 走不同的流程
      const urlChanelCode = this.getHrefCode();
      document.write('--urlChanelCode:');
      document.write(urlChanelCode);
      if(urlChanelCode) { // 拿到url中有关渠道的字符串调用渠道接口
        getLinkChannelType({key:urlChanelCode})
          .then((res) => {
            console.log(res);
            if(res.code === '0' && res.data.ChannelType === '1') { // 短信进来的
              this.entryChanel = '1'
              this.getSignEncrypt();
            }else if(res.code === '0' && res.data.ChannelType === '2') { // 微信进来的
              this.entryChanel = '2'
              this.wxNologin();
            }else if(res.code === '0' && res.data.ChannelType === '3') { // 掌厅进来的
              this.entryChanel = '3'
              this.iosAndroidNologin();
            }
          });
      }
    }
  }
};
</script>

<style scoped lang="less">
.preview-page {
  position: relative;
  min-height: 100%;
  /deep/ .el-dialog__header {
    background-image: linear-gradient(-90deg, #6ce0ff 2%, #3c99f5 100%);
    padding-top: 10px;
    .el-dialog__title {
      color: white;
    }
  }
  /deep/.el-input-group__append {
    border: 1px solid #409eff !important;
    background-color: #409eff;
    .el-button--primary {
      width: 100px;
      color: #fff;
      background-color: #409eff;
      border-color: #409eff;
      border-radius: 0;
    }
  }
  .login-content {
    position: absolute;
    left: 50%;
    top: 40%;
    transform: translate(-50%, -50%);
    width: 90%;
    max-width: 500px;
    margin-left: -50px;
    .submit-btn {
      width: 100%;
      margin-top: 20px;
    }
    .el-form-item {
      margin-bottom: 30px;
    }
  }
  .phone-auth{
    /deep/ .el-dialog__header{
      /*display: none;*/
      background-image: none;
    }
    img{
      margin: 5vh 0;
    }
    .title{
      font-size: 14px;
      color: #999999;
      margin-bottom: 8px;
    }
    .phone-num{
      font-size: 22px;
      color: black;
      font-weight: bold;
    }
    .phone-desc{
      margin: 20px 10% 0 10%;
      color: #999999;
      text-align: left;
    }
    .el-button{
      width: 50%;
      margin-top: 3vh;
      &.el-button--primary{
        margin-top: 8vh;
      }
    }
  }
  .competence-box{
    /deep/ .el-dialog__header{
      /*display: none;*/
      background-image: none;
    }
    img{
      margin: 5vh 0;
    }
    .title{
      font-size: 14px;
      color: #999999;
      margin-bottom: 8px;
    }
    .competence-msg{
      font-size: 16px;
      // color: black;
      // font-weight: bold;
    }
    .el-button{
      width: 30%;
      margin-top: 4vh;
      border-radius: 4vh;
    }
  }
}
</style>
