import request from '../utils/request';
const {recover} = request.services;

// 问卷回收
export function commitQuestions(data) {
  return request({
    url: `${recover}/ResearchRevoceryCommandController/insert`,
    method: 'post',
    data
  });
}
// 问卷获取
export function getQuestions(data) {
  return request({
    url: `${recover}/ResearchRevoceryCommandController/getQuestion`,
    method: 'post',
    data
  });
}
// //免密登录，加密
export function getSignEncrypt(data) {
  return request({
    url: `${recover}/ResearchSignRead/getSignEncrypt`,
    method: 'post',
    data
  });
}
// //token校验
export function getTokenValidate(data) {
  return request({
    url: `${recover}/ResearchSignRead/getTokenValidate`,
    method: 'post',
    data
  });
}
// ///获取验证码
export function getSMSLoginVerificationCode(data) {
  return request({
    url: `${recover}/researchSms/getSMSLoginVerificationCode`,
    method: 'post',
    data
  });
}
// ///验证验证码
export function verifySMSLoginVerificationCode(data) {
  return request({
    url: `${recover}/researchSms/verifySMSLoginVerificationCode`,
    method: 'post',
    data
  });
}

// 掌厅 验证scode 和 ver 是否通过
export function androidIOSLoginVerify(data) {
  return request({
    url: `${recover}/ResearchWechatRead/getWapSsoVerify`,
    method: 'post',
    data
  });
}

// /ResearchWechatRead/getMobileNo  这个接口获取手机号
export function getMobileNo(data) {
  return request({
    url: `${recover}/ResearchWechatRead/getMobileNo`,
    method: 'post',
    data
  });
}

// /ResearchWechatRead/getRandomValidate   这个接口验证手机号和随机串
export function getRandomValidate(data) {
  return request({
    url: `${recover}/ResearchWechatRead/getRandomValidate`,
    method: 'post',
    data
  });
}

// 获取渠道接口 掌厅 微厅 短信
export function getLinkChannelType(data) {
  return request({
    url: `${recover}/QuestionnarieTestController/getLinkChannelType`,
    method: 'post',
    data
  });
}