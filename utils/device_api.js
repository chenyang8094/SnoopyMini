const defaultServerURL = 'http://192.168.3.4:8080';
const defaultProductKey = 'a1vaGzoafKg';
const defaultDeviceName = 'raspi';

let productKey = defaultProductKey;
let deviceName = defaultDeviceName;

// 设置pk和dn
const configDevice = ({ pk, dn }) => {
  productKey = pk || defaultProductKey;
  deviceName = dn || defaultDeviceName;
};

// 获取pk和dn
const getConfigDevice = () => {
  return {
    productKey,
    deviceName
  };
};

// 获取设备在线状态
const getStatus = (successCb, failCb) => {
  my.request({
    url: `${defaultServerURL}/snoopy/getStatus?productKey=${productKey}&deviceName=${deviceName}`,
    method: 'GET',
    dataType: 'json',
    success: successCb,
    fail: failCb,
    complete: (res) => { }
  });
};

// 获取设备属性
const getProps = (successCb, failCb) => {
  my.request({
    url: `${defaultServerURL}/snoopy/getProperty`,
    method: 'GET',
    data: {
      "productKey": productKey,
      "deviceName": deviceName,
    },
    dataType: 'json',
    success: (res) => {
      let props = {};
      // console.log(res);
      res.data.forEach((prop) => {
        switch (prop.dataType) {
          case 'text':
            props[prop.identifier] = prop.value;
            break;
          case 'int':
            props[prop.identifier] = parseInt(prop.value);
            break;
          case 'array':
            if (prop.value !== undefined)
              props[prop.identifier] = JSON.parse(prop.value);
            break;
          case 'enum':
            props[prop.identifier] = parseInt(prop.value);
            break;
          case 'bool':
            props[prop.identifier] = prop.value === '1';
            break;
          case 'float':
            if (prop.value !== undefined)
              props[prop.identifier] = parseFloat(prop.value);
            break;
          case 'struct':
            if (prop.value !== undefined)
              props[prop.identifier] = JSON.parse(prop.value);
            break;
          default:
            console.error('parse device props error ' + prop.dataType);
            break;
        }
      });
      if (successCb) successCb(props);
    },
    fail: failCb,
    complete: (res) => { }
  });
}

// 设置设备属性
const setAirConditionerSwitchOn = (successCb, failCb) => {
  my.request({
    url: `${defaultServerURL}/snoopy/setProperty`,
    method: 'POST',
    data: {
      "productKey": productKey,
      "deviceName": deviceName,
      "items": `{\"AirConditionerSwitch\":1}`,
    },
    dataType: 'json',
    success: successCb,
    fail: failCb,
    complete: (res) => { }
  });
}
const setAirConditionerSwitchOff = (successCb, failCb) => {
  my.request({
    url: `${defaultServerURL}/snoopy/setProperty`,
    method: 'POST',
    data: {
      "productKey": productKey,
      "deviceName": deviceName,
      "items": `{\"AirConditionerSwitch\":0}`,
    },
    dataType: 'json',
    success: successCb,
    fail: failCb,
    complete: (res) => { }
  });
}

export default {
  configDevice,
  getConfigDevice,
  getStatus,
  getProps,
  setAirConditionerSwitchOn,
  setAirConditionerSwitchOff,
};