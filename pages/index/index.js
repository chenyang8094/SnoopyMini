import deviceApi from '/utils/device_api';

Page({
  data: {
    tabs: [
      {
        title: '主卧',
        badgeType: 'text',
        badgeText: '6',
      },
      {
        title: '次卧',
        badgeType: 'dot',
      },
      { title: '客厅' },
      { title: '书房' },
      { title: '设备管理' },
    ],
    activeTab: 0,
    selectDevice: {},
    watchtimer: {},

    masterRoomTemperature: 0.0,
    masterRoomHumidity: 0,
    masterRoomBrightness: 0,
    masterRoomAirPowerSwitchImage: "../../images/power_off.png",
    masterRoomLightPowerSwitchImage: "../../images/power_off.png",
    masterRoomCurtainPowerSwitchImage: "../../images/power_off.png",
    masterRoomAirPowerSwitch: false,
    masterRoomLightPowerSwitch: false,
    masterRoomCurtainSwitch: false,

  },
  handleTabClick({ index }) {
    this.setData({
      activeTab: index,
    });
  },
  handleTabChange({ index }) {
    this.setData({
      activeTab: index,
    });
  },
  airPowerSwitchOntap(){
     deviceApi.getProps((props) => {
      if (props.AirConditionerSwitch == true){
         deviceApi.setAirConditionerSwitchOff((res) => {
           console.info(res)
            if(res.data == "success"){
              this.setData({
                    masterRoomAirPowerSwitchImage: "../../images/power_off.png",
              });
            }
          }, (err) => {
          // my.alert({content: '设备离线'});
          })
      }else{
         deviceApi.setAirConditionerSwitchOn((res) => {
            if(res.data == "success"){
              this.setData({
                    masterRoomAirPowerSwitchImage: "../../images/power_on.png",
              });
            }
         }, (err) => {
         // my.alert({content: '设备离线'});
         })
      }
    })
  },
  lightPowerSwitchOntap(){
     this.setData({
      masterRoomLightPowerSwitchImage: "../../images/power_on.png",
    });
  },
  curtainPowerSwitchOntap(){
     this.setData({
      masterRoomCurtainPowerSwitchImage: "../../images/power_on.png",
    });
  },
  onLoad(query) {
    // 页面加载
    console.info(`Page onLoad with query: ${JSON.stringify(query)}`);
  },
  onReady() {
    // 页面加载完成
  },
  onShow() {
    // 页面显示
    let that = this;
    let selectDevice = this.data.selectDevice;
    let watchtimer = this.data.watchtimer;
    let masterRoomAirPowerSwitchImage =  this.data.masterRoomAirPowerSwitchImage;
    let masterRoomAirPowerSwitch = this.data.masterRoomAirPowerSwitch;
    selectDevice.DeviceName = deviceApi.getConfigDevice().deviceName;

    watchtimer = setInterval(()=>{
      deviceApi.getStatus((res) => {
        // console.log(res);
        switch (res.data) {
          case "ONLINE":
            selectDevice.online = true;
            break;
          case "OFFLINE":
            selectDevice.online = false;
            break;
          default:
            selectDevice.online = false;
            break;
        };
        that.setData({
          selectDevice,
        })
      });

      deviceApi.getProps((props) => {
      //  console.log(props);
       that.setData({
         masterRoomTemperature:props.Temperature,
         masterRoomHumidity:props.AirHumidity,
         masterRoomBrightness:props.Brightness,
      })

      if (props.AirConditionerSwitch == true){
        that.setData({
          masterRoomAirPowerSwitchImage:"../../images/power_on.png",
        })
      }else{
        that.setData({
          masterRoomAirPowerSwitchImage:"../../images/power_off.png",
        })
      }
    }, (err) => {
      // my.alert({content: '设备离线'});
    });
    },1000)
  },
  onHide() {
    // 页面隐藏
  },
  onUnload() {
    // 页面被关闭
    clearInterval(watchtimer)
  },
  onTitleClick() {
    // 标题被点击
  },
  onPullDownRefresh() {
    // 页面被下拉
  },
  onReachBottom() {
    // 页面被拉到底部
  },
  onShareAppMessage() {
    // 返回自定义分享信息
    return {
      title: 'Snoopy',
      desc: 'Snoopy alipay mini',
      path: 'pages/index/index',
    };
  },
});
