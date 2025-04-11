/*!
 * Copyright (c) 2022-Present, IDBase, Inc. and/or its affiliates. All rights reserved.
 * The IDBase software accompanied by this notice is provided pursuant to the Apache License, Version 2.0 (the "License.")
 *
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and limitations under the License.
 */

import axios from "axios";
import router from './router'
import store from './store'
import {  setToken, setExpiresIn } from '@/utils/auth'

const CLIENT_ID = process.env.CLIENT_ID || 'gwt010';
const ISSUER = process.env.ISSUER || 'https://idaut.cnemc.cn';//'https://10.198.12.39:44310';//
//const ISSUER = process.env.ISSUER || 'https://idbase.gwatertech.com';//'http://10.198.10.221:34302';//
const IDBASE_TESTING_DISABLEHTTPSCHECK = process.env.IDBASE_TESTING_DISABLEHTTPSCHECK || false;
const BASENAME = process.env.PUBLIC_URL || '';
const REDIRECT_URI = `${window.location.origin}${BASENAME}/callback`;

const ssoConfig ={
  clientId: CLIENT_ID,
  issuer: ISSUER,
  redirectUri: REDIRECT_URI, 
  scopes: ['openid', 'profile'],
  disableHttpsCheck: IDBASE_TESTING_DISABLEHTTPSCHECK,
  tokenManager:{
    autoRenew: false
  }
}

const localAuthenticated = async () => {
  var name = store.getters['name'];
  if(!name)
    return false;
  return true;
}

const localUser = () => {
  var userInfo = {
    userId: store.getters['userId'],
    username: store.getters['name']
  };
  return userInfo;
}

const onOAuthHandled = ({idbaseAuth, tokens}) => {
  return new Promise((resolve, reject)=>{
      if(!tokens.idToken.claims.local_username){
          reject('未绑定本地用户');
          var originUri = idbaseAuth.getOriginalUri();
          router.replace({
            path: '/login',
            query: { redirect: originUri },
          });
          return
      }
      const config = {
        headers:{
          Authorization : `bearer ${tokens.idToken.idToken}`
        }
      };
      axios.get(process.env.VUE_APP_BASE_API+'/auth/exchange', config).then(response => {        
        console.log(response.data);
        setToken(response.data.token)
        store.commit('SET_TOKEN', response.data.token)
        setExpiresIn(response.data.expiresIn)
        store.commit('SET_EXPIRES_IN', response.data.user.expiresIn)
        store.commit('SET_NAME', response.data.user.username)
        store.commit('SET_USERID', response.data.user.userId)
        //commit('signin', response.data)
        
        resolve(); 
      }).catch(()=>{
        reject('获取本地用户token异常');
      });
  })
}

export const ssoEvents = {
    localAuthenticated: localAuthenticated,
    localUser: localUser,
    onOAuthHandled: onOAuthHandled
}

export default ssoConfig;