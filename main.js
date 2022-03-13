Parse.Cloud.define("saveProfileDetails", async (request) => {
  //new Parse.File("resume.txt", { base64: btoa("My file content") })
    const  parseFile = new  Parse.File(request.params.profileImg.name, request.params.profileImg);
    const responseFile = await  parseFile.save();
    return responseFile;
});

Parse.Cloud.define("updateProfileDetails", async (request) => {
  const User = new Parse.User();
  const query = new Parse.Query('User');
  
  let user = await query.get(request.params.objectId, { useMasterKey: true });
  
  if(request.params.firstName) { user.set('firstName', request.params.firstName); }
  if(request.params.lastName) { user.set('lastName', request.params.lastName); }
  if(request.params.mobile) { user.set('mobile', request.params.mobile); }
  if(request.params.dob) { user.set('dob', request.params.dob); }
  if(request.params.profileImg) { user.set('profileImg', request.params.profileImg ); }
  
  try {
    const result = await user.save(null, { useMasterKey: true });
    return result;
  } catch (error) {
    return error;
  }
});

Parse.Cloud.define("getUserInfo", async (request) => {
    const userId = request.params.userId;
    const queryUserInfo = new Parse.Query("UserInfo");
    queryUserInfo.equalTo("userId", userId);
    const resultUserInfo = await queryUserInfo.find();
    return resultUserInfo[0];
});

/*********Location API************/

Parse.Cloud.define("saveLocationDetails", async (request) => {
    let myNewObject = new Parse.Object('AddressInfo');
    if(request.params.objectId){
      const query = new Parse.Query('AddressInfo');
      myNewObject = await query.get(request.params.objectId);
    }
      
    myNewObject.set('lat', request.params.lat);
    myNewObject.set('long', request.params.long);
    myNewObject.set('name', request.params.name);
    myNewObject.set('address', request.params.address);
    myNewObject.set('city', request.params.city);
    myNewObject.set('pin', request.params.pin);
    myNewObject.set('state', request.params.state);
    myNewObject.set('country', request.params.country);
    myNewObject.set('userId', request.params.userId);
    try {
      const result = await myNewObject.save();
      return result;
    } catch (error) {
      return error;
    }
});

Parse.Cloud.define("getCustomerLocation", async (request) => {
    const userId = request.params.userId;
    const queryLocationInfo = new Parse.Query("AddressInfo");
    queryLocationInfo.equalTo("userId", userId);
    const resulLocationInfo = await queryLocationInfo.find();
    return resulLocationInfo[resulLocationInfo.length - 1];
});

/*********Laundry API************/

Parse.Cloud.define("getAllLaundryList", async (request) => {
  
  //const LaundryInfo = Parse.Object.extend('LaundryInfo');
  const queryLaundryList = new Parse.Query('LaundryInfo');
  queryLaundryList.select('name');
  queryLaundryList.select('bannerImg');
  queryLaundryList.select('long');
  queryLaundryList.select('lat');
  queryLaundryList.select('avgRating');
  queryLaundryList.select('address');
  queryLaundryList.select('laundryId');
  try {
    const result = await queryLaundryList.find();
    return result;
  } catch (error) {
    return error;
  }
});

Parse.Cloud.define("getLaundryById", async (request) => {
    const laundryId = request.params.laundryId;
    const queryLaundryInfo = new Parse.Query("LaundryInfo");
    const queryLaundryServicesInfo = new Parse.Query("LaundryServicesInfo");
    queryLaundryInfo.equalTo("laundryId", laundryId);
    queryLaundryServicesInfo.equalTo("laundryId", laundryId);
    const resultLaundryInfo = await queryLaundryInfo.find();
    const resultLaundryServicesInfo = await queryLaundryServicesInfo.find();
    return [resultLaundryInfo, resultLaundryServicesInfo];
});

Parse.Cloud.define("updateLaundryInfo", async (request) => {
  const query = new Parse.Query('LaundryInfo');
  const object = await query.get(request.params.laundryObjectId);
  if(request.params.avgRating){ object.set(request.params.avgRating, parseInt(request.params.avgRating)); }
  
  const response = await object.save();
  return response;
});

/*********Order API************/

Parse.Cloud.define("saveOrderDetails", async (request) => {
    const laundryInfoId = request.params.laundryInfoId;
    const laundryInfoRef = {
        __type: 'Pointer',
        className:'LaundryInfo',
        objectId: laundryInfoId
    }
     const userIdRef = {
        __type: 'Pointer',
        className:'User',
        objectId: request.params.userId
    }
    //return laundryInfoRef;
    const myNewObject = new Parse.Object('OrderDetails');
    myNewObject.set('address', request.params.address);
    myNewObject.set('landmark', request.params.landmark);
    myNewObject.set('pickupDate', request.params.pickupDate);
    myNewObject.set('deliveryDate', request.params.deliveryDate);
    myNewObject.set('services', request.params.services);
    myNewObject.set('userIdRef', userIdRef);
    myNewObject.set('userId', request.params.userId);
    myNewObject.set('laundryId', request.params.laundryId);
    myNewObject.set('riderId', request.params.riderId);
    myNewObject.set('orderStatus', request.params.orderStatus);
    myNewObject.set('pickupCode', request.params.pickupCode);
    myNewObject.set('deliveryCode', request.params.deliveryCode);
    myNewObject.set('isPaid', request.params.isPaid);
    myNewObject.set('grandTotal', request.params.grandTotal);
    myNewObject.set('laundryInfoRef', laundryInfoRef);
    myNewObject.set('paymentId', request.params.paymentId);
    myNewObject.set('userName', request.params.userName);
    myNewObject.set('userMobile', request.params.userMobile);
    try {
      const result = await myNewObject.save();
      return result;
    } catch (error) {
      return error;
    }
});

Parse.Cloud.define("getCustomerOrders", async (request) => {
    const userId = request.params.userId;
    const queryOrderInfo = new Parse.Query("OrderDetails");
    queryOrderInfo.equalTo("userId", userId);
    queryOrderInfo.include("laundryInfoRef");
    const resulOrderInfo = await queryOrderInfo.find();
    
    return resulOrderInfo;
});

/*************Gopis API*****************/

Parse.Cloud.define("getProfileDetails", async (request) => {
  const queryProfileInfo = new Parse.Query("LaundryInfo");
  queryProfileInfo.equalTo("laundryId", request.params.laundryId);
  const result = await queryProfileInfo.find();
  return result;
});

Parse.Cloud.define("getVendorHistory", async (request) => {
  const laundryId = request.params.laundryId;
  const queryOrderInfo = new Parse.Query("OrderDetails");
 
  queryOrderInfo.equalTo("laundryId", laundryId);
  queryOrderInfo.equalTo("orderStatus",5);
  queryOrderInfo.include("userIdRef",{ useMasterKey: true });
  const resulOrderInfo = await queryOrderInfo.find({ useMasterKey: true });
  
  return resulOrderInfo;
});

Parse.Cloud.define("CreateRiderService", async (request) => {
  const riderObject = new Parse.Object("User");
  riderObject.set("email", request.params.email);
  riderObject.set("username", request.params.email);
  riderObject.set("firstName", request.params.firstname);
  riderObject.set("lastName", request.params.lastname);
  riderObject.set("mobile", request.params.phone);
  riderObject.set("password", request.params.password);
  riderObject.set("role", "rider");

  try {
    const result = await riderObject.save();
    return result;
  } catch (error) {
    return error;
  }
});

Parse.Cloud.define("getAllRidersDetails", async (request) => {
    const riderObject = new Parse.Query("User");
    riderObject.equalTo("role","rider");
    riderObject.equalTo("parentId",request.params.laundryId)
    const result = await riderObject.find();
    return result;
});

Parse.Cloud.define("CreateVendorService", async (request) => {
  const serviceObject = new Parse.Object("LaundryServicesInfo");
  serviceObject.set("itemName", request.params.itemName);
  serviceObject.set("laundryId", request.params.laundryId);
  serviceObject.set("laundryPrice", request.params.laundryPrice);
  serviceObject.set("dryCleanPrice", request.params.dryCleanPrice);
  serviceObject.set("pressPrice", request.params.pressPrice);
  
  try {
    const result = await serviceObject.save();
    return result;
  } catch (error) {
    return error;
  }
});

Parse.Cloud.define("UpdateVendorService", async (request) => {
  const serviceObject = new Parse.Query("LaundryServicesInfo");
  serviceObject.equalTo("laundryId", request.params.laundryId);
  const services = await serviceObject.first();
  services.set("itemName", request.params.itemName);
  services.set("laundryPrice", request.params.laundryPrice);
  services.set("dryCleanPrice", request.params.dryCleanPrice);
  services.set("pressPrice", request.params.pressPrice);
  
  try {
    const result = await services.save();
    return result;
  } catch (error) {
    return error;
  }
});

Parse.Cloud.define("getAllServicesDetails", async (request) => {
  const riderObject = new Parse.Query("LaundryServicesInfo");
  riderObject.equalTo("laundryId", request.params.laundryId);
  const result = await riderObject.find();
  return result;
});

Parse.Cloud.define("setServicesDetails", async (request) => {
  const riderObject = new Parse.Query("LaundryServicesInfo");
  riderObject.equalTo("objectId", request.params.serviceId);
  const result = await riderObject.first();
  
  result.set("itemName",request.params.itemName);
  result.set("laundryPrice",request.params.laundryPrice);
  result.set("dryCleanPrice",request.params.dryCleanPrice);
  result.set("pressPrice",request.params.pressPrice);
try {
    const res = await result.save();
    return res;
  } catch (error) {
    return error;
  }
});

Parse.Cloud.define("getServicesById", async (request) => {
  const riderObject = new Parse.Query("LaundryServicesInfo");
  riderObject.equalTo("objectId", request.params.serviceId);
  const result = await riderObject.first();
  return result;
});

Parse.Cloud.define("getVendorOrderList", async (request) => {
  const laundryId = request.params.laundryId;
  const queryOrderInfo = new Parse.Query("OrderDetails");
 
  queryOrderInfo.equalTo("laundryId", laundryId);
  queryOrderInfo.include("userIdRef",{ useMasterKey: true });
  const resulOrderInfo = await queryOrderInfo.find({ useMasterKey: true });
  
  return resulOrderInfo;
});

Parse.Cloud.define("getVendorOrderById", async (request) => {
  const orderId = request.params.orderId;
  const queryOrderInfo = new Parse.Query("OrderDetails");

  queryOrderInfo.equalTo("objectId", orderId);
  
  const resulOrderInfo = await queryOrderInfo.first();
  
  return resulOrderInfo;
});

Parse.Cloud.define("ChangeOrderStatus", async (request) => {
  const orderId = request.params.orderId;
  const queryOrderInfo = new Parse.Query("OrderDetails");
  queryOrderInfo.equalTo("objectId", orderId);
  const resultOrderInfo = await queryOrderInfo.first();
  resultOrderInfo.set("orderStatus", request.params.orderStatus);
  try {
    const result = await resultOrderInfo.save();
    return result;
  } catch (error) {
    return error;
  }
});

Parse.Cloud.define("AssignRider", async (request) => {
  const orderId = request.params.orderId;
  const riderId = request.params.riderId;
 
   const queryOrderInfo = new Parse.Query("OrderDetails");
  queryOrderInfo.equalTo("objectId", orderId);
  const resultOrderInfo = await queryOrderInfo.first();
  resultOrderInfo.set("orderStatus", request.params.orderStatus);
  resultOrderInfo.set("riderId",riderId);
  
  try {
    const result = await resultOrderInfo.save();
    return result;
  } catch (error) {
    return error;
  }
});

Parse.Cloud.define("DeliveryAssignRider", async (request) => {
  const orderId = request.params.orderId;
  const queryOrderInfo = new Parse.Query("OrderDetails");
  queryOrderInfo.equalTo("objectId", orderId);
  const resultOrderInfo = await queryOrderInfo.first();
  resultOrderInfo.set("orderStatus", request.params.orderStatus);
  resultOrderInfo.set("riderId",request.params.riderId)
  try {
    const result = await resultOrderInfo.save();
    return result;
  } catch (error) {
    return error;
  }
});

Parse.Cloud.define("getRidersOrders", async (request) => {
  const riderId = request.params.riderId;
  const queryOrderInfo = new Parse.Query("OrderDetails");
  queryOrderInfo.equalTo("riderId", riderId);
  const resulOrderInfo = await queryOrderInfo.find();
  
    const DeliveryOrderinfo = new Parse.Query("OrderDetails");
  DeliveryOrderinfo.equalTo("deliveryRiderId", riderId);
  const deliveryResult = await DeliveryOrderinfo.find();
  return [resulOrderInfo, deliveryResult];
});

Parse.Cloud.define("getRidersOrdersHistory", async (request) => {
  const riderId = request.params.riderId;
  const queryOrderInfo = new Parse.Query("OrderDetails");

  queryOrderInfo.equalTo("riderId", riderId);
  queryOrderInfo.equalTo("orderStatus",5);
  
  const resulOrderInfo = await queryOrderInfo.find();
  
  return resulOrderInfo;
});

Parse.Cloud.define("pickupOTPVerification", async (request) => {
  const orderId = request.params.orderId;
  const queryOrderInfo = new Parse.Query("OrderDetails");

  queryOrderInfo.equalTo("objectId", orderId);
  queryOrderInfo.equalTo("pickupCode",request.params.pickupCode);
  queryOrderInfo.equalTo('riderId',request.params.riderId);
  const resulOrderInfo = await queryOrderInfo.first();
  resulOrderInfo.set("orderStatus",2);
   try {
    const result = await resulOrderInfo.save();
    return result;
  } catch (error) {
    return error;
  }
});

Parse.Cloud.define("deliveryOTPVerification", async (request) => {
  const orderId = request.params.orderId;
  const queryOrderInfo = new Parse.Query("OrderDetails");

  queryOrderInfo.equalTo("objectId", orderId);
  queryOrderInfo.equalTo("deliveryCode",request.params.deliveryCode);
  queryOrderInfo.equalTo('riderId',request.params.riderId);
  const resulOrderInfo = await queryOrderInfo.first();
  resulOrderInfo.set("orderStatus",5);
   try {
    const result = await resulOrderInfo.save();
    return result;
  } catch (error) {
    return error;
  }
});

Parse.Cloud.define("setLaundryInfo", async (request) => {
  const InfoObject = new Parse.Object("LaundryInfo");
  InfoObject.set("laundryId", request.params.laundryId);
  InfoObject.set("name", request.params.name);
  InfoObject.set("about", request.params.about);
  InfoObject.set("address", request.params.address);
  InfoObject.set("galleryImg1", request.params.galleryImg1);
  InfoObject.set("galleryImg2", request.params.galleryImg2);
  InfoObject.set("galleryImg3", request.params.galleryImg3);
  InfoObject.set("bannerImg", request.params.bannerImg);
  InfoObject.set("long", request.params.long);
  InfoObject.set("lat", request.params.lat);
  InfoObject.set("avgRating",0);
  //return request.params;
  try {
    const result = await InfoObject.save();
    return result;
  } catch (error) {
    return error;
  }
});

Parse.Cloud.define("UpdateLaundryInfo", async (request) => {
  const InfoObject = new Parse.Query("LaundryInfo");
  InfoObject.equalTo("laundryId", request.params.laundryId);
  const Inforesult = await InfoObject.first();
  Inforesult.set("name", request.params.name);
  Inforesult.set("about", request.params.about);
  Inforesult.set("address", request.params.address);
  Inforesult.set("galleryImg1", request.params.galleryImg1);
  Inforesult.set("galleryImg2", request.params.galleryImg2);
  Inforesult.set("galleryImg3", request.params.galleryImg3);
  Inforesult.set("bannerImg", request.params.bannerImg);
  Inforesult.set("long", request.params.long);
  Inforesult.set("lat", request.params.lat);
  Inforesult.set("avgRating",0);
  //return request.params;
  try {
    const result = await Inforesult.save();
    return result;
  } catch (error) {
    return error;
  }
});

Parse.Cloud.define("getupcomingLaundrydetails",async(request)=>{
  const laundryId = request.params.laundryId
  const UpcomingDetails = new Parse.Query('OrderDetails');
  UpcomingDetails.equalTo("orderStatus",0);
  UpcomingDetails.equalTo("laundryId",laundryId)
  const upcoming = await UpcomingDetails.count()
  
  const PickupDetails = new Parse.Query("OrderDetails");
  PickupDetails.equalTo("orderStatus",1);
  PickupDetails.equalTo("laundryId",laundryId)
  const pickup = await PickupDetails.count()
  
   const inlaundryDetails = new Parse.Query("OrderDetails");
  inlaundryDetails.equalTo("orderStatus",2);
  inlaundryDetails.equalTo("laundryId",laundryId)
  const laundry = await inlaundryDetails.count()
  
   const deliveryDetails = new Parse.Query("OrderDetails");
  deliveryDetails.equalTo("orderStatus",3);
  deliveryDetails.equalTo("laundryId",laundryId)
  const delivery = await deliveryDetails.count()
  
   const completedDetails = new Parse.Query("OrderDetails");
  completedDetails.equalTo("orderStatus",5);
  completedDetails.equalTo("laundryId",laundryId)
  const completed = await completedDetails.count()
  
  return {upcoming: upcoming,pickup: pickup,laundry:laundry,delivery:delivery,completed:completed}
});


Parse.Cloud.define("deleteService",async (request) => {
    const serviceId = request.params.serviceId;
    const query = new Parse.Query('LaundryServicesInfo');
  try {
    // here you put the objectId that you want to delete
    const object = await query.get(serviceId);
    try {
      const response = await object.destroy();
      return response;
    } catch (error) {
      return error;
    }
  } catch (error) {
    return error;
  }

});

Parse.Cloud.define("getupcomingRaiderdetails",async(request)=>{
  const riderId = request.params.riderId
  const UpcomingDetails = new Parse.Query('OrderDetails');
  UpcomingDetails.equalTo("riderId",riderId)
  const upcoming = await UpcomingDetails.count()
  
  const PickupDetails = new Parse.Query("OrderDetails");
  PickupDetails.equalTo("orderStatus",5);
  PickupDetails.equalTo("riderId",riderId)
  const delivery = await PickupDetails.count()
  
  return {upcoming: upcoming,delivery:delivery}
});