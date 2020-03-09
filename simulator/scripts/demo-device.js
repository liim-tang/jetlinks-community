/**
 * 烟感设备模拟器
 */
var _logger = logger;
//设备实例id前缀
var devicePrefix = "demo-";

var eventId = Math.ceil(Math.random() * 1000);
//事件类型
var events = {
    reportProperty: function (index, session) {
        var deviceId = devicePrefix + index;
        var topic = "/report-property";
        var json = JSON.stringify({
            "deviceId": deviceId,
            "success": true,
            "timestamp": new Date().getTime(),
            properties: {"temperature": java.util.concurrent.ThreadLocalRandom.current().nextInt(20, 30)},
        });
        session.sendMessage(topic, json)
    },
    fireAlarm: function (index, session) {
        var deviceId = devicePrefix + index;
        var topic = "/fire_alarm/department/1/area/1/dev/" + deviceId;
        var json = JSON.stringify({
            "deviceId": deviceId, // 设备编号 "pid": "TBS-110", // 设备编号
            "a_name": "商务大厦", // 区域名称 "bid": 2, // 建筑 ID
            "b_name": "C2 栋", // 建筑名称
            "l_name": "12-05-201", // 位置名称
            "timestamp": new Date().getTime() // 消息时间
        });

        session.sendMessage(topic, json)
    }
};

//事件上报
simulator.onEvent(function (index, session) {
    //上报属性
    events.reportProperty(index, session);

    //上报火警
    events.fireAlarm(index, session);
});

simulator.bindHandler("/read-property", function (message, session) {
    _logger.info("读取属性:[{}]", message);
    session.sendMessage("/read-property-reply", JSON.stringify({
        messageId: message.messageId,
        deviceId: message.deviceId,
        timestamp: new Date().getTime(),
        properties: {"temperature": java.util.concurrent.ThreadLocalRandom.current().nextInt(20, 30)},
        success: true
    }));
});

simulator.bindHandler("/children/read-property", function (message, session) {
    _logger.info("读取子设备属性:[{}]", message);
    session.sendMessage("/children/read-property-reply", JSON.stringify({
        messageId: message.messageId,
        deviceId: message.deviceId,
        timestamp: new Date().getTime(),
        properties: {"temperature": java.util.concurrent.ThreadLocalRandom.current().nextInt(20, 30)},
        success: true
    }));
});


simulator.bindHandler("/invoke-function", function (message, session) {
    _logger.info("调用功能:[{}]", message);
    session.sendMessage("/invoke-function", JSON.stringify({
        messageId: message.messageId,
        deviceId: message.deviceId,
        timestamp: new Date().getTime(),
        output: "ok", //返回结果
        success: true
    }));
});


simulator.onConnect(function (session) {
    // _logger.info("[{}]:连接成功", session.auth.clientId);
});

simulator.onAuth(function (index, auth) {

    auth.setClientId(devicePrefix + index);
    auth.setUsername("admin");
    auth.setPassword("admin");
});